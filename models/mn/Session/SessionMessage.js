const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionMessagenModel = new Schema({
    MessageSender:{ type: String, required: true },
    MessageUser:{type: mongoose.Schema.Types.ObjectId, ref: 'BLCVUser'},
    MessageMentor:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor'},
    MessageSession:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeetSession'},
    MessageValue:{type: String, required: true}
});


module.exports = mongoose.model('MnSessionMessage', SessionMessagenModel);