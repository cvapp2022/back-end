const express = require('express');


const UserController = require('../../../controllers/api/UserController')
const Validate = require('../../../others/validation');
const auth = require('../../../others/auth');

const router = express.Router();

router.get('/',auth.validateToken,UserController.Get)

router.post('/',Validate.SaveUserValidate,UserController.Save)

router.post('/login',Validate.LoginUserValidate,UserController.Login)

router.get('/loginGoogle',UserController.loginGoogle)

router.get('/loginGithub',UserController.loginGithub)

router.get('/loginLinkedin',UserController.loginLinkedin)


module.exports = router;