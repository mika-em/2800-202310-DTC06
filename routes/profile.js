const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/users");
const bodyParser = require('body-parser');
let multer = require('multer');
const usersModel = require("../models/users");
const fs = require('fs');
const path =require('path');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());


// Home page
router.get("/home", (req, res) => {
    res.render("home", {
        name: req.session.user.name,
    });
});



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({storage: storage});




// Profile picture upload
router.post('/uploadImage', upload.single('fileToUpload'), (req, res) => {
    if(!req.file) {
        return res.status(400).send('Error: No file selected');
    }
    
    // Read the image file
    usersModel.findOneAndUpdate(
        {username: req.session.user.username},
        {$set: {profilePicture: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png' //req.file.mimetype
        }}},
    );
        redirect('/profile');
    }
);


// Profile page
router.get("/profile", (req, res) => {
    usersModel.find({}).then((data, err) => {
        if (err){ 
            console.log(err);
            return res.status(500).send("An error occurred while retrieving your profile.");
        }
    res.render("../views/profile/profile", {data});
    });
});





//    let data = new usersModel(obj);
//     data.save();
   // res.redirect('/profile');






// Profile page
router.get("/profile", (req, res) => {
    res.render("../views/profile/profile", {
        name: req.session.user.name,
    });
});

// Account settings page
router.get("/profile/account-settings", async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const name = currentUser.name;
    const username = currentUser.username;
    const email = currentUser.email;
    const securityQuestion = currentUser.securityQuestion;
    const securityAnswer = currentUser.securityAnswer;
    console.log(securityAnswer)
    res.render("../views/profile/accountSettings", {
        name: name,
        username: username,
        email: email,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        disabled: true
    });
});

// Update account settings
router.post("/profile/account-settings", async (req, res) => {
    if (req.body.action === "Edit") {
        console.log("edit")
        const currentUser = await User.findOne({
            username: req.session.user.username
        });
        const name = currentUser.name;
        const username = currentUser.username;
        const email = currentUser.email;
        const securityQuestion = currentUser.securityQuestion;
        const securityAnswer = currentUser.securityAnswer;
        res.render("accountSettings", {
            name: name,
            username: username,
            email: email,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer,
            disabled: false
        });
    } else if (req.body.action === "Save") {
        console.log("save")
        const nameInput = req.body.name
        const emailInput = req.body.email
        const securityQuestionInput = req.body.securityQuestion
        const hashedSecurityAnswer = await bcrypt.hashSync(req.body.securityAnswer, saltRounds);
        const securityAnswerInput = hashedSecurityAnswer
        await User.updateOne({
            username: req.session.user.username
        }, {
            $set: {
                name: nameInput,
                email: emailInput,
                securityQuestion: securityQuestionInput,
                securityAnswer: securityAnswerInput
            }
        })
        const currentUser = await User.findOne({
            username: req.session.user.username
        });
        const name = currentUser.name;
        const username = currentUser.username;
        const email = currentUser.email;
        const securityQuestion = currentUser.securityQuestion;
        const securityAnswer = currentUser.securityAnswer;
        res.render("../views/profile/accountSettings", {
            name: name,
            username: username,
            email: email,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer,
            disabled: true
        });
    }
});

// Other profile-related routes...

module.exports = router;