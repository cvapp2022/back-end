const UserModel=require('../../../../models/UserSchema');
const CvModel = require('../../../../models/CvSchema');
const CvMetaModel = require('../../../../models/cv/CvMetaSchema')
const ExpModel = require('../../../../models/cv/ExperienceSchema');
const EduModel = require('../../../../models/cv/EducationSchema');
const ContactModel = require('../../../../models/cv/ContactSchema')
const OrgModel = require('../../../../models/cv/OrganizationSchema');
const ProjModel = require('../../../../models/cv/ProjectSchema');
const ReffModel = require('../../../../models/cv/ReffernceSchema');
const SkillModel = require('../../../../models/cv/SkillSchema')
const AwModel = require('../../../../models/cv/AwSchema');
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

    //Create New CV
    var SaveCv = new CvModel();
    SaveCv.CVName = req.body.CvNameI;
    SaveCv.CVUId = requestId;
    SaveCv.externalModelType='SrServRequest';
    SaveCv.CVTemplate = '62b6f0b0b422b9bda6ee1b21';
    SaveCv.save(function (err, result) {
        if(err){
            return res.json({
                success: false,
                payload: err,
                msg: 'Unable to save cv'
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
                    serviceRequest['ReqCv'].push(result._id)
                    serviceRequest.save(function(err3){
                        console.log(err3)
                        if(err3){
                            return res.json({
                                success: false,
                                payload: null,
                                message: 'Unable to push cv to service request'
                            });
                        }
                        else{
                            var arr = [
                                {
                                    key: 'facebook',
                                    value: '',
                                },
                                {
                                    key: 'twitter',
                                    value: '',
                                },
                                {
                                    key: 'github',
                                    value: '',
                                },
                                {
                                    key: 'linkedin',
                                    value: ''
                                }
                    
                            ]
                            facades.saveContact(arr, result._id);
        
                            //get cv list 
                            CvModel.find({ CVUId: requestId }, function (err3, result3) {
                    
                                if (!err3 && result3) {
                                    return res.json({
                                        success: true,
                                        payload:
                                        {
                                            list: result3,
                                            item: result
                                        }
                                        ,
                                        msg: 'Cv Successfully Saved'
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

    var CvId = new ObjectId(req.params.cvId);
    var ReqId=new ObjectId(req.params.requestId);
    if (!ObjectId.isValid(CvId) || !ObjectId.isValid(ReqId) ) {
        return res.json({
            success: false,
            payload: null,
            msg: 'Param not valid'
        });
    }

    //find cv 
    CvModel.findById(CvId, function (err, result) {
        if(err || !result){
            return res.json({
                success: false,
                payload: null,
                msg: 'unable to find cv'
            });
        }
        else{
            //Delete related Exp
            ExpModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })
            
            // //Delete related edu
            EduModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })

            // //Delete related proj
            ProjModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })

            // //Delete related contacts
            ContactModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })
        
            // //Delete related skills
            SkillModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })
        
            // //delete related org
            OrgModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })
        
            // //delete related reff
            ReffModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })
        
            // //delete related awards
            AwModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })
        
            // //delete related cv meta
            CvMetaModel.deleteMany({ CVId: result._id }, function (err) {
                console.log(err)
            })



            //remove Cv From Service Request Arr
            SrRequestModel.findById(ReqId, function (err2, result2) {

                if (err2 || !result2) {
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'unable to find service request'
                    });
                }
                else{
                    result2['ReqCv'].pull(result._id)
                    result2.save();

                    result.remove(function(err3){
                        if(err3){
                            return res.json({
                                success: false,
                                payload: null,
                                msg: 'unable to delete cv'
                            });
                        }
                        else{
                            //get list of cv
                            CvModel.find({ CVUId:ReqId }, function (err4, result4) {
                
                                return res.json({
                                    success: true,
                                    payload: { list: result4 },
                                    msg: 'Cv Successfully Deleted'
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
    var cvId=req.params.cvId;
    
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

            Promise.all([ CvModel.findById(cvId),UserModel.findById(userId)]).then((result)=>{

                var cv=result[0];
                var user=result[0];
                if(!cv){
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'Unable to find cv'
                    });
                }
                if(!user){
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'Unable to find user'
                    });
                }
                if(cv.CVUId.toString()===userId.toString()){
                    return res.json({
                        success: false,
                        payload: null,
                        msg: 'Cv already exported'
                    });
                }

                //update cv user id
                cv.CVUId=userId;
                cv.save(function(err5){
                    if(err5){
                        return res.json({
                            success: false,
                            payload: null,
                            msg: 'Unable to update cv user'
                        });
                    }
                    else{
                        //push cv to user cv BlUserCv BlUserCv
                        UserModel.findOneAndUpdate({_id:userId},{ "$push":{BlUserCv:cv._id}},{new:true},function(err4,updatedUser){
                            if(err4 || !updatedUser){
                                return res.json({
                                    success: false,
                                    payload: user._id,
                                    msg: 'Unable to push cv to user'
                                });
                            }
                            else{
                                return res.json({
                                    success: true,
                                    payload: updatedUser,
                                    msg: 'Cv Successfully Exported to user cv '
                                });
                            }
                        })
                    }
                })
            }).catch((err)=>{
                return res.json({
                    success: false,
                    payload: err,
                    msg: 'Unable to export cv to user'
                });
            })
        }
    })
}


