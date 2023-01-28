const UserModel = require('../../models/UserSchema');


exports.EmailValidate=function(req,res){


    var email=req.params.value;
  

        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        var isEmail=emailRegexp.test(email)
        if(email && isEmail){
            UserModel.findOne({CVUserMail:email},function(err,result){
        
                if(result && !err){
        
                    return res.json({
                        success:false,
                        payload:null,
                        message:'Email Already in use'
                    })
                }
                else{
                    return res.json({
                        success:true,
                        payload:null,
                        message:'Email is valid'
                    })
                }
        
            })
        }
        else{
            return res.json({
                success:false,
                payload:null,
                message:'param not valid',
        });
    }
}