const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {baseErrorJSON} = require('../helpers/wordErrors');

const storyModel = new Schema({
    // rules: {
    //     type: Object
    // },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    length: {
        type: Number,
        default: 0,
    },
    rules: {
        type: Object,
        default: baseErrorJSON,
    },
    words: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Word',
        }
    ]
}, {
    timestamps: true
});
module.exports = mongoose.model('Story', storyModel);
