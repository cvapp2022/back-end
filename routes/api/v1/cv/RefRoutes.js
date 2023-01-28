const express = require('express');


const RefController = require('../../../../controllers/api/cv/RefController')
const Validate = require('../../../../others/validation')
const auth = require('../../../../others/auth');

const router = express.Router();



router.post('/',auth.validateToken,Validate.Refvalidate,RefController.Save)

router.put('/:refId',auth.validateToken,Validate.Refvalidate,RefController.Update)

router.delete('/:refId',auth.validateToken,RefController.Delete);

router.post('/changeSort',auth.validateToken,RefController.ChangeSort)


module.exports = router;