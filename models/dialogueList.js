const mongoose = require('mongoose');
const dialogueSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: Date,
        dialogue: String,
    },
    { collection: 'dialogue' }
);

const dialogueModel = mongoose.model('Dialogue', dialogueSchema);
module.exports = dialogueModel;