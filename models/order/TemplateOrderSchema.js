const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const TemplateOrder = new Schema({ 

    OrderName:{type:String,required:true},
    OrderPaid:{type:Boolean,default:false}, 
    OrderUser:{type: mongoose.Schema.Types.ObjectId,ref:'BLUser'},
    OrderTemplate:{type: mongoose.Schema.Types.ObjectId,ref:'BLTemplate'},
    OrderPayment:{type: mongoose.Schema.Types.ObjectId,ref:'BLPayment'},
});
      
 
      
module.exports = mongoose.model('BLTemplateOrder', TemplateOrder);