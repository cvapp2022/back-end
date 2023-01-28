const { validationResult } = require('express-validator');

const RefModel=require('../../../models/cv/ReffernceSchema');
const CvModel=require('../../../models/CvSchema');
var ObjectId = require('mongoose').Types.ObjectId;
const facade = require('../../../others/facades');



exports.Save= async function(req,res,next){


    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
        return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    var CvId = req.body.RefCvI;

    try {
        
        await CvModel.findById(CvId).then((result)=>{
            if(!result)
            throw 'unable to find cv';
        })

        //gett sort 
        let sortVal;
        await RefModel.findOne({ CVId: CvId }, {}, { sort: { 'RefSort': -1 } }).then((result)=>{
           if(!result)
               sortVal = 1;
            else
               sortVal = result.RefSort + 1;
        })

        var SaveRef = new RefModel();
        SaveRef.CVId=CvId;
        SaveRef.RefName=req.body.RefNameI;
        SaveRef.RefJob=req.body.RefJobI;
        SaveRef.RefMail=req.body.RefMailI;
        SaveRef.RefPhone=req.body.RefPhoneI;
        SaveRef.RefAt=req.body.RefAtI;
        await SaveRef.save()

        facade.PushToCvArr(CvId,'CVReff',SaveRef._id)

        var list=await RefModel.find({CVId:CvId}).exec()
        return res.status(201).json({
            success:true,
            payload:{
                item:SaveRef,
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







exports.Update=function(req,res,next){

    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
       return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    var RefId=req.params.refId;
    if(!ObjectId.isValid(RefId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }

    var Update = {
        RefName:req.body.RefNameI,
        RefJob:req.body.RefJobI, 
        RefMail:req.body.RefMailI,
        RefPhone:req.body.RefPhoneI
    };

    RefModel.findOneAndUpdate({_id:RefId},Update,function(err,result){

        if(!err && result){
            return  res.json({
                success:true,
                payload:result,
                msg:'Reffrence Successfully Updated' 
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







exports.Delete=function(req,res,next){

    var RefId=req.params.refId;
    if(!ObjectId.isValid(RefId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }
    
    //Check Education & Delete  
    RefModel.findOneAndDelete({_id:RefId},function(err,result){

        if(!err && result){
            //Get CV & Remove Edu Id From CVEdu
            facade.PullCvArr(result.CVId,'CVReff',RefId)
            RefModel.find({},function(err2,result2){

                if(!err2){

                    return  res.json({
                        success:true,
                        payload:{
                            list:result2
                        },
                        msg:'Reffrence Succesfuly Deleted' 
                    });
                }
                else{
                    return  res.json({
                        success:false,
                        payload:null,
                        msg:'unable to fetch Reffrence' 
                    });
                }

            })
        }
        else{
            return  res.json({
                success:false,
                payload:null,
                msg:'unable to delete Reffrence' 
            });
        }
    })

}


exports.ChangeSort=function(req,res){



    //validate input
    var items = req.body.items;

    if(items.length > 0){

        items.forEach(item => {
            RefModel.findOneAndUpdate({_id:item.id},{RefSort:item.sort+1},function(err,res){

                console.log(err)

            });
        });
        RefModel.find({CVId:req.body.CvId},function(err,result){

            if(!err && result){
                res.json(result)
            }
            else{
                res.send('unable to fetch ')
            }

        })

    }

}