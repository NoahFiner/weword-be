const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Story = new Schema({
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
    words: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Word',
        }
    ]
});
module.exports = mongoose.model('Story', Story);
