const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Persona = require("../models/personaList");
const pdfkit = require("pdfkit");
const Dialogue = require("../models/dialogueList");

router.get("/saved", (req, res) => {
  res.render("../views/saved/saved");
});

router.get("/filters", (req, res) => {
  res.render("../views/saved/filters");
});

// saved personas
router.get("/saved/persona", async (req, res) => {
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const userID = currentUser._id;

  const savedPersona = await Persona.find({
    userId: userID,
  });

  res.render("./saved/saved-persona", {
    savedPersona: savedPersona,
  });
});

let personaServerList = [];

router.use("/persona", async (req, res, next) => {
  req.session.personaServerList = personaServerList;
  next();
});

router.post("/persona/saved-persona/delete-persona", async (req, res) => {
  const personaIDList = req.body.personaIDList;
  const parsedPersonaIDList = JSON.parse(personaIDList);

  for (let i = 0; i < parsedPersonaIDList.length; i++) {
    await Persona.deleteOne({
      _id: parsedPersonaIDList[i],
    });
  }

  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const userID = currentUser._id;

  const savedPersona = await Persona.find({
    userId: userID,
  });

  res.render("./saved/saved-persona", {
    savedPersona: savedPersona,
  });
});


router.post("/persona/saved-dialogue/delete-dialogue", async (req, res) => {
  const dialogueIDList = req.body.dialogueIDList;
  const parsedDialogueIDList = JSON.parse(dialogueIDList);

  for (let i = 0; i < parsedDialogueIDList.length; i++) {
    await Dialogue.deleteOne({
      _id: parsedDialogueIDList[i],
    });
  }

  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const userID = currentUser._id;

  const savedDialogue = await Dialogue.find({
    userId: userID,
  });

  res.render("./saved/saved-dialogue", {
    savedDialogue: savedDialogue,
  });
});


router.post("/persona/saved-persona/dialogue-filters", (req, res) => {
  const personaList = req.body.personaList;
  const parsedPersonaList = JSON.parse(personaList);

  for (let i = 0; i < parsedPersonaList.length; i++) {
    personaServerList.push(parsedPersonaList[i]);
  }

  req.session.personaServerList = personaServerList;

  res.render("./fromSavedPersona/savedPersonaDialogueFilters", {
    output: null,
  });
});

router.post("/saved/persona/save-as-pdf", async (req, res) => {
  // Encode the personaList to handle special characters
  const personaList = req.body.personaList;
  const convertedPersonaList = JSON.parse(personaList);

  // instantiate the library
  let doc = new pdfkit();

  // set font style
  doc.font("Courier");

  // Create an array to store the PDF chunks
  const buffers = [];
  // Create a unique filename for the user
  const filename = `your-personas-${Date.now()}.pdf`;

  // Set the response headers for downloading the PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  // Pipe the PDF stream directly to the response
  doc.pipe(res);

  const imageWidth = 450;
  const imageHeight = (imageWidth * 300) / 2000;

  doc.image("./public/images/invsona/invsona-banner-white.png", {
    fit: [imageWidth, imageHeight],
    align: "center",
    valign: "top",
  });
  doc.moveDown();
  doc.moveDown();

  doc.text("Your Personas by Invsona", {
    underline: true,
    align: "center",
  });
  doc.moveDown();
  doc.moveDown();

  for (let i = 0; i < convertedPersonaList.length; i++) {
    doc.text("Persona " + (i + 1), {
      oblique: true,
      align: "center",
    });
    doc.text(convertedPersonaList[i]);
    doc.moveDown();
    doc.moveDown();
  }

  // Capture the output as buffers
  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {
    // Concatenate the buffers into a single buffer
    const pdfBuffer = Buffer.concat(buffers);

    // Send the PDF buffer as the response
    res.end(pdfBuffer);
  });

  // End the document
  doc.end();

  // render the page
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const userID = currentUser._id;

  const savedPersona = await Persona.find({
    userId: userID,
  });

  res.render("./saved/saved-persona", {
    savedPersona: savedPersona,
  });
});

router.post("/saved/dialogue/save-as-pdf", async (req, res) => {
  // Encode the personaList to handle special characters
  const dialogueList = req.body.dialogueList;
  const convertedDialogueList = JSON.parse(dialogueList);

  // instantiate the library
  let doc = new pdfkit();

  // set font style
  doc.font("Courier");

  // Create an array to store the PDF chunks
  const buffers = [];
  // Create a unique filename for the user
  const filename = `your-dialogues-${Date.now()}.pdf`;

  // Set the response headers for downloading the PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  // Pipe the PDF stream directly to the response
  doc.pipe(res);

  const imageWidth = 450;
  const imageHeight = (imageWidth * 300) / 2000;

  doc.image("./public/images/invsona/invsona-banner-white.png", {
    fit: [imageWidth, imageHeight],
    align: "center",
    valign: "top",
  });

  doc.moveDown();
  doc.moveDown();

  doc.text("Your Dialogues by Invsona", {
    underline: true,
    align: "center",
  });
  doc.moveDown();
  doc.moveDown();

  for (let i = 0; i < convertedDialogueList.length; i++) {
    doc.text("Dialogue " + (i + 1), {
      oblique: true,
      align: "center",
    });
    doc.text(convertedDialogueList[i]);
    doc.moveDown();
    doc.moveDown();
  }

  // Capture the output as buffers
  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {
    // Concatenate the buffers into a single buffer
    const pdfBuffer = Buffer.concat(buffers);

    // Send the PDF buffer as the response
    res.end(pdfBuffer);
  });

  // End the document
  doc.end();

  // render the page
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const userID = currentUser._id;

  const savedDialogue = await Dialogue.find({
    userId: userID,
  });

  res.render("./saved/saved-dialogue", {
    savedDialogue: savedDialogue,
  });
});

//saved dialogue
router.get("/saved/saved-dialogue", async (req, res) => {
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const userID = currentUser._id;
  const savedDialogue = await Dialogue.find({
    userId: userID,
  });
  res.render("./saved/saved-dialogue", {
    savedDialogue: savedDialogue,
  });
});

module.exports = router;
