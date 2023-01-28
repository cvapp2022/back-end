const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

const BlogPost = new Schema({

    PostTitle: { type: String, required: true },
    PostCategory: {type:mongoose.Schema.Types.ObjectId, ref: 'BlogCategory'},
    PostChild:[{type:mongoose.Schema.Types.ObjectId, ref: 'BlogChildPost'}]
    
}, {
    timestamps: true
});



module.exports = mongoose.model('BlogPost', BlogPost);