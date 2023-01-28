const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const TemplateOrder = new Schema({ 

    RequestFrom:{type:String,required:true},
    RequestState:{type:String,default:false},
    RequestPNumber:{type:String,required:true},
    RequestOpNumber:{type:String,required:true},
    RequestOrder:{type: mongoose.Schema.Types.ObjectId,refPath: 'externalModelType'},
    externalModelType:{type: String},
    //RequestOrder:{type: mongoose.Schema.Types.ObjectId,ref:'BLCVTemplate'},
    //RequestUser:{type: mongoose.Schema.Types.ObjectId,ref:'BLCVUser'},
    //RequestPayment:{type: mongoose.Schema.Types.ObjectId,ref:'BLPayment'},
});
      
 
      
module.exports = mongoose.model('BLPaymentRequest', TemplateOrder);