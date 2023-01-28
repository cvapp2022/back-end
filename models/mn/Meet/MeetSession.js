const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionSessionModel = new Schema({
    SessionId:{ type: String, required: true },
    SessionFolder:{ type: String, required: true },
    SessionMeet:{type: mongoose.Schema.Types.ObjectId, ref: 'MnMeet'},
    SessionEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnSessionEvent' }],
    SessionAttachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnSessionAttachment' }],
    SessionMessage:[{ type: mongoose.Schema.Types.ObjectId, ref: 'MnSessionMessage' }],
    SessionPeers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'SessionPeer' }],
    isActive:{type:Boolean,default:true}
});


module.exports = mongoose.model('MnMeetSession', SessionSessionModel);