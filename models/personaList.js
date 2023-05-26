const mongoose = require('mongoose');
const personaSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: Date,
        persona: String,
    },
    { collection: 'personas' }
);


const personaModel = mongoose.model('Persona', personaSchema);

module.exports = personaModel;