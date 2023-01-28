const express = require('express');
const auth = require('../../../../../others/auth');
const Validate = require('../../../../../others/validation');
const SrRequestMessageController=require('../../../../../controllers/api/service/request/SrRequestMessageController')

const router = express.Router();

router.post('/:requestId/',auth.validateToken,Validate.SrMessageValidate,SrRequestMessageController.Save)

module.exports = router;