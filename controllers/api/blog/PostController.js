const PostChildModel = require('../../../models/blog/PostChild')



exports.All = function (req, res) {
    
    //validate param
    var Lang = req.params.lang;

    //Fetch Blogs By Lang
    var query={PostLang:Lang,PostStatus:1,PostState:'published'}
    PostChildModel.find(query, function (err, result) {
        if (!err) {
            return res.json({
                success: true,
                payload: result,
                msg: 'Posts Successfully Loaded'
            });
        }
    })
}

exports.Get=function(req,res){

    //validate params
    var postLang=req.params.lang;
    var postTitle=req.params.title;

    //get post
    var query={PostLang:postLang,PostTitle:postTitle,PostStatus:1,PostState:'published'};
    PostChildModel.findOne(query,function(err,result){
        if(!err && result){
            return res.json({
                success: true,
                payload: result,
                msg: 'Post Successfully Loaded'
            });
        }
        else{
            return res.json({
                success: false,
                payload: null,
                msg: 'unable to find post'
            });
        }
    })

}
