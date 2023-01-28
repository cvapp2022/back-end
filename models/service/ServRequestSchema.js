const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const ServRequestSchema = new Schema({ 
    ReqStatus:{type:Number,default:1},
    ReqState:{type:String,default:'searching'}, //payment,searching,applied,active
    ReqServ:{type: mongoose.Schema.Types.ObjectId, ref: 'BLService'},
    ReqUser:{type: mongoose.Schema.Types.ObjectId, ref: 'BLUser'},
    ReqChat:{type: mongoose.Schema.Types.ObjectId, ref: 'BLChat'},
    ReqCv:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLCV'}],
    ReqCl:[{type:mongoose.Schema.Types.ObjectId, ref: 'BLCL'}],
    ReqMentor:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor'},
},{ timestamps: true },)



module.exports = mongoose.model('SrServRequest', ServRequestSchema);