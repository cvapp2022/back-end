const mongoose = require('mongoose');

//Define a schema 
const Schema = mongoose.Schema;

const BlogPost = new Schema({

    PostTitle: { type: String, required: true },
    PostDesc: { type: String, required: true },
    PostThumb:{ type: String,default:process.env.POST_THUMBNAIL_DEFAULT},
    PostFolder:{ type: String, required: true },
    PostLang: { type: String, required: true, default: 'en' },
    PostStatus: { type: Number, default: 1 },
    PostState: { type: String, default: 'draft' }, // draft ,published
    PostBody:{ type: String, required: true },
    PostParent:{type:mongoose.Schema.Types.ObjectId, ref: 'BlogPost'}
});



module.exports = mongoose.model('BlogChildPost', BlogPost);