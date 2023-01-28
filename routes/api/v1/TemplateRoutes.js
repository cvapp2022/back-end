
const express = require('express');
const Validate = require('../../../others/validation');
const auth = require('../../../others/auth');
const TemplateController = require('../../../controllers/api/TemplateController');

const router = express.Router();

router.post('/:templateId/order',auth.validateToken,TemplateController.OrderTemplate)

router.get('/:templateId/orderPayPalReq/:userId',auth.validateToken,TemplateController.PayTemplatePayPalReq)

router.get('/:templateId/orderPayPalExec/:userId',TemplateController.PayTemplatePayPalExec)

router.get('/:templateId/orderPayPalCancel',auth.validateToken,(req, res) => res.send(' paypal payment Cancelled'))

router.post('/:templateId/orderStripeReq/',auth.validateToken,Validate.StripeReqValidate,TemplateController.PayTemplateStripeReq)

router.get('/:templateId/orderStripeExec/:chargeId',auth.validateToken,TemplateController.PayTemplateStripeExec)

router.get('/:templateId/orderSyrCashReq/',auth.validateToken,TemplateController.payTemplateSyrcReq)

router.post('/:templateId/orderCashExec/:from',auth.validateToken,Validate.PaymentValidate,TemplateController.payTemplateExec)

module.exports = router;