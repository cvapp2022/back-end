const mongoose = require('mongoose'); 
//Define a schema 
const Schema = mongoose.Schema;

const ClModel= new Schema({
    CLName:{type:String,required:true},
    CLUId:{type:mongoose.Schema.Types.ObjectId, ref: 'BLCVUser',required:true},
    CLFullName:{type:String,default:''},
    CLJob:{type:String,default:''},
    CLAddress:{type:String,default:''},
    CLMail:{type:String,default:''},
    CLPhone:{type:String,default:''},
    CLCmpName:{type:String,default:''},
    CLCmpHrName:{type:String,default:''},
    CLTemplate: { type: mongoose.Schema.Types.ObjectId, ref: 'BLCVTemplate', required: true, },
    CLBody:{type:String,default:''},
})

module.exports = mongoose.model('BLCL', ClModel);