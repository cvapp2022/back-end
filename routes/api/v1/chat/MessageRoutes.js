const express = require('express');
const auth = require('../../../../others/auth');
const Validate = require('../../../../others/validation');
const MessageController=require('../../../../controllers/api/MessageController')

const router = express.Router();

router.post('/:chatId',auth.validateToken,Validate.SrMessageValidate,MessageController.saveMessage)

module.exports = router;