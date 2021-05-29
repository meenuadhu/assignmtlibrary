const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({

    userID1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title1: {
        type: String,
        required: true
    },
    body1: {
        type: String,
        required: true
    },
    image1: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }

}, { timestamps: true })

const Authors = mongoose.model("author", PostSchema)
module.exports = Authors;