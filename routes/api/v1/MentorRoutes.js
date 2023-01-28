const express = require('express')
const MentorController =  require('../../../controllers/api/MnMentorController')
const Validate = require('../../../others/validation');
const auth = require('../../../others/auth');

var router = express.Router();


router.get('/',auth.validateToken,MentorController.Get)

router.post('/login',Validate.LoginUserValidate,MentorController.Login)




module.exports = router;    