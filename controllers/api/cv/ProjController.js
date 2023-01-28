const { validationResult } = require('express-validator');

const ProjModel=require('../../../models/cv/ProjectSchema');
const CvModel=require('../../../models/CvSchema');

var ObjectId = require('mongoose').Types.ObjectId;
const facade = require('../../../others/facades');


exports.Save =async function(req,res,next){

    //validate inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
        return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }


    //get && Cv id 
    var CvId = req.body.ProjCvI;

    try {

        await CvModel.findById(CvId).then((result)=>{
            if(!result)
            throw 'unable to find cv';
        })

        //gett sort 
        let sortVal;
        await ProjModel.findOne({ CVId: CvId }, {}, { sort: { 'ProjSort': -1 } }).then((result)=>{
            if(!result)
                sortVal = 1;
            else
                sortVal = result.ProjSort + 1;
        })

        //Save Proj
        var SaveProj = new ProjModel();
        SaveProj.CVId=CvId;
        SaveProj.ProjName=req.body.ProjNameI;
        SaveProj.ProjDesc=req.body.ProjDescI;
        SaveProj.ProjJob=req.body.ProjJobI;
        SaveProj.ProjUrl=req.body.ProjUrlI;
        SaveProj.ProjImage=req.body.ProjImageI;
        SaveProj.ProjDate=req.body.ProjDateI;
        SaveProj.ProjSkill=req.body.ProjSkillI;
        SaveProj.ProjSort=sortVal
        await SaveProj.save();
        
        //Push project
        facade.PushToCvArr(CvId,'CVProj',SaveProj._id)
        
        var list =await ProjModel.find({CVID:CvId},).exec();

        return res.status(201).json({
            success:true,
            payload:{
                item:SaveProj,
                list
            }
        });
    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        }); 
    }
}


exports.Update = function(req,res,next){

    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
        return  res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    var ProjId=req.params.projId;
    if(!ObjectId.isValid(ProjId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }

    var Update = {

        ProjName:req.body.ProjNameI,
        projDesc:req.body.ProjDescI,
        ProjJob:req.body.ProjJobI,
        ProjUrl:req.body.ProjUrlI,
        ProjImage:req.body.ProjImageI,
        ProjDate:req.body.ProjDateI,
    }

    ProjModel.findOneAndUpdate({_id:ProjId},Update,function(err,result){

        //update Skill Array
        if(!err && result){

            if(result.ProjSkill.length > 0){

                result.ProjSkill.forEach(item => {
                    result.ProjSkill.pull(item);
                });
                var newSkillArr= req.body.ProjSkillI;
                newSkillArr.forEach(item=>{
                    result.ProjSkill.push(item);
                })
                

            }
            result.save();
            return  res.json({
                success:true,
                payload:result,
                msg:'Project Successfully Updated' 
            });

        }
        else{
            return  res.json({
                success:false,
                payload:errors.errors,
                msg:'Unable to find Project' 
            });
        }

    })



}


exports.Delete = function(req,res,next){

    var ProjId=req.params.projId;
    if(!ObjectId.isValid(ProjId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }


    //Check Project & Delete
    ProjModel.findOneAndDelete({_id:ProjId},function(err,result){

        if(!err && result){
            //Get CV & Remove Proj Id From CVProj
            facade.PullCvArr(result.CVId,'CVProj',ProjId)
            ProjModel.find({},function(err2,result2){

                if(!err2){
                    return  res.json({
                        success:true,
                        payload:{
                            list:result2
                        },
                        msg:'Project Successfully Deleted' 
                    });
                }
                else{
                    return  res.json({
                        success:false,
                        payload:null,
                        msg:'unable to fetch Projects' 
                    });
                }

            })
        }
        else{
            return  res.json({
                success:false,
                payload:null,
                msg:'unable to delete Project' 
            });
        }

    })



}

exports.ChangeSort=function(req,res){



    //validate input
    var items = req.body.items;

    if(items.length > 0){

        items.forEach(item => {
            ProjModel.findOneAndUpdate({_id:item.id},{ProjSort:item.sort+1},function(err,res){

                console.log(err)

            });
        });
        ProjModel.find({CVId:req.body.CvId},function(err,result){

            if(!err && result){
                res.json(result)
            }
            else{
                res.send('unable to fetch ')
            }

        })

    }

}