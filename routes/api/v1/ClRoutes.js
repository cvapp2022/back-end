const express = require('express');

const ClController = require('../../../controllers/api/ClController');
const Validate = require('../../../others/validation');
const auth = require('../../../others/auth');

const router = express.Router();


router.post('/',auth.validateToken,Validate.ClValidate,ClController.Save)

router.get('/:clId',auth.validateToken,ClController.Get)

router.put('/:clId',auth.validateToken,Validate.ClValidate,ClController.Update)

router.delete('/:clId',auth.validateToken,Validate.ClValidate,ClController.Delete)

router.put('/:clId/setTemplate',auth.validateToken,ClController.SetTemplate)


module.exports = router;