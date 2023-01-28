const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvProj = new Schema({ 

  CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
  ProjStatus:{type:Number,default:1},
  ProjName:{type:String,required:true},
  ProjDesc:{type:String,required:true},
  ProjJob:{type:String}, 
  ProjUrl:{type:String},
  ProjSort:{type:Number,default:0,required:true},
  ProjImage:{type:String,default:'default proj image'},
  ProjDate:{type:Date,required:true},
  ProjSkill:[{type: mongoose.Schema.Types.ObjectId, ref: 'BLCVSkill'}]
});


      
module.exports = mongoose.model('BLCVProj', CvProj);