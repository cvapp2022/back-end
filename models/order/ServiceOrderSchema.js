const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const ServiceOrder = new Schema({ 

    OrderName:{type:String,required:true},
    OrderPaid:{type:Boolean,default:false}, 
    OrderUser:{type: mongoose.Schema.Types.ObjectId,ref:'BLCVUser'},
    OrderService:{type: mongoose.Schema.Types.ObjectId,ref:'BLService'},
    OrderPayment:{type: mongoose.Schema.Types.ObjectId,ref:'BLPayment'},
});
      
 
      
module.exports = mongoose.model('BLServiceOrder', ServiceOrder);