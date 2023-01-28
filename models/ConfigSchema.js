const mongoose = require('mongoose'); 

//Define a schema 
const Schema = mongoose.Schema;

const BLConfigSchema = new Schema({ 

    ConfigName:{type:String,required:true},
    ConfigValue:{type:Number,required:true}, 
    ConfigSubValue:{type:String,required:true},
    ConfigDesc:{type:String,required:true},
});
      
 
      
module.exports = mongoose.model('BLConfig', BLConfigSchema);