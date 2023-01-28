const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvAw = new Schema({ 

        CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
        AwStatus:{type:Number,default:1},
        AwTitle:{type:String,required:true},
        AwDesc:{type:String,required:true}, 
        AwJob:{type:String,required:true},
        AwDate:{type:Date,required:true},
        AwSort:{type:Number,default:0,required:true},
      });
      

      
module.exports = mongoose.model('BLCVAw', CvAw);