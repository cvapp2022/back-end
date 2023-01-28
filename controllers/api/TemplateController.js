const paypal = require('paypal-rest-sdk');
const { validationResult } = require('express-validator')
const TemplateModel = require('../../models/TemplateSchema');
const TemplateOrderModel = require('../../models/order/TemplateOrderSchema')
const PaymentModel = require('../../models/PaymentSchema')
const PaymentRequestModel = require('../../models/order/PaymentRequest')
const UserModel = require('../../models/UserSchema')
const stripe = require('stripe')(process.env.STRIPE_SECERET);

paypal.configure({
    'mode': process.env.PAYPAL_MODE, //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT,
    'client_secret': process.env.PAYPAL_SECERET
});

//
// sb-ah0ve20796660@business.example.com
// sb-axyv920783777@personal.example.com
// 58U|mq&y
// https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-9GH42318L5297972L
exports.OrderTemplate = function (req, res) {



}


exports.PayTemplatePayPalReq = function (req, res) {

    //validate template param
    var templateId = req.params.templateId;
    var userId = req.params.userId;

    //get template 
    TemplateModel.findById(templateId, function (err, result) {
        if (!err && result) {

            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:5000/api/v1/Template/" + templateId + "/orderPayPalExec/" + userId,
                    "cancel_url": "http://localhost:5000/api/v1/Template/" + templateId + "/orderPayPalCancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": result.TemplateName + ' ' + result.TemplateFor + ' template',
                            "price": result.TemplatePrice,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": result.TemplatePrice
                    },
                    "description": result.TemplateDesc
                }]
            };
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    throw error;
                } else {

                    //create new template order

                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            res.send(payment.links[i].href);
                        }
                    }
                }
            });

        }
    })
}

exports.PayTemplatePayPalExec = async function (req, res) {

    //validate template param
    var templateId = req.params.templateId;
    var userId = req.params.userId;
    //get template 


    TemplateModel.findById(templateId, function (err, result) {
        if (err || !result) {

            return res.json({
                success: false,
                payload: null,
                message: 'unable to find template'
            })
        }
        else {

            const payerId = req.query.PayerID;
            const paymentId = req.query.paymentId;
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": result.TemplatePrice
                    }
                }]
            };

            paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {

                //create new order 
                var SaveTemplateOrder = new TemplateOrderModel();
                SaveTemplateOrder.OrderName = result.TemplateName + ' ' + result.TemplateFor + ' template';
                SaveTemplateOrder.OrderUser = userId;
                SaveTemplateOrder.OrderTemplate = templateId;
                SaveTemplateOrder.save(function (err2, templateOrder) {
                    if (err2 || !templateOrder) {
                        return res.json({
                            success: false,
                            payload: null,
                            message: 'unable to save template'
                        })
                    }
                    else {

                        //set payment to order and change order states
                        var SavePayment = new PaymentModel();
                        SavePayment.PaymentFor = result.TemplateName + ' ' + result.TemplateFor + ' template';
                        SavePayment.PaymentValue = result.TemplatePrice; //get it from payment object
                        SavePayment.PaymentOrder = templateOrder._id;
                        SavePayment.PaymentWay = 'paypal';
                        SavePayment.PaymentId = paymentId;
                        SavePayment.save(function (err3,savedPayment) { 

                            if(err3 || !savedPayment){
                                return res.json({
                                    success: false,
                                    payload: null,
                                    message: 'unable to save payment'
                                })
                            }
                            else{
                                //set order payment
                                TemplateOrderModel.findByIdAndUpdate(templateOrder._id, { OrderPayment: savedPayment._id, OrderPaid: true }, { new: true }, function (err4) {

                                    if(err4){
                                        return res.json({
                                            success: false,
                                            payload: null,
                                            message: 'unable to update template order'
                                        })
                                    }
                                    else{

                                        //push order to user 
                                        UserModel.findById(userId, function (err5, user) {
                                            if (err3) {
                                                return res.json({
                                                    success: false,
                                                    payload: null,
                                                    message: 'unable to find user'
                                                })
                                            }
                                            else {
                                            
                                                user.TemplateOrders.push(templateOrder._id)
                                                user.save(function (err4) {
                                                    if (err4) {
                                                        return res.json({
                                                            success: false,
                                                            payload: null,
                                                            message: 'unable to update user'
                                                        })
                                                    }
                                                    else{
                                                        return res.json({
                                                            success: true,
                                                            payload: result,
                                                            message: 'Template Succefully paid By paypal'
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
    })
}

exports.PayTemplateStripeReq = function (req, res) {

    //validate inputs
    console.log('price is',req.body.price)
    var newCharge = {
        amount:1222.00,
        currency: "usd",
        source: req.body.token_from_stripe, // obtained with Stripe.js on the client side
        description: 'template order ',
        receipt_email: req.body.email,
    };


    // Call the stripe objects helper functions to trigger a new charge
    stripe.charges.create(newCharge, function (err, charge) {
        // send response
        if (err) {
            console.error(err);
            res.json({ error: err, charge: false });
        } else {
            // send response with charge data
            res.json({ error: false, charge: charge });
        }
    });

}

exports.PayTemplateStripeExec = async function (req, res) {

    var templateId = req.params.templateId;
    var userId = req.user._id;

    stripe.charges.retrieve(req.params.chargeId, async function (err, charge) {
        if (err) {
            return res.json({
                success: false,
                payload: null,
                message: 'Somthing went Wrong while retrive charge'
            })
        } else {

            TemplateModel.findById(templateId, function (err, result) {

                if (err || !result) {
                    return res.json({
                        success: false,
                        payload: null,
                        message: 'Unable to find template'
                    })
                }
                else {

                    //create new order 
                    var SaveTemplateOrder = new TemplateOrderModel();
                    SaveTemplateOrder.OrderName = result.TemplateName + ' ' + result.TemplateFor + ' template';
                    SaveTemplateOrder.OrderUser = userId;
                    SaveTemplateOrder.OrderTemplate = result._id;
                    SaveTemplateOrder.save(function (err2, templateOrder) {
                        if (err2 || !templateOrder) {
                            return res.json({
                                success: false,
                                payload: null,
                                message: 'Unable to save template order'
                            })
                        }
                        else {

                            //set payment to order and change order states
                            var SavePayment = new PaymentModel();
                            SavePayment.PaymentFor = result.TemplateName + ' ' + result.TemplateFor + ' template';
                            SavePayment.PaymentValue = result.TemplatePrice; //get it from payment object
                            SavePayment.PaymentOrder = templateOrder._id;
                            SavePayment.PaymentWay = 'creditCard';
                            SavePayment.PaymentId = charge.id;
                            SavePayment.save(function (err3, payment) {
                                if (err3 || !payment) {
                                    return res.json({
                                        success: false,
                                        payload: null,
                                        message: 'Unable to save payment'
                                    })
                                }
                                else {

                                    //set order payment
                                    TemplateOrderModel.findByIdAndUpdate(templateOrder._id, { OrderPayment: payment._id, OrderPaid: true }, { new: true }, function (err4) {
                                        if (err4) {
                                            return res.json({
                                                success: false,
                                                payload: null,
                                                message: 'Unable to update template order'
                                            })
                                        }
                                        else {

                                            //push order to user 
                                            UserModel.findById(userId, function (err5, user) {
                                                if (err5) {
                                                    return res.json({
                                                        success: false,
                                                        payload: null,
                                                        message: 'Unable to find user'
                                                    })
                                                }
                                                else {
                                                    user.TemplateOrders.push(templateOrder._id)
                                                    user.save(function (err6) {
                                                        if (err6) {
                                                            return res.json({
                                                                success: false,
                                                                payload: null,
                                                                message: 'Unable to update user'
                                                            })
                                                        }
                                                        else {
                                                            return res.json({
                                                                success: true,
                                                                payload: result,
                                                                message: 'Template Succefully paid By Credit Card'
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    });
}


exports.payTemplateSyrcReq = function (req, res) {

    //get syriatel qr code by payment value
    return res.json({
        success: true,
        payload: null,
        message: 'Qr code for syriatel cash successfully loaded'
    })


}

exports.payTemplateExec = async function (req, res) {


    //validate inputs 
    var templateId = req.params.templateId;
    var from = req.params.from;
    var userId = req.user._id;

    //validate inputs 
    const errors = validationResult(req);

    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            msg: 'Validation Error'
        });
    }

    //check if has older request 
    PaymentRequestModel.find({ RequestState: 'waiting', RequestPNumber: req.body.PhoneNumberI }, async function (err, result) {
        console.log(result)
        if (!err && result.length > 0) {
            return res.json({
                success: false,
                payload: null,
                message: 'Already has waiting request '
            });
        }
        else {

            //save template order as Not Paid
            TemplateModel.findById(templateId, function (err2, result) {
                if (err2 || !result) {
                    return res.json({
                        success: false,
                        payload: null,
                        message: 'Unable to find template'
                    });
                }
                else {

                    //create new order 
                    var SaveTemplateOrder = new TemplateOrderModel();
                    SaveTemplateOrder.OrderName = result.TemplateName + ' ' + result.TemplateFor + ' template';
                    SaveTemplateOrder.OrderUser = userId;
                    SaveTemplateOrder.OrderTemplate = result._id;
                    SaveTemplateOrder.OrderPaid = false;

                    //save template Order
                    SaveTemplateOrder.save(function (err3, templateOrder) {
                        if (err3 || !templateOrder) {
                            return res.json({
                                success: false,
                                payload: null,
                                message: 'Unable to save Template Order'
                            });
                        }
                        else {

                            //push order to user
                            UserModel.findById(userId, function (err4, user) {
                                if (err4 || !user) {
                                    return res.json({
                                        success: false,
                                        payload: null,
                                        message: 'Unable to find user'
                                    });
                                }
                                else {
                                    user.TemplateOrders.push(templateOrder._id)
                                    user.save(function (err5) {
                                        if (err5) {
                                            return res.json({
                                                success: false,
                                                payload: null,
                                                message: 'Unable to update user'
                                            });
                                        }
                                        else {

                                            //save Payment Request
                                            var savePaymentRequest = new PaymentRequestModel();
                                            savePaymentRequest.RequestFrom = from;
                                            savePaymentRequest.RequestState = 'waiting';
                                            savePaymentRequest.RequestOrder = templateOrder._id;
                                            savePaymentRequest.externalModelType = 'BLTemplateOrder';
                                            savePaymentRequest.RequestPNumber = req.body.PhoneNumberI;
                                            savePaymentRequest.RequestOpNumber = req.body.OpNumberI;
                                            savePaymentRequest.save(function (err6) {
                                                if (err6) {
                                                    return res.json({
                                                        success: false,
                                                        payload: null,
                                                        message: 'Unable to save payment'
                                                    });
                                                }
                                                else {
                                                    return res.json({
                                                        success: true,
                                                        payload: result,
                                                        message: 'Template Successfully orderd By' + from
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}