const express = require('express')


const Validate = require('../../../../others/validation')
const auth = require('../../../../others/auth');

const MnRequestController=require('../../../../controllers/api/mentorship/MnRequestController')

var router = express.Router();

router.get('/:type',auth.validateToken,MnRequestController.Get)

router.post('/',auth.validateToken,Validate.MnRequestValidate,MnRequestController.Save)

router.put('/:reqId',auth.validateToken,Validate.MnRequestValidate,MnRequestController.Update)

router.put('/:reqId/apply',auth.validateToken,MnRequestController.Apply) //only for mentor-app

router.put('/:reqId/pay',auth.validateToken,MnRequestController.Pay)

module.exports = router;