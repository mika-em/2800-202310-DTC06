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
        filter: {
            default: Boolean,
            status: Boolean,
            class: Boolean,
            drop: Boolean,
            race: Boolean,
        },
        profileImage:{
            data:req.file.buffer,
            contentType: req.file.mimetype,
        }
    },
    // this is the name of the collection in the database
    { collection: 'users' }
);

const usersModel = mongoose.model('User', userSchema);


app.post('/upload', upload.single('fileToUpload'), (req, res) => {
    const newUser = new usersModel({
        profileImage: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        }
    });
    newUser.save().then(() => {
        res.send('File uploaded successfully.');
    }).catch((e) => {
        console.log('Error saving user profile', error);
        res.status(400).send('Error saving user profile');
    });
});

// const dialogueModel = mongoose.model('Dialogue', dialogueSchema);

module.exports = usersModel
//     dialogueModel
// };

