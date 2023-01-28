const PositionRepo = require('../../../models/repo/PositionRepoSchema')
const CvModel = require('../../../models/CvSchema')
const { validationResult } = require('express-validator');


exports.ListGet=function(req,res){
    
    //get repo items 
    PositionRepo.find({},function(err,result){
        if(!err){
            return res.render('cpanel/repo/position/list',{positions:result})
        }
    })

}

exports.SaveGet=function(req,res){
    return res.render('cpanel/repo/position/new')
}

exports.SavePost=function(req,res){

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.status(400).json({
            success: false,
            payload: { err: errors.errors, body: req.body },
            msg: 'Validation x Error'
        });
    }

    //check position name is unique
    PositionRepo.findOne({PositionName:req.body.positionNameI},function(err,result){

        if(err){
            return res.send('unable to check position name')
        }
        if(result){
            return res.send('unable to save position because its already exist')
        }
        else{
            //save position in repo 
            var savePositionRepo=new PositionRepo();
            savePositionRepo.PositionName=req.body.positionNameI;
            savePositionRepo.PositionDesc=req.body.positionDescI;
            savePositionRepo.save(function(err,result){
                if(!err){
                    return res.send('position repo saved')
                }
            })
        }

    })

}

exports.DeleteGet=function(req,res){

    //validate params
    var positionRepoId=req.params.positionRepoId;
    
    //check if position is used by users in cv
    CvModel.findOne({CVPosition:positionRepoId},function(err,result){
        if(err){
            return res.send('unable to check position cvs')
        }

        if(result){
            return res.send('unable to delete position because its already in use')
        }
        else{
            //check dekete skill repo item
            PositionRepo.findByIdAndDelete(positionRepoId,function(err){
                if(!err){
                    return res.send('position repo item successfully deleted')
                }
                else{
                    return res.send('unable to delete position repo item') 
                }
            })

        }
    })

}