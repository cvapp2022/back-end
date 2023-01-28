const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const SkillRepo = new Schema({ 

  SkillName:{type:String,required:true},
  SkillPositions:{type:Array,required:true},
  SkillDesc:{type:String,required:true},
  SkillUsedNum:{type:Number,default:0},
});
      
 
module.exports = mongoose.model('BLRepoSkill', SkillRepo);