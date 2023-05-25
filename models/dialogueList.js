const mongoose = require('mongoose');

// parameter collection schema
const dialogueSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: Date,
        persona: String,
    },
    // name of the collection in database
    { collection: 'dialogue' }
);


const dialogueModel = mongoose.model('Dialogue', dialogueSchema)

module.exports = dialogueModel;