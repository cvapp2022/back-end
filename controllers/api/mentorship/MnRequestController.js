const { validationResult } = require('express-validator')
const MnRequestModel = require('../../../models/mn/MnRequestSchema')
const UserModel = require('../../../models/UserSchema')
const MnProgramModel = require('../../../models/mn/MnProgramSchema')
const MnMentorModel = require('../../../models/MentorSchema')
const MnMeetModel = require('../../../models/mn/MnMeetSchema')
const populate = require('../../../others/populations')
const facades = require('../../../others/facades')


module.exports.Get = async function (req, res) {

    var type = req.params.type;
    var user = req.user;
    let query;
    if (type === 'user') {
        query = { ReqUser: user._id }
    }
    else if (type === 'mentor') {
        var programsArr;
        await MnMentorModel.findById(user._id).then((result) => {
            if (result) {
                programsArr = result.MentorPrograms;
            }
        })
        query = { ReqProg: { $in: programsArr },ReqState:{$in:['searching','applied','active']}};
    }

    //get requests dates 
    MnRequestModel.find(query, function (err2, result2) {
        if (!err2) {
            return res.json({
                success: true,
                payload: result2,
                message: 'Requests Successfully loaded'
            })
        }

    }).populate(populate.RequestPopulation)
}

module.exports.Save = function (req, res) {


    //user id
    var userId = req.user._id;

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //check program request 
    MnProgramModel.findOne({ _id: req.body.requestProgramIdI, ProgStatus: 1 }, function (err, result) {

        if (!err && result) {
            //check user has no active requests in program
            MnRequestModel.find({ ReqUser: userId, ReqProg: req.body.requestProgramIdI }, function (err2, result2) {
                if (!err2 && result2.length > 0) {
                    return res.json({
                        success: false,
                        payload: null,
                        message: 'Unable To Save Request ,Already Has Request '
                    })
                }
                else {
                    var saveRequest = MnRequestModel();
                    saveRequest.ReqType = req.body.requestTypeI;
                    saveRequest.ReqProg = req.body.requestProgramIdI;
                    saveRequest.ReqSource = 'website';
                    saveRequest.ReqDates = req.body.requestDatesI
                    saveRequest.ReqUser = userId;
                    saveRequest.save(function (err3, result3) {

                        if (!err3 && result3) {

                            //push request to user mn requests       
                            UserModel.findOne({ _id: userId }, function (err4, result4) {
                                console.log(err4)

                                if (result4 && !err4) {
                                    result4['MNRequests'].push(result3._id)
                                    result4.save();
                                }
                            })
                            MnRequestModel.populate(result3, populate.RequestPopulation, function (err5, result5) {

                            //trigger user 
                            var io = req.app.get('socketio');
                            facades.saveNotif('user', userId, 'RedirectToRequests', 'notifRequestRegisterd',{}, true, io)

                                
                                return res.json({
                                    success: true,
                                    payload: result5,
                                    message: 'Request Successfully saved'
                                })
                            })
                        }
                        else {
                            return res.json({
                                success: false,
                                payload: null,
                                message: 'Unable to save Request '
                            })
                        }

                    })
                }
            })

        } else {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to find program'
            })

        }

    })
}


module.exports.Update = function (req, res) {

    var user = req.user

    //validate input 
    if (!req.body.DatesI || req.body.DatesI.length == 0) {
        return res.json({
            success: false,
            payload: null,
            message: 'Validation Error'
        })
    }

    //validate params

    //update request 
    var query = { ReqDates: req.body.DatesI };
    MnRequestModel.findByIdAndUpdate(req.params.reqId, query, function (err, result) {

        if (!err && result) {

            //send notif to mentor
            if (result.ReqState === 'applied' && result.ReqState === 'active') {

                var io = req.app.get('socketio');
                facades.saveNotif('mentor', result.ReqMentor, 'RedirectToRequest', 'user updated mentorship request',{}, true, io)
            }

            return res.json({
                success: true,
                payload: result,
                message: 'Request Dates Successfully Updated'
            })
        }

    })

}

module.exports.Pay = function (req, res) {

    var user = req.user;

    //update Request state 
    MnRequestModel.findById(req.params.reqId, function (err, result) {

        if (!err && result) {
            result.ReqState = 'searching';
            result.save(function (err2, result2) {
                if (!err2) {

                    //trigger user 
                    var io = req.app.get('socketio');
                    facades.saveNotif('user', user._id, 'RedirectToRequests', 'notifRequestPaid',{}, true, io)

                    return res.json({
                        success: true,
                        payload: result2,
                        message: 'Request Successfully Paid'
                    })

                }

            })
        }
        else {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to update Request State'
            })
        }
    }).populate(populate.RequestPopulation)
}

module.exports.Apply = async function (req, res) {

    //check param

    //get mentor applied active requests dates and requests Dates
    var programsArr;
    await MnMentorModel.findById(req.user._id).then((result) => {
        if (result) {
            programsArr = result.MentorPrograms;
        }
    })
    query = { ReqProg: { $in: programsArr } };

    MnRequestModel.find(query, function (err2, result2) {
        var mentorRequestsDates = [];
        var conflictDates = []
        var appliedRequest;
        result2.find((item) => {
            if (item.ReqMentor && item.ReqMentor._id.toString() === req.user._id) {

                //check meets if has date
                var reqMeets = item.ReqMeets;
                if (reqMeets.length > 0) {
                    reqMeets.forEach(element => {
                        if (element.MeetDate) {
                            mentorRequestsDates.push({ date: element.MeetDate })
                        }
                    });

                }
            }
            else if (item._id.toString() === req.params.reqId) {
                appliedRequest = item;
            }
        })
        appliedRequest.ReqDates.forEach(element => {
            mentorRequestsDates.find((item) => {
                if (new Date(item.date).getTime() == new Date(element.date).getTime()) {
                    conflictDates.push(item)
                };
            })

        });
        if (conflictDates.length == appliedRequest.ReqDates.length) {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to Apply Request No Available Date'
            })
        }
        else {

            //push request to mentor requests
            MnMentorModel.findById(req.user._id, function (err, result) {

                result.MentorMnRequests.push(appliedRequest._id)
                result.save();
                //generate Meets
                var meetsCount = appliedRequest.ReqProg.ProgMeetsNum;
                //get prepare 
                var preparations=appliedRequest.ReqProg.ProgPreparation;
                var meetsArr = [];
                for (let i = 0; i < meetsCount; i++) {
                    var random = (Math.random() + 1).toString(36).substring(4);
                    var obj = {
                        MeetName: 'luccter ' + i + 1,
                        MeetId: random,
                        MeetMentor: result._id,
                        MeetRequest: appliedRequest._id,
                        MeetPrepare:preparations[i]
                    };
                    meetsArr.push(obj)
                }

                MnMeetModel.insertMany(meetsArr).then((result3) => {

                    //update Request
                    var meetsIdArr = result3.map(doc => doc._id);
                    appliedRequest.ReqMentor = result._id;
                    appliedRequest.ReqMeets = meetsIdArr;
                    appliedRequest.ReqState = 'applied';
                    appliedRequest.save(function (err4, result4) {
                        if (!err4 && result4) {

                            //facades.saveNotif('mentor')
                            MnRequestModel.populate(result4, populate.RequestPopulation, function (err5, result5) {

                                var io = req.app.get('socketio');
                                //push notification 
                                facades.saveNotif('user', appliedRequest.ReqUser._id, 'RedirectToRequests', 'notifRequestApplied',{mentorName:result.MentorName}, true, io)
                                //trigger user 
                                io.to(appliedRequest.ReqUser._id.toString()).emit('REQUEST_APPLIED', result5)
                                return res.json({
                                    success: true,
                                    payload: result5,
                                    message: 'Request Successfully Applied'
                                })

                            })


                        }

                    });

                })

            })
        }

    }).populate(populate.RequestPopulation);
    //filter valid requests 
}

// //get request and mentor
// var mentor = req.user;
// MnMentorModel.findById(mentor._id, function (err, result) {

//     if (!err && result) {
//         MnRequestModel.findById(req.params.reqId, async function (err2, result2) {
//             if (!err2 && result2) {

//                 //push request to mentor requests
//                 result.MentorRequests.push(result2._id)
//                 result.save();

//                 //generate Meets
//                 var meetsCount = result2.ReqProg.ProgMeetsNum;
//                 var meetsArr = [];
//                 for (let i = 0; i < meetsCount; i++) {
//                     var random = (Math.random() + 1).toString(36).substring(4);
//                     var obj = {
//                         MeetName: 'luccter ' + i + 1,
//                         MeetId: random,
//                         MeetMentor: result._id,
//                         MeetRequest: result2._id
//                     };
//                     meetsArr.push(obj)
//                 }
//                 MnMeetModel.insertMany(meetsArr).then((result3) => {

//                     //update Request
//                     var meetsIdArr = result3.map(doc => doc._id);
//                     result2.ReqMentor = result._id;
//                     result2.ReqMeets = meetsIdArr;
//                     result2.ReqState = 'applied';
//                     result2.save(function (err4, result4) {
//                         if (!err4 && result4) {

//                             //trigger user
//                             var io = req.app.get('socketio');
//                             //push notification
//                             facades.saveNotif('user', result2.ReqUser._id, 'RedirectToRequests', 'mentor ' + mentor.MentorName + ' applied your mentorship request', true, io)
//                             //facades.saveNotif('mentor')

//                             //trigger user
//                             var io = req.app.get('socketio');

//                             io.to(result2.ReqUser._id.toString()).emit('REQUEST_APPLIED', {})

//                             return res.json({
//                                 success: true,
//                                 payload: result4,
//                                 message: 'Request Successfully Applied'
//                             })
//                         }

//                     });

//                 })
//             }
//         }).populate(populate.RequestPopulation);
//     }

// })


