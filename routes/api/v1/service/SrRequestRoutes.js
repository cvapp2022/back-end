const express = require('express')
const auth = require('../../../../others/auth');
const Validate = require('../../../../others/validation');
const SrRequestController=require('../../../../controllers/api/service/ServRequestController')
const router = express.Router();

router.get('/all/:type',auth.validateToken,SrRequestController.Get)

router.get('/:requestId',auth.validateToken,SrRequestController.getRequestOne)

router.put('/:requestId/apply',auth.validateToken,SrRequestController.Apply)

router.put('/:requestId/complete',auth.validateToken,SrRequestController.Complete)

module.exports = router;