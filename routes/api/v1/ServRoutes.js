const express = require('express')
const auth = require('../../../others/auth');
const Validate = require('../../../others/validation');
const router = express.Router();

const ServiceController=require('../../../controllers/api/ServiceController')

router.get('/:lang',auth.validateToken,ServiceController.GetAll)

router.get('/:serviceId/:lang',auth.validateToken,ServiceController.Get)

router.get('/:serviceId/orderPayPalReq/:userId',auth.validateToken,ServiceController.PayServicePayPalReq)

router.get('/:serviceId/orderPayPalExec/:userId',ServiceController.PayServicePayPalExec)

router.get('/:serviceId/orderPayPalCancel',auth.validateToken,(req, res) => res.send(' paypal payment Cancelled'))

router.post('/:serviceId/orderStripeReq/',auth.validateToken,Validate.StripeReqValidate,ServiceController.PayServiceStripeReq)

router.get('/:serviceId/orderStripeExec/:chargeId',auth.validateToken,ServiceController.PayServiceStripeExec)

router.get('/:serviceId/orderSyrCashReq/',auth.validateToken,ServiceController.payServiceSyrcReq)

router.post('/:serviceId/orderCashExec/:from',auth.validateToken,Validate.PaymentValidate,ServiceController.payServiceExec)



module.exports = router;