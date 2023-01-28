const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const MnRequestModel = new Schema({ 
    ReqStatus:{type:Number,default:1},
    ReqState:{type:String,default:'payment'}, //payment,searching,applied,active
    ReqSource:{type:String,required:true},
    ReqType:{type:String,required:true},
    ReqProg:{type: mongoose.Schema.Types.ObjectId, ref: 'MnProgram'},
    ReqUser:{type: mongoose.Schema.Types.ObjectId, ref: 'BLUser'},
    ReqMeets:[{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeet'}],
    ReqDates:[{type:Object}],
    ReqMentor:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor'},
},{ timestamps: true },)



module.exports = mongoose.model('MnRequest', MnRequestModel);