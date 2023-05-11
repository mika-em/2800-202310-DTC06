const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    filter: {
        default: Boolean,
        status: Boolean,
        class: Boolean,
        drop: Boolean,
        race: Boolean,
    }
},
{collection: 'users'}); //this is the name of the collection in the database


const usersModel = mongoose.model('User', userSchema);

module.exports = usersModel;