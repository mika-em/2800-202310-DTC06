const mongoose = require('mongoose');

//defines the user schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    securityQuestion: String,
    securityAnswer: String,
    personaHistory: Array,
    filter: {
        default: Boolean,
        status: Boolean,
        class: Boolean,
        drop: Boolean,
        race: Boolean,
    },
    securityQuestion: String,
    securityAnswer: String,
},
    { collection: 'users' }); //this is the name of the collection in the database

// defines the dialouge schema
const dialogueSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dialogue: {
        type: String,
        required: true
    },
    });

const usersModel = mongoose.model('User', userSchema);

const dialogueModel = mongoose.model('Dialogue', dialogueSchema);

module.exports = {
    usersModel,
    dialogueModel
};

