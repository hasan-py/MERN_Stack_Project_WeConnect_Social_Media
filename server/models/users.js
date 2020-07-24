const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: "user.png"
    },
    followers: [{ type: ObjectId, ref: "users" }],
    following: [{ type: ObjectId, ref: "users" }],
    date: {
        type: Date,
        default: Date.now()
    }
})

const userModel = mongoose.model('users', userSchema)
module.exports = userModel;