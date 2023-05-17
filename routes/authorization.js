//this page contains the routes for 
// index, home, signup, login, logout, and password rest

const express = require("express");
const router = express.Router();
const User = require("../models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const expireTime = 1000 * 60 * 60 * 24 * 7; // 1 week

// Index page
router.get("/", (req, res) => {
    res.render("index");
});

// Signup page
router.get("/signup", (req, res) => {
    res.render("../views/authorization/signup");
});

// Signup route
router.post("/signup", async (req, res) => {
    const {
        name,
        username,
        email,
        password,
        securityQuestion,
        securityAnswer,
    } = req.body;

    const hashedPassword = await bcrypt.hashSync(password, saltRounds);

    try {
        await User.create({
            name: name,
            username: username,
            email: email,
            password: hashedPassword,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer,
        });
        console.log("User created");
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while creating your account.");
    }
});

// Login page
router.get("/login", (req, res) => {
    res.render("../views/authorization/login");
});

// Login route
router.post("/loginUser", async (req, res) => {
    const {
        loginName,
        password,
    } = req.body;
    console.log(loginName, password)

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginName);

    const queryField = isEmail ? "email" : "username";

    console.log(`isEmail: ${isEmail}, queryField: ${queryField}`);

    const user = await User.findOne({
        [queryField]: loginName
    }).select('name username email password _id').exec();
    console.log(user);

    if (!user) {
        return res.status(400).send("Invalid email/username or password.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
        req.session.authenticated = true;
        req.session.cookie.maxAge = expireTime;
        req.session.user = {
            name: user.name,
            username: user.username,
            email: user.email,
            password: user.password,
            securityQuestion: user.securityQuestion,
            securityAnswer: user.securityAnswer
        };

        console.log(req.session.user.name)

        return res.render("home", {
            name: req.session.user.name,

        })
    } else {
        return res.status(400).send("Invalid email/username or password.");
    }
});

// Logout route
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.render("../views/authorization/logout");
});
  
router.post("/exit", (req, res) => {
    res.redirect("/");
});

// Reset password page
router.get("/resetPassword", (req, res) => {
    res.render("../views/authorization/resetPassword", {
        email: "",
        securityQuestion: "",
        securityAnswer: "",
        password: "",
        disabled: true,
    });
});

// Reset password route
router.post("/resetPassword", async (req, res) => {
    try {
        console.log(req.body.email)
        userReset = await User.findOne({
            email: req.body.email
        })
        console.log(userReset)
        res.render('resetPassword', {
            email: req.body.email,
            securityQuestion: userReset.securityQuestion,
            securityAnswer: "",
            password: "",
            disabled: true,
        })
    } catch (error) {
        return res.status(400).send("Invalid email.");
    }
});

router.post('/resetPassword/verified', async (req, res) => {
    userReset = await User.findOne({
        email: req.body.email
    })
    const securityAnswer = userReset.securityAnswer
    console.log(securityAnswer)
    if (securityAnswer === req.body.securityAnswer) {
        res.render('resetPassword', {
            email: req.body.email,
            securityQuestion: userReset.securityQuestion,
            securityAnswer: userReset.securityAnswer,
            password: "",
            disabled: false,
        })
    } else {
        res.send("Incorrect answer to security question.");
    }
});

router.post('/', async (req, res) => {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    try {
        await User.updateOne({
            email: req.body.email
        }, {
            $set: {
                password: hashedPassword,
            }
        })
        res.render('index')
    } catch (error) {
        res.status(500).send("An error occurred while creating your account.");
    }
});

//home page
router.get("/home", (req, res) => {
    res.render("home", {
        name: req.session.user.name,
    });
});

module.exports = router;