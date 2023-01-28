const UserModel=require('../../../../models/UserSchema');
const ClModel = require('../../../../models/ClSchema');
const SrRequestModel =require('../../../../models/service/ServRequestSchema')
const { validationResult } = require('express-validator');
const facades = require('../../../../others/facades');
var ObjectId = require('mongoose').Types.ObjectId;


exports.Save = function (req, res, next) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //validate params 
    var requestId=req.params.requestId;

    //Create New CL
    var SaveCl = new ClModel();
    SaveCl.CLName = req.body.ClNameI;
    SaveCl.CLUId = requestId;
    SaveCl.CLTemplate = '62b6f0b0b422b9bda6ee1b21';
    SaveCl.save(function (err, result) {
        if(err){
            return res.json({
                success: false,
                payload: err,
                msg: 'Unable to save cl'
            });
        }
        else{

            //find service requset
            SrRequestModel.findOne({ _id: requestId }, function (err2, serviceRequest) {
                if(err2 || !serviceRequest){
                    return res.json({
                        success: false,
                        payload: null,
                        message: 'Unable to find service request'
                    });
                }
                else{
                    //push cv id to service request  
                    serviceRequest['ReqCl'].push(result._id)
                    serviceRequest.save(function(err3){
                        console.log(err3)
                        if(err3){
                            return res.json({
                                success: false,
                                payload: null,
                                message: 'Unable to push cl to service request'
                            });
                        }
                        else{
                            //get cv list 
                            ClModel.find({ CLUId: requestId }, function (err3, result3) {
                    
                                if (!err3 && result3) {
                                    return res.json({
                                        success: true,
                                        payload:
                                        {
                                            list: result3,
                                            item: result
                                        }
                                        ,
                                        msg: 'Cl Successfully Saved'
                                    });
                                }
                            })
                        }
                    });
                }
            })
        }
    })
}


module.exports.Delete=function(req,res){

    var ClId = new ObjectId(req.params.clId);
    var ReqId=new ObjectId(req.params.requestId);
    if (!ObjectId.isValid(ClId) || !ObjectId.isValid(ReqId) ) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    //find cv 
    ClModel.findById(ClId, function (err, result) {
        if(err || !result){
            return res.json({
                success: false,
                payload: null,
                msg: 'unable to find cl'
            });
        }
        else{
           
            //remove Cl From Service Request Arr
            SrRequestModel.findById(ReqId, function (err2, result2) {

                if (err2 || !result2) {
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'unable to find service request'
                    });
                }
                else{
                    result2['ReqCl'].pull(result._id)
                    result2.save();

                    result.remove(function(err3){
                        if(err3){
                            return res.json({
                                success: false,
                                payload: null,
                                msg: 'unable to delete cl'
                            });
                        }
                        else{
                            //get list of cv
                            ClModel.find({ CLUId:ReqId }, function (err4, result4) {
                
                                return res.json({
                                    success: true,
                                    payload: { list: result4 },
                                    msg: 'Cl Successfully Deleted'
                                });
                
                            })
                        }
                    })
                }
            })
        }
    })
}



exports.Export=function(req,res){

    //validate params 
    var requestId=req.params.requestId;
    var clId=req.params.clId;
    
    //get service request user
    SrRequestModel.findById(requestId,function(err,srRequest){

        if(err ||!srRequest){
            return res.json({
                success: false,
                payload: null,
                msg: 'Unable to find service request'
            });
        }
        else{
            //63810ee305dfd6e1ef7ef052
            //634d8e75b68e9a1f2cf1bf29
            var userId=srRequest.ReqUser

            Promise.all([ ClModel.findById(clId),UserModel.findById(userId)]).then((result)=>{

                var cl=result[0];
                var user=result[0];
                if(!cl){
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'Unable to find cl'
                    });
                }
                if(!user){
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'Unable to find user'
                    });
                }
                if(cl.CLUId.toString()===userId.toString()){
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'cl already exported'
                    });
                }

                //update cv user id
                cl.CLUId=userId;
                cl.save(function(err5){
                    if(err5){
                        return res.json({
                            success: false,
                            payload: null,
                            msg: 'Unable to update cl user'
                        });
                    }
                    else{
                        //push cv to user cv BlUserCv BlUserCv
                        UserModel.findOneAndUpdate({_id:userId},{ "$push":{BlUserCl:cl._id}},{new:true},function(err4,updatedUser){
                            if(err4 || !updatedUser){
                                return res.json({
                                    success: false,
                                    payload: user._id,
                                    msg: 'Unable to push cl to user'
                                });
                            }
                            else{
                                return res.json({
                                    success: true,
                                    payload: updatedUser,
                                    msg: 'cl Successfully Exported to user cl '
                                });
                            }
                        })
                    }
                })
            }).catch((err)=>{
                return res.json({
                    success: false,
                    payload: err,
                    msg: 'Unable to export cl to user'
                });
            })
        }
    })
}


