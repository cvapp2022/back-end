const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;


const withdrawRequestModel = new Schema({
    withdrawReqStatus:{type:Number,default:0},
    withdrawReqMethod:{type:String,required:true},
    withdrawReqTarget:{type:String,required:true},
    withdrawReqValue:{type:Number,required:true},
    withdrawReqMentor:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor'},
 },{ timestamps: true })


module.exports = mongoose.model('MentorWithdrawRequest', withdrawRequestModel);