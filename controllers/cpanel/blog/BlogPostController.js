const { validationResult } = require('express-validator');
const CategoryModel = require('../../../models/blog/CategorySchema')
const PostModel = require('../../../models/blog/PostSchema')
const PostChildModel = require('../../../models/blog/PostChild')
const facades= require('../../../others/facades')
const population = require('../../../others/populations')

exports.SaveGet = function (req, res) {
    //fetch categories
    CategoryModel.find({}, function (err, result) {
        if (!err) {
            return res.render('cpanel/blog/posts/new', { cats: result })
        }
    })
}

exports.SavePost = function (req, res) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        res.redirect('/Cpanel/Blog/Post/new')
    }

    //save Post 
    var savePost = new PostModel();
    savePost.PostTitle = req.body.postTitleI;
    savePost.PostCategory = req.body.postCategoryI;
    savePost.save(function (err, result) {
        if (!err && result) {
            console.log(result)
            return res.redirect('/Cpanel/Blog/Post/list')
        }
    })

}


exports.ListGet = function (req, res) {

    //fetch posts 
    PostModel.find({ PostStatus: 1, PostState: 'published' }, function (err, result) {
        if (!err) {
            return res.render('cpanel/blog/posts/list', { posts: result })
        }
    }).populate(population.PostPopulate)


}

exports.SaveChildGet = function (req, res) {

    //validate params 
    var PostId = req.params.postId;
    var Lang = req.params.lang;

    //check post has no lang child 
    PostChildModel.find({ PostParent: PostId, PostLang: Lang }, function (err, result) {
        if (!err && result.length > 0) {
            res.redirect('/Cpanel/Blog/Post/new')
        }
        else {

            //fetcg blog 
            PostModel.findById(PostId, function (err2, result2) {
                if (!err2 && result2) {
                    return res.render('cpanel/blog/postChild/new', { parent: result2 })
                }
            })


        }
    })
}

exports.SaveChildPost = async function (req, res) {

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        res.redirect('/Cpanel/Blog/Post/new')
    }

    //validate params

    //create new folder
    var folderId=await facades.createFolder(req.body.postTitleI,'posts')

    if(!folderId){
        return res.json({
            success: false,
            payload: null,
            message: 'unable to create Post folder'
        })
    }

    //upload post thumbnail to Drive
    facades.uploadFileTo(req.files.postThumbI[0],'post',folderId,function(x){

        //get parent and 
        PostModel.findById(req.params.postId, function (err, result) {
            if (!err && result) {
    
                //save Child Post
                var savePostChild = new PostChildModel();
                savePostChild.PostTitle = req.body.postTitleI;
                savePostChild.PostDesc = req.body.postDescI;
                savePostChild.PostThumb = x;
                savePostChild.PostFolder=folderId;
                savePostChild.PostState = 'published';
                savePostChild.PostBody = req.body.postBodyI;
                savePostChild.PostLang = req.params.lang;
                savePostChild.PostParent = req.params.postId;
                savePostChild.save(function (err2, result2) {
                    if (!err2 && result2) {
    
                        //push child id to parent 
                        result.PostChild.push(result2._id)
                        result.save(function (err3) {
                            if (!err3) {
                                return res.redirect('/Cpanel/Blog/Post/' + req.params.postId + '/' + req.params.lang + '/new')
                            }
                            else {
                                console.log(err)
                                return res.redirect('/Cpanel/Blog/Post/' + req.params.postId + '/' + req.params.lang + '/new')
                            }
                        })
    
                    }
                })
            }
    
        }).populate(population.PostPopulate)

    })


}