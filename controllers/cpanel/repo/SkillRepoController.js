const SkillRepoModel = require('../../../models/repo/SkillRepoSchema')
const PositionRepoModel=require('../../../models/repo/PositionRepoSchema')
const { validationResult } = require('express-validator');


exports.ListGet=function(req,res){
    
    //get repo items 
    SkillRepoModel.find({},function(err,result){
        if(!err){
            return res.render('cpanel/repo/skill/list',{skills:result})
        }
    })

}

exports.SaveGet=function(req,res){

    //get positions
    PositionRepoModel.find({},function(err,result){
        if(!err){
            return res.render('cpanel/repo/skill/new',{positions:result})
        }
    })

}

exports.SavePost=function(req,res){

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0 && req.body['skillPosI[]'].length > 0) {
        return res.status(400).json({
            success: false,
            payload: { err: errors.errors, body: req.body },
            msg: 'Validation x Error'
        });
    }

    //check position name is unique
    SkillRepoModel.findOne({SkillName:req.body.skillNameI},function(err,result){

        if(err){
            return res.send('unable to check skill name')
        }
        if(result){
            return res.send('unable to save skill because its already exist')
        }
        else{
            //save skill in repo 
            var saveSkillRepo=new SkillRepoModel();
            saveSkillRepo.SkillName=req.body.skillNameI;
            saveSkillRepo.SkillDesc=req.body.skillDescI;
            saveSkillRepo.SkillPositions=req.body['skillPosI[]']
            saveSkillRepo.save(function(err,result){
                if(!err){
                    return res.send('skill repo saved')
                }
            })
        }
    })

}

exports.DeleteGet=function(req,res){

    //validate params
    var skillRepoId=req.params.skillRepoId;

    //check dekete skill repo item
    SkillRepoModel.findByIdAndDelete(skillRepoId,function(err){
        if(!err){
            return res.send('skill repo item successfully deleted')
        }
        else{
            return res.send('unable to delete skill repo item') 
        }
    })
}