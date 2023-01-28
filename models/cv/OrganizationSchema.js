const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvOrg = new Schema({ 

        CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
        OrgStatus:{type:Number,default:1},
        OrgTitle:{type:String,required:true},
        OrgDesc:{type:String,required:true}, 
        OrgJob:{type:String,required:true},
        OrgFrom:{type:Date,required:true},
        OrgTo:{type:Date,required:true},
        OrgSort:{type:Number,default:0,required:true},
        
      });
      
      
module.exports = mongoose.model('BLCVOrg', CvOrg);