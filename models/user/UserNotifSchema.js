const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

// CVUserId:{type:mongoose.Schema.Types.ObjectId, ref: 'BLCVUser'},

const UserNotifModel = new Schema({ 
    NotifSeen:{type:Boolean,default:false},
    NotifAction:{type:String,required:true},
    NotifMessage:{type:String,required:true},
    NotifValues:{type:Object,default:{}},
    NotifUser:{type:mongoose.Schema.Types.ObjectId, ref: 'BLCVUser'},
},{ timestamps: true })

module.exports = mongoose.model('BLUserNotif', UserNotifModel);

