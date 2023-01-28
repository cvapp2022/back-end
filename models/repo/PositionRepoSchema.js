const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const PositionRepo = new Schema({ 

  PositionName:{type:String,required:true},
  PositionDesc:{type:String,required:true},
  PositionUsedNum:{type:Number,default:0},
});
      
 
module.exports = mongoose.model('BLRepoPosition', PositionRepo);