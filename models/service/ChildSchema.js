const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChildSchema = new Schema({ 
    ChildName: { type: String, required: true },
    ChildDesc: { type: String, required:true },
    ChildLang: {type:String,required:true},
    ChildService:{type: mongoose.Schema.Types.ObjectId, ref: 'BLService'}
})


module.exports = mongoose.model('SrServiceChild', ChildSchema);

