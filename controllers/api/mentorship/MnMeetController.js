const { validationResult } = require('express-validator')
const MnMeetModel = require('../../../models/mn/MnMeetSchema')
const MnProgramModel = require('../../../models/mn/MnProgramSchema')
const MnRequestModel = require('../../../models/mn/MnRequestSchema')
const facades = require('../../../others/facades')
const { RequestPopulation } = require('../../../others/populations')
// exports.Save = function (req, res) {


//     //validate inputs 
//     const errors = validationResult(req);

//     if (errors.errors.length > 0) {
//         return res.json({
//             success: false,
//             payload: errors.errors,
//             msg: 'Validation Error'
//         });
//     }

//     var requestId = req.body.MeetRequestIdI;

//     //get request 
//     MnRequestModel.findById(requestId, function (err, result) {
//         if (!err && result) {

//             //get program and meets 
//             Promise.all([MnProgramModel.findById(result.ReqProg), MeetModel.find({ MeetRequest: requestId, })]).then((val) => {

//                 var program = val[0];
//                 var meets = val[1];

//                 //check program meet count
//                 console.log(program.ProgMeetsNum <= meets.length)
//                 if (program.ProgMeetsNum <= meets.length) {
//                     return res.json({
//                         success: false,
//                         payload: null,
//                         msg: 'unable to add new meet because of program meets limit'
//                     });
//                 }
//                 else {

//                     //mentor
//                     var mentor = req.user;
//                     //generate random unique token
//                     var random = (Math.random() + 1).toString(36).substring(4);

//                     //save meet 
//                     var SaveMeet = new MeetModel();
//                     SaveMeet.MeetName = random;
//                     SaveMeet.MeetId = random;
//                     SaveMeet.MeetDate = req.body.MeetDateI;
//                     SaveMeet.MeetRequest = requestId;
//                     SaveMeet.MeetMentor = mentor._id;
//                     SaveMeet.save(function (err3, result3) {
//                         if (!err3) {

//                             //update request status to active 
//                             result.ReqState = 'active';
//                             //push meet to request Meets
//                             result.ReqMeets.push(result3._id)
//                             result.save();
//                             return res.json({
//                                 success: true,
//                                 payload: result3,
//                                 msg: 'Meet Successfully Saved'
//                             });
//                         }
//                         else {
//                             return res.json({
//                                 success: false,
//                                 payload: null,
//                                 msg: 'Unable to save meet'
//                             });
//                         }
//                     })
//                 }
//             })
//         }
//     })
// }

exports.Update =async function (req, res) {

    //validate params 
    var meetId = req.params.meetId;

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    var query = {
        MeetDate: req.body.MeetDateI
    }

    //get count of meet has same date 
    var meetCount=await MnMeetModel.find(query).then((result)=>{
        return result.length;
    })

    if(meetCount > 10){
        return res.json({
            success: false,
            payload: null,
            msg: 'Unable to Schedule Meet At this date Platform is busy'
        });
    }
    else{

        MnMeetModel.findOneAndUpdate({ _id: meetId }, query, function (err, result) {
            if (!err && result) {
                //get request 
                MnRequestModel.findById(result.MeetRequest._id,function(err2,result2){
    
                    if(!err2 && result2){
    
                        //trigger user 
                        var io = req.app.get('socketio');
                        io.to(result.MeetRequest.ReqUser.toString()).emit('MEET_SCHEDULED',result2)
    
                        //get user and send notif to it
                        facades.saveNotif('user', result.MeetRequest.ReqUser, 'RedirectToMeet', 'notifMeetSchedueld',{},true,io)
            
                        return res.json({
                            success: true,
                            payload: result,
                            msg: 'Meet Successfully Updated'
                        });
                    }
    
                }).populate(RequestPopulation)
    
            }
        }).populate('MeetRequest')
    }



}