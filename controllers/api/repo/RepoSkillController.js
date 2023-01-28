const SkillRepoModel = require('../../../models/repo/SkillRepoSchema')
const CvModel =require('../../../models/CvSchema')
exports.Get=function(req,res){

    //validate params

    //get cv position
    CvModel.findById(req.params.cvId).populate('CVSkill',{SkillTitle:1,_id:0}).then((result)=>{

        var query ={SkillName:{$nin:result.CVSkill.map( sk => sk.SkillTitle )},SkillPositions: result.CVPosition.toString()}
        //get Skills based on cv position and saved skills
        SkillRepoModel.find(query).then((result2)=>{
            return res.json({
                success: true,
                payload: result2,
                msg: 'Skills repo Successfully Loaded'
            });
        }).catch((err2)=>{
            return res.json({
                success: false,
                payload: err2,
                msg: 'Unable to load repoSkills'
            });
        })
    }).catch((err)=>{
        return res.json({
            success: false,
            payload: err,
            msg: 'Unable to load cv'
        });
    })

}