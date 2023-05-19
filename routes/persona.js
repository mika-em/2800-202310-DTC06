const express = require("express");
const router = express.Router();


router.get('/persona', (req, res) => {
    res.render("./persona/persona");
});

router.get('/persona/general-prompt', (req, res) => {
    console.log(chatPrompt)
    res.render("./persona/generalPrompt");
});

router.post('/persona/general-prompt', (req, res) => {
    const name = req.body.name || "random";
    const age = req.body.age || "random";
    const gender = req.body.gender || "random";
    const situation = req.body.plot || "random";
    const plot = req.body.plot || "random";

    const message = `Generate a ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting where they are faced with ${situation}.`;
    chatPrompt.push("You: " + message);
    chatPrompt.push("hello");
    console.log(chatPrompt)

    // placeholder for db for chatPrompt/chatHistory
    res.redirect('/persona/chat');
});

router.get('/persona/saved-prompt', (req, res) => {
    res.render("./persona/savedPrompt");
});

router.get('/persona/new-prompt', (req, res) => {
    res.render("./persona/newPrompt");
});

router.post('/persona/new-prompt', (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    const parameter = req.body.parameter;
    savedPromptParameter.push(parameter);
    console.log(savedPromptParameter);
    res.render("./persona/newPrompt");
});

router.get('/persona/chat', (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    console.log(chatPrompt);
    res.render("chat");
});

router.post('/persona/chat', (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    const message = req.body.message;
    chatPrompt.push("You: " + message);
    console.log(chatPrompt);
    res.render("chat");
});

var chatPrompt = ["test"];
var savedPromptParameter = ["hello", "world", "test"];

module.exports = router;