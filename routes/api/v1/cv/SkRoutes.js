const express = require('express');


const SkController = require('../../../../controllers/api/cv/SkController')
const Validate = require('../../../../others/validation')
const auth = require('../../../../others/auth');

const router = express.Router();



router.post('/',auth.validateToken,Validate.SkillValidate,SkController.Save)

router.put('/:skId',auth.validateToken,Validate.SkillValidate,SkController.Update)

router.delete('/:skId',auth.validateToken,SkController.Delete);

router.post('/push',auth.validateToken,SkController.Push)

router.post('/pull',auth.validateToken,SkController.Pull)

module.exports = router;