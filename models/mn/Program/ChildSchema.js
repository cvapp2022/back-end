const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChildModel = new Schema({ 
    ChildName: { type: String, required: true },
    ChildDesc: { type: String, required:true },
    ChildLang: {type:String,required:true},
    ChildProgram:{type: mongoose.Schema.Types.ObjectId, ref: 'MnProgram'}
})


module.exports = mongoose.model('MnProgramChild', ChildModel);

