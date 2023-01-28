const mongoose = require('mongoose'); 
//Define a schema 
const Schema = mongoose.Schema;

const ChatModel= new Schema({
    ChMessageType:{type: String},
    ChMessageVal:{type: String},
    ChMessageFrom:{type: String},
    ChMessageSender:{ type: mongoose.Schema.Types.ObjectId, refPath: 'externalModelType',required:true},
    ChMessageChat:{type: mongoose.Schema.Types.ObjectId, ref: 'BLChat'},
    externalModelType:{type: String},
},{ timestamps: true },)

module.exports = mongoose.model('ChMessage', ChatModel);