const mongoose = require('mongoose');
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
        profileImage: {
            data: Buffer,
            fileName: String,
            contentType: String,
        },
    },
    { collection: 'users' }
);

const usersModel = mongoose.model('User', userSchema);

module.exports = usersModel;


