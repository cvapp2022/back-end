const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvTemplate = new Schema({ 

  TemplateName:{type:String,required:true},
  TemplateThumb:{type:String,default:process.env.TEMPLATE_THUMBNAIL_DEFAULT},
  TemplateDesc:{type:String,required:true}, 
  TemplateStatus:{type:Number,default:1},
  TemplateFor:{type:String,required:true}, // cv ,cl
  TemplatePrice:{type:Number,required:true,default:0},
  isPaid:{type:Boolean,default:false},
});
      
 
      
module.exports = mongoose.model('BLTemplate', CvTemplate);