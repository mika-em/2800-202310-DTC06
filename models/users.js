const mongoose = require('mongoose');

// users collection schema
const userSchema = new mongoose.Schema(
    {
        name: String,
        username: String,
        password: String,
        email: String,
        securityQuestion: String,
        securityAnswer: String,
        personaHistory: Array,
        promptParameters: Array,
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
    //this is the name of the collection in the database
    { collection: 'users' }
);




const usersModel = mongoose.model('User', userSchema);

module.exports = usersModel;
