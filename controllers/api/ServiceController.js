const paypal = require('paypal-rest-sdk');
const stripe = require('stripe')(process.env.STRIPE_SECERET);
const ServiceOrderModel = require('../../models/order/ServiceOrderSchema')
const PaymentRequestModel = require('../../models/order/PaymentRequest')
const ServRequestModel=require('../../models/service/ServRequestSchema')
const PaymentModel = require('../../models/PaymentSchema')
const ServiceModel = require('../../models/ServiceSchema')
const UserModel = require('../../models/UserSchema')
const facades = require('../../others/facades');
var ObjectId = require('mongoose').Types.ObjectId;
const { validationResult } = require('express-validator')

paypal.configure({
    'mode': process.env.PAYPAL_MODE, //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT,
    'client_secret': process.env.PAYPAL_SECERET
});



exports.GetAll = function (req, res) {

    //validte params
    var lang = req.params.lang;

    //get services
    ServiceModel.find({ ServStatus: 1 }, function (err, result) {
        console.log(err)
        if (!err) {
            return res.json({
                success: true,
                payload: result,
                message: 'Service Successfully loaded'
            })
        }
        else {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to load Service'
            })
        }
    }).populate([
        {
            path: 'ServChilds',
            match: { ChildLang: lang }
        }
    ])

}



exports.Get = function (req, res) {

    var servId = req.params.serviceId;
    var lang = req.params.lang;
    console.log(facades.checkLang(lang))
    if (!ObjectId.isValid(servId) || !facades.checkLang(lang)) {
        return res.json({
            success: false,
            payload: null,
            message: 'Param not valid'
        });
    }
    else{
        //get service 
        ServiceModel.findById(servId, function (err, service) {
            if (!err && service) {
                return res.json({
                    success: true,
                    payload: service,
                    message: 'Service Successfully loaded'
                })
            }
            else {
                return res.json({
                    success: false,
                    payload: null,
                    message: 'Unable to load Service'
                })
            }
        }).populate([
            {
                path: 'ServChilds',
                match: { ChildLang: lang }
            }
        ])
    }

}



exports.PayServicePayPalReq = function (req, res) {

    //validate service param
    var serviceId = req.params.serviceId;
    var userId = req.params.userId;

    //get service 
    ServiceModel.findById(serviceId, function (err, result) {
        if (err || !result) {
            return res.json({
                success: false,
                payload: null,
                message: 'Unable to find service'
            });
        }
        else{

            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:5000/api/v1/Service/" + serviceId + "/orderPayPalExec/" + userId,
                    "cancel_url": "http://localhost:5000/api/v1/Service/" + serviceId + "/orderPayPalCancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": result.ServName,
                            "price": result.ServPrice,
                            "currency": "USD",
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": result.ServPrice
                    },
                    "description": result.ServDesc
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

exports.PayServicePayPalExec = async function (req, res) {

    //validate template param
    var serviceId = req.params.serviceId;
    var userId = req.params.userId;
    //get template 

    try {

        var service=ServiceModel.findById(serviceId).then((result)=>{
            if(!result)
                throw 'unable to find service';
            return result;
        })

        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": service.ServPrice
                }
            }]
        };
        
        paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {

            if (error) {
                console.log(error.response);
                throw error;
            } 
            else {

                //create new order 
                var SaveSeviceOrder = new ServiceOrderModel();
                SaveSeviceOrder.OrderName = service.ServName + ' order';
                SaveSeviceOrder.OrderUser = userId;
                SaveSeviceOrder.OrderService = serviceId;
                var serviceOrder=await SaveSeviceOrder.save();

                //set payment to order and change order states
                var SavePayment = new PaymentModel();
                SavePayment.PaymentFor = service.ServName + ' service';
                SavePayment.PaymentValue = service.ServPrice; //get it from payment object
                SavePayment.PaymentOrder = serviceOrder._id;
                SavePayment.PaymentWay = 'paypal';
                SavePayment.PaymentId = paymentId;
                var savedPayment=await SavePayment.save()
                
                //set order payment
                ServiceOrderModel.findByIdAndUpdate(serviceOrder._id, { OrderPayment: savedPayment._id, OrderPaid: true }, { new: true }).exec()

                //push order and service request to user 
                var user= await UserModel.findById(userId).then((result)=>{
                    if(!result)
                        throw 'unable to find user';
                    return result;
                })
                
                //save service request 
                var saveServRequest =new ServRequestModel();
                saveServRequest.ReqServ=service._id;
                saveServRequest.ReqUser=user._id;
                var savedServRequest=await saveServRequest.save()



                user.ServiceOrders.push(serviceOrder._id)
                user.SRRequests.push(savedServRequest._id)
                await user.save()

                return res.json({
                    success: true,
                    payload: savedServRequest,
                    message: 'Service Succefully requested paid By paypal'
                })
            }
        })
        
    } catch (error) {
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        }); 
    }
}

        




exports.PayServiceStripeReq = function (req, res) {

    //validate inputs

    var newCharge = {
        amount: req.body.price,
        currency: "usd",
        source: req.body.token_from_stripe, // obtained with Stripe.js on the client side
        description: 'service order ',
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

exports.PayServiceStripeExec = async function (req, res) {

    var serviceId = req.params.serviceId;
    var userId = req.user._id;

    stripe.charges.retrieve(req.params.chargeId, async function (err, charge) {
        if (err) {
            return res.json({
                success: false,
                payload: null,
                message: 'Somthing went Wrong while retrive charge'
            })
        }
        else {
            //console.log(charge.id)

            try{

                var service =await ServiceModel.findById(serviceId).then((result)=>{
                    if(!result)
                        throw   'unable to find service';
                    return result;
                })
    
                //create new order
                var SaveServiceOrder = new ServiceOrderModel();
                SaveServiceOrder.OrderName = service.ServName + ' service';
                SaveServiceOrder.OrderUser = userId;
                SaveServiceOrder.OrderService = service._id;
    
                //save Service Order
                var serviceOrder=await SaveServiceOrder.save()
            
                //set payment to order and change order states
                var SavePayment = new PaymentModel();
                SavePayment.PaymentFor = service.ServName + ' service';
                SavePayment.PaymentValue = service.ServPrice; //get it from payment object
                SavePayment.PaymentOrder = serviceOrder._id;
                SavePayment.PaymentWay = 'creditCard';
                SavePayment.PaymentId = charge.id;
                var payment=SavePayment.save()
    
                //set order payment
                await ServiceOrderModel.findByIdAndUpdate(serviceOrder._id, { OrderPayment: payment._id, OrderPaid: true }, { new: true }).exec();
    
                var user=await UserModel.findById(userId).then((result)=>{
                    if(!result)
                        throw 'unable to find user';
                    return result;
                })    
                
                //save service request 
                var saveServRequest =new ServRequestModel();
                saveServRequest.ReqServ=service._id;
                saveServRequest.ReqUser=user._id;
                var savedServRequest= await saveServRequest.save();
                
                //push service order and service request to user 
                user.ServiceOrders.push(serviceOrder._id)
                user.SRRequests.push(savedServRequest._id)

                await user.save()

                return res.json({
                    success: true,
                    payload: savedServRequest,
                    message: 'Service Succefully requested paid By credit card'
                })

            }
            catch(error){
                console.log(error.stack)
                return res.json({
                    success: false,
                    payload: null,
                    message:error
                });
            }

        }
    })                                        
}


exports.payServiceSyrcReq = function (req, res) {

    //get syriatel qr code by payment value
    return res.json({
        success: true,
        payload: null,
        message: 'Qr code for syriatel cash successfully loaded'
    })


}

exports.payServiceExec = async function (req, res) {


    //validate inputs 
    var serviceId = req.params.serviceId;
    var from = req.params.from;
    var userId = req.user._id;

    //validate inputs 
    const errors = validationResult(req);
    if (errors.errors.length > 0) {
        return res.json({
            success: false,
            payload: errors.errors,
            message: 'Validation Error'
        });
    }

    try {

        //check if has older request 
        await PaymentRequestModel.find({ RequestState: 'waiting', RequestPNumber: req.body.PhoneNumberI }).then((result)=>{
            if(result.length > 0)
                throw 'Already has waiting request ';
        })

        //save service order as Not Paid
        var service =await ServiceModel.findById(serviceId).then((result)=>{
            if(!result)
                throw 'Unable to find service';
            return result;
        })
        

        //create new order 
        var SaveServiceOrder = new ServiceOrderModel();
        SaveServiceOrder.OrderName = service.ServName + ' service';
        SaveServiceOrder.OrderUser = userId;
        SaveServiceOrder.OrderService = service._id;
        SaveServiceOrder.OrderPaid = false;
        var serviceOrder= await SaveServiceOrder.save()

        
        //save Payment Request
        var savePaymentRequest = new PaymentRequestModel();
        savePaymentRequest.RequestFrom = from;
        savePaymentRequest.RequestState = 'waiting';
        savePaymentRequest.RequestOrder = serviceOrder._id;
        savePaymentRequest.externalModelType = 'BLServiceOrder';
        savePaymentRequest.RequestPNumber = req.body.PhoneNumberI;
        savePaymentRequest.RequestOpNumber = req.body.OpNumberI;
        await savePaymentRequest.save()
        
        //push order to user
        var user =await UserModel.findById(userId).then((result)=>{
            if(!result)
                throw 'Unable to find user';
            return result
        })
        user.ServiceOrders.push(serviceOrder._id)
        await user.save()
            
        return res.json({
            success: true,
            payload: serviceOrder,
            message: 'Service Successfully orderd By' + from
        })

    }
    catch(error){
        console.log(error.stack)
        return res.json({
            success: false,
            payload: null,
            message:error
        });
    }
}