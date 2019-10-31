const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Word = new Schema({
    author: {
        type: String,
        required: true,
    },
    contents: {
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
module.exports = mongoose.model('Word', Word);
