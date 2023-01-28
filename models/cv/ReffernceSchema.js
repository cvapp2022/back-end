const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvRef = new Schema({ 

  CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
  RefStatus:{type:Number,default:1},
  RefName:{type:String,required:true},
  RefJob:{type:String,required:true}, 
  RefMail:{type:String,required:true},
  RefPhone:{type:String,required:true},
  RefAt:{type:String,required:true},
  RefSort:{type:Number,default:0,required:true}
});
       

module.exports = mongoose.model('BLCVRef', CvRef);