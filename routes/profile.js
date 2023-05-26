const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/users");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });


router.post("/upload", upload.single('fileToUpload'), async (req, res) => {
  try {
    const user = await User.findOne({ user: req.session.username });

    if (user) {
      const profileImage = {
        data: req.file.buffer,
        fileName: req.file.originalname,
        contentType: req.file.mimetype
      };

      user.profileImage = profileImage;

      res.render("../views/profile/profile", {
        name: req.session.user.name,
        profileImage: profileImage,
      });

    } else {
      // Handle case where user is not found
      res.status(404).send("User not found.");
    }
  } catch (error) {
    // Handle error if database update fails
    console.error(error);
    res.status(500).send("Error occurred while updating the profile image.");
  }
});

// Profile page
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findOne({ user: req.session.username });

    if (user) {
      res.render("../views/profile/profile", {
        name: user.name,
        profileImage: user.profileImage,
      });
    } else {
      // Handle case where user is not found
      res.status(404).send("User not found.");
    }
  } catch (error) {
    // Handle error if database query fails
    console.error(error);
    res.status(500).send("Error occurred while fetching user data.");
  }
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
  res.render("./profile/accountSettings", {
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
    const currentUser = await User.findOne({
      username: req.session.user.username
    });
    const name = currentUser.name;
    const username = currentUser.username;
    const email = currentUser.email;
    const securityQuestion = currentUser.securityQuestion;
    const securityAnswer = currentUser.securityAnswer;
    res.render("./profile/accountSettings", {
      name: name,
      username: username,
      email: email,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      disabled: false
    });
  } else if (req.body.action === "Save") {
    const nameInput = req.body.name;
    const emailInput = req.body.email;
    const securityQuestionInput = req.body.securityQuestion;
    const hashedSecurityAnswer = await bcrypt.hashSync(req.body.securityAnswer, saltRounds);
    const securityAnswerInput = hashedSecurityAnswer;
    await User.updateOne({
      username: req.session.user.username
    }, {
      $set: {
        name: nameInput,
        email: emailInput,
        securityQuestion: securityQuestionInput,
        securityAnswer: securityAnswerInput
      }
    });
    const currentUser = await User.findOne({
      username: req.session.user.username
    });
    const name = currentUser.name;
    const username = currentUser.username;
    const email = currentUser.email;
    const securityQuestion = currentUser.securityQuestion;
    const securityAnswer = currentUser.securityAnswer;
    res.render("./profile/accountSettings", {
      name: name,
      username: username,
      email: email,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      disabled: true
    });
  }
});

module.exports = router;