import mongoose from "mongoose";
const { Schema } = mongoose

const CommentSchema = new Schema({

    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ,
    username: {
        type: String,
        required: false
    },
    postid: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Comments = mongoose.model("comments", CommentSchema); // Define Blog model

export default Comments;