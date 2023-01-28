const RepoPositionModel = require('../../../models/repo/PositionRepoSchema')

exports.Get=function(req,res){

    //get positions
    RepoPositionModel.find({},function(err,result){
        if(!err){
            return res.json({
                success: true,
                payload: result,
                msg: 'Positions repo Successfully Loaded'
            });
        }
    })


}