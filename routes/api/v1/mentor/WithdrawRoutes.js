const express = require('express')


const auth = require('../../../../others/auth');
const Validate = require('../../../../others/validation');
const WithdrawController=require('../../../../controllers/api/mentor/WithdrawController') 
var router = express.Router();

router.get('/',auth.validateToken,WithdrawController.Get)

router.post('/',auth.validateToken,Validate.WithdrawValidate,WithdrawController.Save)


module.exports = router;