const { payment } = require('paypal-rest-sdk');
const { validationResult } = require('express-validator')
const PaymentRequestModel = require('../../models/order/PaymentRequest')
const PaymentModel = require('../../models/PaymentSchema')
const TemplateOrderModel = require('../../models/order/TemplateOrderSchema')
const ServiceOrderModel = require('../../models/order/ServiceOrderSchema')
const ServRequestModel=require('../../models/service/ServRequestSchema')
const UserModel=require('../../models/UserSchema')

exports.ListGet = function (req, res) {

    //validate params 
    var requestState = req.params.state;
    var requestFrom = req.params.from;

    //get payment requests
    PaymentRequestModel.find({ RequestFrom: requestFrom, RequestState: requestState }).then((result) => {
        return res.render('cpanel/payments/list', { requests: result })
    })

}

exports.ApplyPaymentRequest = async function (req, res) {


    //validate params 
    var requestId = req.params.requestId;
    
    try {
        var paymentRequest=await PaymentRequestModel.findById(requestId).populate({ path: 'RequestOrder' }).then((result)=>{
            if(!result)
                throw 'unable to find payment request';
            return result
        })

        if (paymentRequest.RequestState != 'waiting') {
           throw'Payment Request is not Waiting';
        }

        let order,price;
        if (paymentRequest.externalModelType === 'BLTemplateOrder') {
            order=await TemplateOrderModel.findById(paymentRequest.RequestOrder._id).populate({ path: 'OrderTemplate' }).then((result)=>{
                if(!result)
                    throw 'unable to find template order';
                return result
            })
            price=order.OrderTemplate.TemplatePrice
        }
        else if(paymentRequest.externalModelType === 'BLServiceOrder'){
            order=await ServiceOrderModel.findById(paymentRequest.RequestOrder._id).populate('OrderService').then((result)=>{
                if(!result)
                    throw 'unable to find service order';
                return result
            })
            price=order.OrderService.ServPrice
        }
        
        
        //save payment
        var savePayment = new PaymentModel();
        savePayment.PaymentFor = order.OrderName;
        savePayment.PaymentValue = price; //get it from payment object
        savePayment.PaymentOrder = order._id;
        savePayment.PaymentWay = paymentRequest.RequestFrom;
        savePayment.PaymentId = requestId;
        var savedPayment=await savePayment.save();


        //update order
        order.OrderPaid = true;
        order.OrderPayment = savedPayment._id;
        await order.save()

        //  update Payment Request
        paymentRequest.RequestState = 'applied';
        var updatedPaymentRequest=await paymentRequest.save();
        
        //save service request 
        if(paymentRequest.externalModelType === 'BLServiceOrder'){
            var saveServRequest =new ServRequestModel();
            saveServRequest.ReqServ=order.OrderService._id;
            saveServRequest.ReqUser=order.OrderUser;
            await saveServRequest.save();

            //push request and order to user
            var user =await UserModel.findById(order.OrderUser).then((result)=>{
                if(!result)
                    throw 'unable to find user';
                return result;
            })
 
            user.SRRequests.push(saveServRequest._id)
            await user.save()
            
        }

        return res.send('Payment Request Successfully applied' + updatedPaymentRequest,)


    } catch (error) {
        return res.send(error)
    }


//check payment request 
    // PaymentRequestModel.findById(requestId, function (err, paymentRequest) {
    //     if (!err && paymentRequest) {
    //         if (paymentRequest.RequestState != 'waiting') {
    //             return res.send('Payment Request is not Waiting');
    //         }
    //         if (paymentRequest.externalModelType === 'BLTemplateOrder') {
    //             TemplateOrderModel.findById(paymentRequest.RequestOrder._id, function (err2, templateOrder) {
    //                 console.log(err2)
    //                 if (!err2 && templateOrder) {
    //                     //save payment
    //                     savePayment = new PaymentModel();
    //                     savePayment.PaymentFor = templateOrder.OrderName;
    //                     savePayment.PaymentValue = templateOrder.OrderTemplate.TemplatePrice; //get it from payment object
    //                     savePayment.PaymentOrder = templateOrder._id;
    //                     savePayment.PaymentWay = paymentRequest.RequestFrom;
    //                     savePayment.PaymentId = requestId;
    //                     savePayment.save(function (err3, savedPayment) {
    //                         if (!err3 && savedPayment) {
    //                             //update templateOrder
    //                             templateOrder.OrderPaid = true;
    //                             templateOrder.OrderPayment = savedPayment._id;
    //                             templateOrder.save(function (err4, savedTemplateOrder) {
    //                                 if (!err4 && savedTemplateOrder) {
    //                                     //update Payment Request
    //                                     paymentRequest.RequestState = 'applied';
    //                                     paymentRequest.save(function (err4, updatedPaymentRequest) {
    //                                         if (!err4 && updatedPaymentRequest) {
    //                                             return res.send('Payment Request Successfully applied' + updatedPaymentRequest,)
    //                                         }
    //                                         else {
    //                                             return res.send('Unable to update payment request');
    //                                         }

    //                                     })
    //                                 }
    //                                 else {
    //                                     return res.send('Unable to update template order');
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 }
    //                 else {
    //                     return res.send('unable to find template order')
    //                 }

    //             }).populate({ path: 'OrderTemplate' })
    //         }
    //         else if (paymentRequest.externalModelType === 'BLServiceOrder') {
    //             ServiceOrderModel.findById(paymentRequest.RequestOrder._id, function (err2, serviceOrder) {
    //                 if (err2 || !serviceOrder) {
    //                     return res.send('unable to find service order')
    //                 }
    //                 else {

    //                     //save payment
    //                     savePayment = new PaymentModel();
    //                     savePayment.PaymentFor = serviceOrder.OrderName;
    //                     savePayment.PaymentValue = serviceOrder.OrderService.ServPrice; //get it from payment object
    //                     savePayment.PaymentOrder = serviceOrder._id;
    //                     savePayment.PaymentWay = paymentRequest.RequestFrom;
    //                     savePayment.PaymentId = requestId;
    //                     savePayment.save(function (err3, savedPayment) {

    //                         if (err3 || !savedPayment) {
    //                             return res.send('unable to save payment' + err3)
    //                         }
    //                         else {

    //                             //update serviceOrder
    //                             serviceOrder.OrderPaid = true;
    //                             serviceOrder.OrderPayment = savedPayment._id;
    //                             serviceOrder.save(function (err4, updatedServiceOrder) {
    //                                 if (err4 || !updatedServiceOrder) {
    //                                     return res.send('unable to update service order')
    //                                 }
    //                                 else {

    //                                     //update Payment Request
    //                                     paymentRequest.RequestState = 'applied';
    //                                     paymentRequest.save(function (err4, updatedPaymentRequest) {
    //                                         if (err4 || !updatedPaymentRequest) {
    //                                             return res.send('Unable to update payment request');
    //                                         }
    //                                         else {
    //                                             //save service request 
    //                                             var saveServRequest =new ServRequestModel();
    //                                             saveServRequest.ReqServ=serviceOrder.OrderService._id;
    //                                             saveServRequest.ReqUser=serviceOrder.OrderUser;
    //                                             saveServRequest.save(function(err5,savedServRequest){
    //                                                 if(err5 || !savedServRequest){
    //                                                     return res.json({
    //                                                         success: false,
    //                                                         payload: null,
    //                                                         message: 'Unable to save service request'
    //                                                     })
    //                                                 }
    //                                                 else{
    //                                                     return res.json({
    //                                                         success: true,
    //                                                         payload: savedServRequest,
    //                                                         message: 'Service Succefully requested paid By cash'
    //                                                     })
    //                                                 }
    //                                             })
    //                                             return res.send('Payment Request Successfully applied' + updatedPaymentRequest,)
    //                                         }
    //                                     })
    //                                 }
    //                             })
    //                         }
    //                     })
    //                 }
    //             }).populate('OrderService')
    //         }
    //     }

    // }).populate({ path: 'RequestOrder' })
}
