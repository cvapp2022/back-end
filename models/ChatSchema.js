const mongoose = require('mongoose'); 
//Define a schema 
const Schema = mongoose.Schema;

const ChatModel= new Schema({
    ChatUser:{ type: mongoose.Schema.Types.ObjectId, ref: 'BLUser', required: true },
    ChatMentor:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor'},
    ChatMessages:[{type: mongoose.Schema.Types.ObjectId, ref: 'ChMessage'}]
})

module.exports = mongoose.model('BLChat', ChatModel);