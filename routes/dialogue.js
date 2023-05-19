const express = require("express");
const router = express.Router();
// const openai = require('openai');
const User = require("../models/users").usersModel;
const Dialogue = require("../models/users").dialogueModel;
const dotenv = require('dotenv');
// const User = require("../models/users");
const $ = require('jquery');


const {
    Configuration,
    OpenAIApi
} = require('openai');

dotenv.config();
router.use(express.static('public'));






const axios = require('axios');
const configuration = new Configuration({
    organization: "org-wZOT14YD6omEzAgdgaFU5gz3",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


router.get('/dialogue', (req, res) => {
    res.render("./dialogue/dialogueHome");
});

router.get('/dialogue/new', (req, res) => {
    res.render("dialogueFilters");
});

router.get('/dialogueFilters', (req, res) => {
    res.render("./dialogue/dialogueFilters", {
        output: null
    });
});

router.get('/dialogue/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const dialogueHistory = currentUser.dialogueHistory;

    res.render("/dialogue/dialogueChat", {
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
    try {
        const prompt = req.body.prompt;
        const currentUsername = req.session.user.username;
        console.log(prompt);

        const currentUser = await User.findOne({
            username: currentUsername
        });

        const responseData = await callOpenAIAPi(prompt);

        currentUser.dialogueHistory.push({
            userPrompt: prompt,
            botResponse: responseData
        });
        await currentUser.save();

        const updatedUser = await User.findOne({
            username: currentUsername
        });
        const dialogueHistory = updatedUser.dialogueHistory;

        console.log(dialogueHistory);

        res.render("dialogueChat", {
            placeholderText: "Write a prompt here...",
            dialogueHistory: dialogueHistory
        });
    } catch (error) {
        console.error(error);
        // Handle the error and send an appropriate response
        res.status(500).send("An error occurred");
    }
});


router.get('/dialogue/saved-dialogue', async (req, res) => {
    try {
        const dialogue = await Dialogue.find();

        res.render('saved/savedDialogue', {
            dialogue: dialogue
        });
    } catch (error) {
        console.error(error);
        // Handle the error and send an appropriate response
        res.status(500).send("An error occurred");
    }
});



router.post('/dialogue/saved-dialogue', async (req, res) => {
    try {
        const botResponse = req.body.botResponse;

        const dialogue = await Dialogue.findOne();
        dialogue.dialogueSaved.push({
            botResponse
        });
        await dialogue.save();

        res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

function saveBotResponse(botResponse, dialogueIndex) {
    const saveBotResponseUrl = 'http://localhost:3000/dialogue/saved-dialogue';

    const formData = new FormData();
    formData.append('botResponse', botResponse);
    formData.append('dialogueIndex', dialogueIndex);

    fetch(saveBotResponseUrl, {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Bot response saved:', data);
            // Show a message to the user
            showMessage('Dialogue saved');
        })
        .catch((error) => {
            console.error('Error saving bot response:', error);
        });

    function showMessage(message) {
        // Display the message to the user in your preferred way
        console.log(message);
    }
}

saveBotResponse();




module.exports = router;