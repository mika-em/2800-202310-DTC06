const express = require("express");
const router = express.Router();

router.get('/dialogue', (req, res) => {
    res.render("dialogue");
});

router.get('/dialogue/new', (req, res) => {
    res.render("startNewDialogue");
});

router.post('/dialogue/new', (req, res) => {
});

router.get('/dialogue/saved', (req, res) => {
    res.render("savedDialogue");
});

router.post('/dialogue/saved', (req, res) => {
});

//saved persona and new persona

router.get('/dialogue/pick-a-theme', (req, res) => {
    res.render("pickATheme");
});

router.post('/dialogue/pick-a-theme', (req, res) => {
    const theme = req.body.theme;
    console.log(theme);
    res.render("pickATheme");
});

router.get('/dialogue/pick-a-theme/inner-dialogue', (req, res) => {
    res.render("innerDialogue");
});

router.post('dialogue/pick-a-theme/inner-dialogue', (req, res) => {
    const theme = req.body.theme;
    console.log(theme);
    res.render("innerDialogue");
});

router.get('/dialogue/pick-a-theme/talk-to-another-character', (req, res) => {
    res.render("talkToAnotherCharacter");
});

router.post('dialogue/pick-a-theme/talk-to-another-character', (req, res) => {
    const theme = req.body.theme;
    console.log(theme);
    res.render("talkToAnotherCharacter");
});

router.get('/dialogue/pick-a-theme/chat-with-yourself', (req, res) => {
    res.render("chatWithYourself");
});

router.post('dialogue/pick-a-theme/chat-with-yourself', (req, res) => {
    const theme = req.body.theme;
    console.log(theme);
    res.render("chatWithYourself");
});


module.exports = router;