const SessionModel = require('../../../../models/mn/Meet/MeetSession')
const MeetModel = require('../../../../models/mn/MnMeetSchema')
const MnSessionAttachmentModel = require('../../../../models/mn/Session/SessionAttachment')
const MnRequestModel = require('../../../../models/mn/MnRequestSchema')
const facades = require('../../../../others/facades')
const population = require('../../../../others/populations')


module.exports.Save = async function (req, res) {

    //validate input
    if (!req.body.MeetIdI) {
        return res.json({
            success: false,
            payload: null,
            message: 'validation error'
        })
    }


    //create folder for session
    var random = (Math.random() + 1).toString(36).substring(4);

    var folderId= await facades.createFolder(random, 'session')
    console.log(folderId)
    if(!folderId){
        return res.json({
            success: false,
            payload: null,
            message: 'unable to create session folder'
        })
    }

    //save session 
    var saveSession = new SessionModel();
    saveSession.SessionFolder = folderId;
    saveSession.SessionId = random;
    saveSession.SessionMeet = req.body.MeetIdI;
    saveSession.save().then((result)=>{
            //push session to meet
            MeetModel.findById(req.body.MeetIdI, function (err2, result2) {
        
                if (!err2 && result2) {
                    result2.MeetSession.push(result._id)
                    result2.save();
        
                    //get request
                    MnRequestModel.findById(result2.MeetRequest._id,function(err3,result3){
        
                        //trigger user 
                        var io = req.app.get('socketio');
                        io.to(result2.MeetRequest.ReqUser.toString()).emit('SESSION_CREATED',result3)
        
                        //get user and send notif to it
                        facades.saveNotif('user', result3.ReqUser, 'RedirectToSession', 'notifSessionReady',{},true,io)
        
                        return res.json({
                            success: true,
                            payload: result,
                            message: 'Session Successfully created'
                        })
        
                    }).populate(population.RequestPopulation)
        
                }
                else {
                    return res.json({
                        success: false,
                        payload: null,
                        message: 'Unable to find Meet'
                    })
                }
        
            }).populate('MeetRequest')

        })

    // })

    //     console.log(err)
    //     if (!err && result) {


    //     }
    //     else {
    //         return res.json({
    //             success: false,
    //             payload: null,
    //             message: 'Unable to create Session'
    //         })
    //     }

    // });
}

exports.Upload = function (req, res) {

    //validate input 
    var sessionId = req.params.sessionId;
    //get Session Folder
    SessionModel.findById(sessionId, function (err, result) {
        if (!err && result) {

            facades.uploadFileTo(req.file, 'session', result.SessionFolder, function (fileId) {

                //save Session Attachment
                var saveAttachment = new MnSessionAttachmentModel();
                saveAttachment.AttachmentName = req.file.originalname;
                saveAttachment.AttachmentFileId = fileId;
                saveAttachment.AttachmentSession = sessionId;
                saveAttachment.save(function (err2, result2) {
                    if (!err2 && result2) {
                        //push session to attachments
                        result.SessionAttachments.push(result2._id)
                        result.save();

                        //fetch all files
                        MnSessionAttachmentModel.find({ AttachmentSession: sessionId }, function (err3, result3) {

                            var io = req.app.get('socketio');
                            console.log(result.SessionId)
                            io.to(result.SessionId).emit("FILE_UPLOADED", result3);

                            return res.json({
                                success: true,
                                payload: result3,
                                msg: 'File Successfully Uploaded'
                            });
                            //return res.json(result3);
                        })

                    }
                })
            })

        }

    }).populate('SessionAttachments')

}
