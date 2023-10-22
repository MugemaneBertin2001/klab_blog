import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required:true
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference the 'users' model for comment author
        required: true,
    },
});

export const Comment = mongoose.model('comments', commentSchema);