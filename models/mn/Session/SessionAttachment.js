const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionAttachmentnModel = new Schema({
    AttachmentName:{ type: String, required: true },
    AttachmentFileId:{ type: String, required: true },
    AttachmentSession:{ type: mongoose.Schema.Types.ObjectId, ref: 'MnMeetSession' }
});


module.exports = mongoose.model('MnSessionAttachment', SessionAttachmentnModel);