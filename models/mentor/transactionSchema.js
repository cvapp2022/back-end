const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;


const transactionModel = new Schema({
    transactionType:{type:String,required:true},
    transactionValue:{type:Number,required:true},
    transactionDesc:{type:String,required:true},
    transactionMentor:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor'},
 },{ timestamps: true })


module.exports = mongoose.model('MentorTransaction', transactionModel);