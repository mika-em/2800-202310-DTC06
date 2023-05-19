const express = require("express");
const router = express.Router();
// const openai = require('openai');
const User = require("../models/users").usersModel;
const dotenv = require('dotenv');
// const User = require("../models/users");
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();


const configuration = new Configuration({
    organization: "org-wZOT14YD6omEzAgdgaFU5gz3",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


router.get('/dialogue', (req, res) => {
    res.render("dialogueHome");
});

router.get('/dialogue/new', (req, res) => {
    res.render("dialogueFilters");
});

router.get('/dialogueFilters', (req, res) => {
    res.render("dialogueFilters", {
        output: null
    });
});

router.get('/dialogue/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({ username: req.session.user.username });
    const dialogueHistory = currentUser.dialogueHistory;

    res.render("dialogueChat", {
        placeholderText: "Write a prompt here...",
        dialogueHistory: dialogueHistory
    });
});

async function callOpenAIAPi(userPrompt, persona) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${persona}\n${userPrompt}`,
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

    const currentUser = await User.findOne({ username: req.session.user.username });
    const persona = currentUser.persona;

    console.log(prompt);

    const responseData = await callOpenAIAPi(prompt, persona);

    await User.updateOne(
        { username: currentUsername },
        {
            $push: {
                dialogueHistory: {
                    userPrompt: prompt,
                    botResponse: responseData,
                    persona: persona
                }
            }
        }
    );

    const dialogueHistory = currentUser.dialogueHistory;

    console.log(dialogueHistory);

    res.render("dialogueChat", {
        placeholderText: "Write a prompt here...",
        dialogueHistory: dialogueHistory
    });
});



module.exports = router;