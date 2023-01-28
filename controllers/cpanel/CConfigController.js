const { validationResult } = require('express-validator');
const ConfigModel=require('../../models/ConfigSchema')

exports.ListGet=function(req,res){

    //get all configs 
    ConfigModel.find({},function(err,configs){
        return res.render('cpanel/configs/list',{configs})
    })


}

exports.NewGet=function(req,res) {

    return res.render('cpanel/configs/new')
}

exports.newPost=function(req,res) {
    // return res.send(req.body)
    //validate inputs
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.status(400).json({
            success: false,
            payload: { err: errors.errors, },
            msg: 'Validation x Error'
        });
    }

    //save Config
    var saveConfig=new ConfigModel();
    saveConfig.ConfigName=req.body.configNameI;
    saveConfig.ConfigValue=parseInt(req.body.configValueI);
    saveConfig.ConfigSubValue=req.body.configSubValI;
    saveConfig.ConfigDesc=req.body.configDescI;
    saveConfig.save(function(err,savedConfig){

        if(!err && savedConfig){
            //
            return res.redirect('/Cpanel/Configs/list')
        }
        else{
            return res.send(err)
        }
    })
}


exports.UpdateGet=function(req,res){
    //validate params
    var configId=req.params.configId;

    //get config
    ConfigModel.findById(configId,function(err,config){
        if(!err && config){
            return res.render('cpanel/configs/configOne',{config:config})
        }

    })
}

exports.UpdatePost=function(req,res){

    //validate param
    var configId=req.params.configId;

    //update Config 
    var data={
        ConfigName:req.body.configNameI,
        ConfigValue:req.body.configValueI,
        ConfigSubValue:req.body.configSubValI,
        ConfigDesc:req.body.configDescI
    }
    ConfigModel.findByIdAndUpdate(configId,data,function(err,updatedConfig){

        if(!err && updatedConfig){
            res.redirect('/Cpanel/Configs/list')
        }

    })


}