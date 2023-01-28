const ServiceModel=require('../../../models/ServiceSchema')
const ServiceChildModel = require('../../../models/service/ChildSchema')



exports.Get=function(req,res){
    

    //validate param
    var servId=req.params.servId;
    var lang = req.params.lang;


    //get program
    ServiceChildModel.findOne({ChildService:servId,ChildLang:lang}).then((result)=>{
        if(result){
            return res.render('cpanel/services/child/childOne',{child:result,servId,lang})
        }
        else{
           return res.render('cpanel/services/child/new')

        }

    }).catch((err)=>{
        console.log(err)
    })
    //get child



}

exports.Save=async function(req,res){

    //validate param
    var servId=req.params.servId;
    var lang = req.params.lang;

    //get program
    var checkService=await ServiceModel.findById(servId).then((result)=>{
        return result;
    }).catch(()=>{
        return res.send('unable to find service')
    });

    //save service child
    var saveChild= new ServiceChildModel();
    saveChild.ChildLang=lang;
    saveChild.ChildService=servId;
    saveChild.ChildName=req.body.servNameI;
    saveChild.ChildDesc=req.body.servDescI;
    var savedChild=await saveChild.save().then((result)=>{
        return result;
    }).catch((err)=>{
        console.log(err)
        res.send('unable to save child service')
    })

    //push child service to parent and update
    checkService.ServChilds.push(savedChild._id)
    checkService.save().then(()=>{
        res.redirect('/');
    }).catch(()=>{
        res.send('unable to update parent service')
    })

    

}

exports.Update=function(req,res){
    


    
}