const express = require('express')

const AwController =require('../../../../controllers/api/cv/AwController')
const Validate = require('../../../../others/validation')
const auth = require('../../../../others/auth');

var router = express.Router();

router.post('/',auth.validateToken,Validate.AwValidate,AwController.Save)

router.put('/:awId',auth.validateToken,Validate.AwValidate,AwController.Update)

router.delete('/:awId',auth.validateToken,AwController.Delete)

router.post('/changeSort',auth.validateToken,AwController.ChangeSort)

module.exports = router;