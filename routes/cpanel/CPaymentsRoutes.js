const express = require('express')

const CPaymentController=require('../../controllers/cpanel/CPaymentsController')

var router = express.Router();

router.get('/:requestId/apply',CPaymentController.ApplyPaymentRequest)

router.get('/:from/:state',CPaymentController.ListGet)


module.exports = router;