const mongoose = require('mongoose');
const Schema = mongoose.Schema
const wordModel = new Schema({
    author: {
        type: String,
        default: "Guest"
    },
    word: {
        type: String,
        required: true,
        trim: true,
    },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    }
},
{
    timestamps: true
});
module.exports = mongoose.model('Word', wordModel);
