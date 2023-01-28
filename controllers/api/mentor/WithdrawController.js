const withdrawRequestModel=require('../../../models/mentor/withdrawRequestSchema')
const { validationResult } = require('express-validator')
const MentorModel=require('../../../models/MentorSchema')
module.exports.Get=function(req,res){



}


module.exports.Save=async function(req,res){

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    console.log(req.body)

    // var mentor=req.user;
    try {
        var mentor=await MentorModel.findById(req.user._id).then((result)=>{
            if(!result)
                throw 'unable to find mentor';
            return result;
        })

        //check mentor has no old withdraw request
        await withdrawRequestModel.find({withdrawReqStatus:0}).then((result)=>{
            if(result.length > 0)
                throw 'mentor already has processing withdraw request';
        })


        //save withdraw requet
        var saveWithdrawRequest=new withdrawRequestModel();
        saveWithdrawRequest.withdrawReqMethod=req.body.withdrawMethodI
        saveWithdrawRequest.withdrawReqTarget=req.body.withdrawTargetI
        saveWithdrawRequest.withdrawReqValue=req.body.withdrawValueI
        saveWithdrawRequest.withdrawReqMentor=mentor._id;
        await saveWithdrawRequest.save()

        //push withdraw request to mentor 
        mentor.MentorWithdrawRequests.push(saveWithdrawRequest._id)
        await mentor.save();

        return res.json({
            success: true,
            payload: saveWithdrawRequest,
            message: 'Withdraw request successfuly Saved'
        })

    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        });
    }

}