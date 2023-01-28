const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MnMeetModel = new Schema({

    MeetName: { type: String, required: true },
    MeetId: { type: String, required: true },
    MeetDate:{type:Date},
    MeetStatus:{type:Boolean,default:0}, //0 ==!Done 1==Done
    MeetMentor:{ type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor' },
    MeetSession:[{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeetSession'}],
    MeetRates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnMeetRate' }],
    MeetRequest:{ type: mongoose.Schema.Types.ObjectId, ref: 'MnRequest' },
    MeetPrepare:{ type: mongoose.Schema.Types.ObjectId, ref: 'MnProgramPrepartion' }
});

module.exports = mongoose.model('MnMeet', MnMeetModel);





// name: String, // session name
// meetingid: String, // meeting id
// sessionid: String, // socket id