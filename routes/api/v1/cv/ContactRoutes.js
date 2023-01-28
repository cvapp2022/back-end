const express = require('express');
const { validationResult } = require('express-validator')
const ContactModel = require('../../../../models/cv/ContactSchema')
const CvModel=require('../../../../models/CvSchema')
const Validate = require('../../../../others/validation');
const auth = require('../../../../others/auth');


const router = express.Router();



router.put('/',auth.validateToken,Validate.ContactValidate,async function(req,res){

    //validate inputs 
    const errors = validationResult(req);

    if(errors.errors.length > 0 ){
        return res.json({
            success:false,
            payload:errors.errors,
            msg:'Validation Error' 
        });
    }

    try {
        var contact = await ContactModel.findOne({CKey:req.body.ContactNameI,CVId:req.body.CvIdI}).then((result)=>{
            return result;
        })

        if(!contact){
            //save new contact 
            var saveContact=new ContactModel();
            saveContact.CKey=req.body.ContactNameI
            saveContact.CValue=req.body.ContactValI
            saveContact.CVId=req.body.CvIdI
            await saveContact.save();

            //push contact to cv 
            var cv=await CvModel.findById(req.body.CvIdI).then((result)=>{
                if(!result)
                    throw 'unable to find cv';
                return result;
            })

            cv.CVContact.push(saveContact._id)
            await cv.save()

        }
        else{
            contact.CValue=req.body.ContactValI;
            var saveContact=await contact.save();
        }

        return  res.json({
            success:true,
            payload:saveContact,
            msg:'Contact Successfully Updated' 
        })


    } catch (error) {

        console.log(error.stack)
        return  res.json({
            success:false,
            payload:error,
            msg:'Unable to find Contact' 
        });
    }

})



module.exports = router;