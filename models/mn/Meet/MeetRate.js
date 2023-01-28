const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RateModel = new Schema({
    RateSelection1:{ type: String, required: true },
    RateSelection2:{ type: String, required: true },
    RateDesc:{type: String, required: true },
    RateMeet:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeet'},
});


module.exports = mongoose.model('MnMeetRate', RateModel);