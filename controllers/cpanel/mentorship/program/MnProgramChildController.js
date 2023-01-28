const MnProgramModel = require('../../../../models/mn/MnProgramSchema')
const ProgramChildModel=require('../../../../models/mn/Program/ChildSchema')


exports.Get=function(req,res){

    //validate param
    var progId=req.params.progId;
    var lang = req.params.lang;

    //get program
    ProgramChildModel.findOne({ChildProgram:progId,ChildLang:lang},function(err,result){
        console.log(result)
        if(!err){

            if(!result){
                res.render('cpanel/mentorship/programs/child/new')
            }
            else{
                res.render('cpanel/mentorship/programs/child/childOne',{child:result,progId,lang})
            }

        }

    })
}


exports.Save=function(req,res){

    //validate param
    var progId=req.params.progId;
    var lang = req.params.lang;
    //validate inputs

    //get program
    MnProgramModel.findById(progId,function(err,result){

        if(!err && result){

            //save program child
            var saveChild= new ProgramChildModel();
            saveChild.ChildLang=lang;
            saveChild.ChildProgram=progId;
            saveChild.ChildName=req.body.progNameI;
            saveChild.ChildDesc=req.body.progDescI;
            saveChild.save(function(err2,result2){

                if(!err2){

                    //push child to program
                    result.ProgChilds.push(result2._id);
                    result.save();

                    res.redirect('/')
                }

            })

        }
    })
}

exports.Update=function(req,res){


    //validate param
    var progId=req.params.progId;
    var lang = req.params.lang;

    //validate inputs

    //find child;
    var update={
        ChildName:req.body.progNameI,
        ChildDesc:req.body.progDescI
    }
    var query={
        ChildProgram:progId,
        ChildLang:lang
    }

    ProgramChildModel.findOneAndUpdate(query,update,function(err,result){

        if(!err){
            res.redirect('/')
        }

    })

}