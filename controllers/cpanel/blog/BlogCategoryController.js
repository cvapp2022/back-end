const { validationResult } = require('express-validator');
const CategoryModel = require('../../../models/blog/CategorySchema')

exports.SaveGet=function(req,res){
    res.render('cpanel/blog/categories/new')
}

exports.SavePost=function(req,res){

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        res.redirect('/Cpanel/Blog/Cat/new')
    }

    //save Category
    var saveCat=new CategoryModel();
    saveCat.CategoryTitle=req.body.CategoryTitleI;
    saveCat.CategoryDesc=req.body.CategoryDescI;
    saveCat.CategoryThumb='test';
    saveCat.save(function(err,result){
        if(!err){
            res.redirect('/Cpanel/Blog/Cat/new')
        }
        else{
            res.send(err)
        }
    })



}