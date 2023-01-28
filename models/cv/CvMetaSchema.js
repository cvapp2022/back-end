const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const CvModel = new Schema({ 
    CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
    MetaKey:{type:String,required:true},
    MetaValue:{type:String,required:true}, 
})


module.exports = mongoose.model('BLCVMeta', CvModel);