const express = require('express');
const Validate = require('../../../../../others/validation');
const auth = require('../../../../../others/auth');


const SrRequestCvController=require('../../../../../controllers/api/service/request/SrRequestCvController')

const router = express.Router();

router.post('/:requestId/',auth.validateToken,Validate.CvValidate,SrRequestCvController.Save);

router.delete('/:requestId/:cvId',auth.validateToken,SrRequestCvController.Delete)

router.get('/:requestId/:cvId/export',auth.validateToken,SrRequestCvController.Export)


module.exports = router;