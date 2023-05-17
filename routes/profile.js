const express = require("express");
const router = express.Router();
const User = require("../models/users");

// Home page
router.get("/home", (req, res) => {
    res.render("home", {
        name: req.session.user.name,
    });
});

// Profile page
router.get("/profile", (req, res) => {
    res.render("profile", {
        name: req.session.user.name,
    });
});

// Account settings page
router.get("/profile/account-setting", async (req, res) => {
    const currentUser = await User.findOne({
        username: "mika"
    });
    const name = currentUser.name;
    const username = currentUser.username;
    const email = currentUser.email;
    const securityQuestion = currentUser.securityQuestion;
    const securityAnswer = currentUser.securityAnswer;
    console.log(securityAnswer)
    res.render("accountsetting", {
        name: name,
        username: username,
        email: email,
        securityQuestion: securityQuestion,
        securityAnswer: securityAnswer,
        disabled: true
    });
});

// Update account settings
router.post("/profile/account-setting", async (req, res) => {
    const usernameInput = "mika"
    if (req.body.action === "Edit") {
        console.log("edit")
        console.log(usernameInput)
        const currentUser = await User.findOne({
            username: usernameInput
        });
        const name = currentUser.name;
        const username = currentUser.username;
        const email = currentUser.email;
        const securityQuestion = currentUser.securityQuestion;
        const securityAnswer = currentUser.securityAnswer;
        res.render("accountsetting", {
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
        const securityAnswerInput = req.body.securityAnswer
        console.log(nameInput)
        console.log(usernameInput)
        await User.updateOne({
            username: usernameInput
        }, {
            $set: {
                name: nameInput,
                email: emailInput,
                securityQuestion: securityQuestionInput,
                securityAnswer: securityAnswerInput
            }
        })
        const currentUser = await User.findOne({
            username: usernameInput
        });
        const name = currentUser.name;
        const username = currentUser.username;
        const email = currentUser.email;
        const securityQuestion = currentUser.securityQuestion;
        const securityAnswer = currentUser.securityAnswer;
        res.render("accountsetting", {
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