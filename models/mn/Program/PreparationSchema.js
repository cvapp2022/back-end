const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PreparationModel = new Schema({ 
    PrepareName: { type: String, required: true },
    PrepareMeet: { type: Number, required:true },
    prepareFolder: {type:String},
    PrepareAttachments:[{type:Object}]
})


module.exports = mongoose.model('MnProgramPrepartion', PreparationModel);

