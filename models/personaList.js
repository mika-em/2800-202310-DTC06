const mongoose = require('mongoose');

// parameter collection schema
const personaSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: Date,
        persona: String,
    },
    // name of the collection in database
    { collection: 'personas' }
);


const personaModel = mongoose.model('Persona', personaSchema);

module.exports = personaModel;