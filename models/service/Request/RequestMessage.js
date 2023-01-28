const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ServRequestMessage = new Schema({
    MessageSender:{ type: String, required: true },
    MessageSenderId:{type: mongoose.Schema.Types.ObjectId, refPath: 'externalModelType'},
    externalModelType:{type: String},
    MessageRequest:{type: mongoose.Schema.Types.ObjectId, ref: 'SrServRequest'},
    MessageValue:{type: String, required: true}
},
{
    timestamps: true
});


module.exports = mongoose.model('SrServRequestMessage', ServRequestMessage);