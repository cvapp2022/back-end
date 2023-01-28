const { validationResult } = require('express-validator')
const MessageModel=require('../../../../../models/mn/Session/SessionMessage')
const SessionModel = require('../../../../../models/mn/Meet/MeetSession')
exports.Save=function(req,res){


    //validate param
    var sessionId = req.params.sessionId;

    //validate inputs
       //validate inputs 
       const errors = validationResult(req);

       if (errors.errors.length > 0) {
           return res.json({
               success: false,
               payload: errors.errors,
               msg: 'Validation Error'
           });
       }

    var saveMessage = new MessageModel();
    saveMessage.MessageSender = req.body.msgFromI;
    saveMessage.MessageSession = sessionId;
    saveMessage.MessageValue = req.body.msgValueI;
    if (req.body.msgFromI === 'user') {
        saveMessage.MessageUser = req.body.msgSenderIdI;
    }
    else {
        saveMessage.MessageMentor = req.body.msgSenderIdI;
    } 

    saveMessage.save(function (err, result) {

        if (!err && result) {

            //find and push message to sessionMessages array 
            SessionModel.findById(sessionId,function(err2,result2){

                if(!err2 && result2){
                    result2.SessionMessage.push(result._id)
                    result2.save()
                    var io=req.app.get('socketio');
                    io.to(result2.SessionId).emit('MN_SESSION_MESSAGE_SENT', result)
                    return res.json({
                        success: true,
                        payload: result,
                        msg: 'Message Succesfully Saved'
                    });
                }
            })

        }
    })


}