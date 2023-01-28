const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvEdu = new Schema({ 

  CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
  EduStatus:{type:Number,default:1},
  EduTitle:{type:String,required:true},
  EduDesc:{type:String,required:true}, 
  EduAt:{type:String,required:true},
  // EduType:{type:String,required:true},
  EduFrom:{type:Date,required:true},
  EduTo:{type:Date,required:true},
  EduSort:{type:Number,default:0,required:true},
  EduSkill:[{type: mongoose.Schema.Types.ObjectId, ref: 'BLCVSkill'}]
});
    
 
      
module.exports = mongoose.model('BLCVEdu', CvEdu);