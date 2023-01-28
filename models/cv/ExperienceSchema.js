const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvExp = new Schema({ 

        CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
        ExpStatus:{type:Number,default:1},
        ExpTitle:{type:String,required:true},
        ExpDesc:{type:String,required:true}, 
        ExpJob:{type:String,required:true},
        ExpFrom:{type:Date,required:true},
        ExpTo:{type:Date,required:true},
        ExpSort:{type:Number,default:0,required:true},
        ExpSkill:[{type: mongoose.Schema.Types.ObjectId, ref: 'BLCVSkill'}]
      });
      
      
module.exports = mongoose.model('BLCVExp', CvExp);