const express = require("express");
const router = express.Router();
const openai = require('openai');
const User = require("../models/users").usersModel;

openai.apiKey = process.env.OPEN_AI_API_KEY

router.get('/dialogue', (req, res) => {
    res.render("./dialogue/dialogueHome");
});

// router.get('/dialogue/new', (req, res) => {
//     res.render("startNewDialogue");
// });

router.get('/dialogueFilters', (req, res) => {
    res.render("./dialogue/dialogueFilters", {
        output: null
    });
});

router.get('/dialogue/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const dialogueHistory = currentUser.dialogueHistory

    res.render("/dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        dialogueHistory: dialogueHistory
    });
});

async function callOpenAIAPi(userPrompt) {
    const response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: `${userPrompt}`,
        temperature: 0,
        max_tokens: 1000,
    });
    const responseData = response.data.choices[0].text;
    console.log(responseData);
    return responseData;
}

router.post('/dialogue/inner-dialogue', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;
    console.log(prompt);

    const responseData = await callOpenAIAPi(prompt);

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            dialogueHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    })
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const dialogueHistory = currentUser.dialogueHistory

    console.log(personaHistory)

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        dialogueHistory: dialogueHistory
    });
});



module.exports = router;