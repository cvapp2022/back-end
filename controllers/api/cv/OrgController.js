const { validationResult } = require('express-validator');
const CvModel=require('../../../models/CvSchema');
const OrgModel=require('../../../models/cv/OrganizationSchema');

const facade = require('../../../others/facades');
var ObjectId = require('mongoose').Types.ObjectId;


exports.Save = async function(req,res,next){

    //validate Inputs 
    const errors = validationResult(req);
    if(errors.errors.length > 0 ){
        return res.status(400).json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    //get && Cv id 
    var CvId = req.body.OrgCvI;

    try {
        await CvModel.findById(CvId).then((result)=>{
            if(!result)
            throw 'unable to find cv';
        })

        //gett sort 
        let sortVal;
        await OrgModel.findOne({ CVId: CvId }, {}, { sort: { 'ExpSort': -1 } }).then((result)=>{
           if(!result)
               sortVal = 1;
            else
               sortVal = result.ExpSort + 1;
        })


        var saveOrg=new OrgModel();
        saveOrg.CVId=CvId;
        saveOrg.OrgTitle=req.body.OrgTitleI;
        saveOrg.OrgDesc=req.body.OrgDescI;
        saveOrg.OrgJob=req.body.OrgJobI;
        saveOrg.OrgFrom=req.body.OrgFromI;
        saveOrg.OrgTo=req.body.OrgToI;
        saveOrg.OrgSort=sortVal
        await saveOrg.save()

        facade.PushToCvArr(CvId,'CVOrg',saveOrg._id)
        
        //get list of organization
       var list=await OrgModel.find({CVId:CvId}).exec();

       return res.status(201).json({
        success:true,
        payload:{
            item:saveOrg,
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
        return  res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    var OrgId=req.params.orgId;
    if(!ObjectId.isValid(OrgId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }

    var Update={
        OrgTitle:req.body.OrgTitleI,
        OrgDesc:req.body.OrgDescI, 
        OrgJob:req.body.OrgJobI,
        OrgFrom:req.body.OrgFromI,
        OrgTo:req.body.OrgToI,
        
    }

    OrgModel.findOneAndUpdate({_id:OrgId},Update,function(err,result){

        if(!err && result){            
            result.save();
            return  res.json({
                success:true,
                payload:result,
                msg:'Organization Successfully Updated' 
            });
        }
        else{
            return  res.json({
                success:false,
                payload:errors.errors,
                msg:'Unable to find Organization' 
            });
        }

    })

}


exports.Delete = function(req,res,next){

    var OrgId=req.params.orgId;
    if(!ObjectId.isValid(OrgId)){
        return  res.json({
            success:false,
            payload:null,
            msg:'Param not valid' 
        });
    }


    //Check Organization & Delete
    OrgModel.findOneAndDelete({_id:OrgId},function(err,result){

        if(!err && result){
            //Get CV & Remove Organization Id From CVProj
            facade.PullCvArr(result.CVId,'CVOrg',OrgId)
            OrgModel.find({CVId:result.CVId},function(err2,result2){

                if(!err2){
                    return  res.json({
                        success:true,
                        payload:{
                            list:result2
                        },
                        msg:'Organization Successfully Deleted' 
                    });
                }
                else{
                    return  res.json({
                        success:false,
                        payload:null,
                        msg:'Unable to fetch Organization' 
                    });
                }

            })
        }
        else{
            return  res.json({
                success:false,
                payload:null,
                msg:'Unable to delete Organization' 
            });
        }

    })
}


exports.ChangeSort=function(req,res){



    //validate input
    var items = req.body.items;

    if(items.length > 0){

        items.forEach(item => {
            OrgModel.findOneAndUpdate({_id:item.id},{OrgSort:item.sort+1},function(err,res){

                console.log(err)

            });
        });
        OrgModel.find({CVId:req.body.CvId},function(err,result){

            if(!err && result){
                res.json(result)
            }
            else{
                res.send('unable to fetch ')
            }

        })

    }

}