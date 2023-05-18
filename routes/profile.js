const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/users");
const bodyParser = require("body-parser");
let multer = require("multer");
const { usersModel } = require("../models/users");
const fs = require("fs");
const path = require("path");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Home page
router.get("/home", (req, res) => {
  res.render("home", {
    name: req.session.user.name,
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

// Profile picture upload
router.post("/uploadImage", upload.single("fileToUpload"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Error: No file selected");
  }

  try {
    const fileName = req.file.filename;
    const updatedUser = await usersModel.findOneAndUpdate(
      { username: req.session.user.username },
      {
        $set: {
          profilePicture: {
            fileName: fileName,
            contentType: req.file.mimetype,
          },
        },
      },
      { new: true }
    );
    console.log(updatedUser);
    res.redirect("/profile");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("An error occurred while uploading your profile picture.");
  }
});

// Profile page
router.get("/profile", async (req, res) => {
  try {
    const currentUser = await usersModel.findOne({
      username: req.session.user.username,
    });
    res.render("../views/profile/profile", { user: currentUser });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("An error occurred while retrieving your profile.");
  }
});

// Account settings page
router.get("/profile/account-settings", async (req, res) => {
  try {
    const currentUser = await User.findOne({
      username: req.session.user.username,
    });
    const name = currentUser.name;
    const username = currentUser.username;
    const email = currentUser.email;
    const securityQuestion = currentUser.securityQuestion;
    const securityAnswer = currentUser.securityAnswer;
    console.log(securityAnswer);
    res.render("../views/profile/accountSettings", {
      name: name,
      username: username,
      email: email,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      disabled: true,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send("An error occurred while retrieving your account settings.");
  }
});

// Update account settings
router.post("/profile/account-settings", async (req, res) => {
  if (req.body.action === "Edit") {
    console.log("edit");
    const currentUser = await User.findOne({
      username: req.session.user.username,
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
      disabled: false,
    });
  } else if (req.body.action === "Save") {
    console.log("save");
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const securityQuestionInput = req.body.securityQuestion;
    const hashedSecurityAnswer = await bcrypt.hashSync(
      req.body.securityAnswer,
      saltRounds
    );
    const securityAnswerInput = hashedSecurityAnswer;
    await User.updateOne(
      {
        username: req.session.user.username,
      },
      {
        $set: {
          name: nameInput,
          email: emailInput,
          securityQuestion: securityQuestionInput,
          securityAnswer: securityAnswerInput,
        },
      }
    );
    const currentUser = await User.findOne({
      username: req.session.user.username,
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
      disabled: true,
    });
  }
});

// Other profile-related routes...

module.exports = router;
