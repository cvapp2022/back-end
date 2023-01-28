const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const MentorModel = require('../../models/MentorSchema')
const ChatModel=require('../../models/ChatSchema') 
const RequestModel = require('../../models/mn/MnRequestSchema')
const transactionModel=require('../../models/mentor/transactionSchema')
const auth = require('../../others/auth');
const facades = require('../../others/facades');
const { MentorPopulation,ChatPopulate } = require('../../others/populations');



module.exports.Get =async function (req, res) {


    var u = req.user;

    try{
        //get chats 
        var chats= await ChatModel.find({ChatMentor:u._id}).populate(ChatPopulate).then((result)=>{
            return result;
        })

        //get transaction
        var transactions=await transactionModel.find({}).then((result)=>{
            return result;
        })

        var mentor= await MentorModel.findById(u._id).populate(MentorPopulation).then((result)=>{
            if(!result)
                throw 'unable to find mentor';
            return result
        })

        return res.json({
            success: true,
            payload: {mentor,chats,transactions},
            message: 'Mentor Successfully loaded'
        })

     }
    catch (error) { 
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        });
    }
}


module.exports.Login = function (req, res) {



    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    MentorModel.findOne({ MentorMail: req.body.UserI },async function (err, result) {

        if (!err) {

            if (result === 'null') {
                return res.json({
                    success: false,
                    payload: null,
                    msg: 'Wrong username or password'
                });
            }
        }
        if (result) {

            if (bcrypt.compare(req.body.PassI, result.MentorPass)) {

                var token = auth.generateToken(result)

                try {

                    var mentor=await MentorModel.findById(result._id).populate(MentorPopulation).then((result)=>{
                        if(!result)
                            throw 'unable to get mentor';
                        return result;
                    })

                    //get transaction
                    var transactions=await transactionModel.find({}).then((result)=>{
                        return result;
                    })

                    //get chats 
                    var chats = await ChatModel.find({ChatMentor:result._id}).populate(ChatPopulate).then((result)=>{
                        return result;
                    })
                    
                    return res.status(200).json({
                        success: true,
                        payload: {
                            mentor,
                            chats,
                            transactions,
                            token
                        }
                    });
                    
                } catch (error) {
                    console.log(error.stack)
                    return res.json({
                        success: false,
                        payload: error,
                        msg: 'Unable to get mentor'
                    });
                }


                        //get num of available requests
                        // query = { ReqStatus: 1, ReqState: 'searching', ReqProg: { $in: result.MentorPrograms } };
                        // RequestModel.find(query, function (err2, result2) {
                        //     if (result2.length > 0) {

                        //         //trigger user 
                        //         var io = req.app.get('socketio');

                        //         //push notification to mentor
                        //         //facades.saveNotif('mentor', result._id, 'RedirectToRequests', 'You Have ' + result2.length + ' Available Requests', true,io)

                        //     }
                        // })
            }
            else {
                return res.status(200).json({
                    success: false,
                    payload: null,
                    msg: 'Wrong username or password'
                });
            }

        }
        else {
            return res.status(200).json({
                success: false,
                payload: null,
                msg: 'Wrong username or password'
            });
        }
    }).lean();

}