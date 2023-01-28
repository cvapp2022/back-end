const express = require('express');
const Validate = require('../../../../../others/validation');
const auth = require('../../../../../others/auth');


const SrRequestClController=require('../../../../../controllers/api/service/request/SrRequestClController')

const router = express.Router();

router.post('/:requestId/',auth.validateToken,Validate.ClValidate,SrRequestClController.Save);

router.delete('/:requestId/:clId',auth.validateToken,SrRequestClController.Delete)

router.get('/:requestId/:clId/export',auth.validateToken,SrRequestClController.Export)


module.exports = router;