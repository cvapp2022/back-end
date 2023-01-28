const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

const BlogPost = new Schema({

    CategoryTitle: { type: String, required: true },
    CategoryDesc: { type: String, required: true },
    CategoryStatus: { type: Number, default: 1 },
    CategoryThumb: { type: String, default:'catThumb',},
});



module.exports = mongoose.model('BlogCategory', BlogPost);