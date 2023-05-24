const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/users");
const multer = require("multer");
const { profile } = require("console");

const upload = multer({storage: multer.memoryStorage()})


router.post("/upload", upload.single('fileToUpload'), async (req, res) => {

    const result = await User.create({
        profileImage:
        {
            data: req.file.buffer,
            fileName: req.file.originalname,
            contentType: req.file.mimetype
        }
    });

    console.log(req.session.user.name);
    console.log(req.session.user.profileImage);

    res.render("../views/profile/profile", {
        name: req.session.user.name,
        profileImage: result.profileImage
    });
    
    // res.send(`<img src="data:${result.profileImage.contentType};base64,${result.profileImage.data.toString('base64')}">`)
})



// Home page
router.get("/home", (req, res) => {

    res.render("home", {
      name: req.session.user.name,
      profileImage: req.session.user.profileImage,
    });
  });

// Profile page
router.get("/profile", (req, res) => {
    res.render("../views/profile/profile", {
        name: req.session.user.name,
        profileImage: req.session.user.profileImage,
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