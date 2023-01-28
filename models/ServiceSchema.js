const mongoose = require('mongoose');
const ServiceChildModel=require('./service/ChildSchema')
//Define a schema 
const Schema = mongoose.Schema;

const ServiceModel = new Schema({

    ServName: { type: String, required: true },
    ServDesc: { type: String, required: true },
    ServPrice: { type: Number, required: true},
    ServStatus: { type: Number, default: 0 },
    ServImg: { type: String, default: process.env.ServRAM_THUMBNAIL_DEFAULT },
    ServFolder: { type: String, required: true },
    ServMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MnMentor' }],
    ServChilds: [{ type: mongoose.Schema.Types.ObjectId, ref:ServiceChildModel }]
});



module.exports = mongoose.model('BLService', ServiceModel);