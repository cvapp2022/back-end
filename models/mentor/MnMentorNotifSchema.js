const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

// CVUserId:{type:mongoose.Schema.Types.ObjectId, ref: 'BLCVUser'},

const MentorNotifModel = new Schema({ 
    NotifSeen:{type:Boolean,default:false},
    NotifAction:{type:String,required:true},
    NotifMessage:{type:String,required:true},
    NotifValues:{type:Object,default:{}},
    NotifMentor:{type:mongoose.Schema.Types.ObjectId, ref: 'MnMentor'},
},{ timestamps: true })

module.exports = mongoose.model('MnMentorNotif', MentorNotifModel);

