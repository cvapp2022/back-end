const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const CvSContact = new Schema({ 

        CVId: {type: mongoose.Schema.Types.ObjectId, ref: 'BLCV'},
        CKey:{type:String,required:true},
        CValue:{type:String},
      });
      
module.exports = mongoose.model('BLCVContact', CvSContact);