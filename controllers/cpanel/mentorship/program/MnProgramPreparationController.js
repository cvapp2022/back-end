const ProgramModel =require('../../../../models/mn/MnProgramSchema')
const PreparationModel =require('../../../../models/mn/Program/PreparationSchema')
const { validationResult } = require('express-validator');
const facades = require('../../../../others/facades')


// exports.SaveGet=function(req,res){

//     //validate param
//     var progId=req.params.progId;

//     //fetch meets where program and user 
//     ProgramModel.findById(progId,function(err,result){
//         if(!err && result){
//             return res.render('cpanel/mentorship/programs/preparation/new',{program:result})
//         }
//     }).populate('ProgPreparation')
// }

// exports.SavePost=function(req,res){

//     //validate param
//     var progId=req.params.progId;

//     //validate inputs 
//     const errors = validationResult(req);
//     if (errors.errors.length > 0) {
//         return res.status(400).json({
//             success: false,
//             payload: {err:errors.errors,body:req.body},
//             msg: 'Validation x Error'
//         });
//     }

//     //save Preparation
//     var savePrepare=new PreparationModel();
//     savePrepare.PrepareName=req.body.prepNameI;
//     savePrepare.PrepareMeet=req.body.perpMeetI;
//     savePrepare.save(function(err,result){
//         console.log(err)
//         if(!err && result){

//             //push preparation to program
//             ProgramModel.findById(progId,function(err2,result2){
//                 console.log(err2)
//                 if(!err2 && result2){
//                     console.log(result2)
//                     result2.ProgPreparation.push(result._id)
//                     result2.save(function(err3,result3){
//                         console.log(err3)
//                         if(!err3){
//                             return res.redirect('Cpanel/Mentorship/Programs/'+progId)
//                         }
//                     });
//                 }
//             })
//         }
//     })   
// }

exports.prepareOneGet=function(req,res){

    //validate params
    var progId=req.params.progId;
    var prepId=req.params.prepId;

    //get preparation
    PreparationModel.findById(prepId,function(err,result){
        if(!err && result){
            return res.render('cpanel/mentorship/programs/preparation/preparationOne',{prep:result,progId})
        }
    })
}


exports.prepareUpload=function(req,res){

    //validate params
    var prep=req.params.prepId;
    var lang=req.params.lang;

    //get preparation file id
    PreparationModel.findById(prep,function(err,result){

        var file=req.files.file[0];
        //return res.send(file)
        
        if(!err && result){
            console.log(result.prepareFolder)
            //upload file to prep folder
            facades.uploadFileTo(file,'preparation',result.prepareFolder,function(fileId){
                //update prep attachmets 
                var obj={
                    name:file.originalname,
                    lang,
                    fileId,
                };
                result.PrepareAttachments.push(obj)
                result.save();
                return res.send('saved')

            })
        }
    }) 

}