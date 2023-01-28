const express = require('express')

const OrgController =require('../../../../controllers/api/cv/OrgController')
const Validate = require('../../../../others/validation')
const auth = require('../../../../others/auth');

var router = express.Router();



router.post('/',auth.validateToken,Validate.OrgValidate,OrgController.Save)

router.put('/:orgId',auth.validateToken,Validate.OrgValidate,OrgController.Update)

router.delete('/:orgId',auth.validateToken,OrgController.Delete)

router.post('/changeSort',auth.validateToken,OrgController.ChangeSort)

module.exports = router;