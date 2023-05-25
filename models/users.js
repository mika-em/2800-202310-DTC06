const mongoose = require('mongoose');

// defines the user schema
const userSchema = new mongoose.Schema(
    {
        name: String,
        username: String,
        password: String,
        email: String,
        securityQuestion: String,
        securityAnswer: String,
        personaHistory: Array,
        dialogueHistory: Array,
        innerDialogueHistory: Array,
    userPersonaChatHistory: Array,
    PersonaPersonaChatHistory: Array,

        filter: {
            default: Boolean,
            status: Boolean,
            class: Boolean,
            drop: Boolean,
            race: Boolean,
        },
    },
    // this is the name of the collection in the database
    { collection: 'users' }
);

const usersModel = mongoose.model('User', userSchema);

// const dialogueModel = mongoose.model('Dialogue', dialogueSchema);

module.exports = usersModel
//     dialogueModel
// };

