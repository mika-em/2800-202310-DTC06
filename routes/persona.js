const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const User = require("../models/users");
const Parameter = require("../models/parameters");
const Persona = require("../models/personaList");
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_KEY,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function callOpenAIAPi(userPrompt) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${userPrompt}`,
        temperature: 0,
        max_tokens: 1000,
    });
    const responseData = response.data.choices[0].text;
    return responseData;
}

let newParameter = [];

router.use('/persona', async (req, res, next) => {
    req.session.newParameter = newParameter;
    next();
});

router.get('/persona', (req, res) => {
    res.render("./persona/persona");
});

// General Prompt
router.get('/persona/general-prompt', (req, res) => {
    res.render("./persona/generalPrompt");
});

router.post('/persona/chat/general', async (req, res) => {
    const gender = req.body.gender || "random";
    const name = req.body.name || "random";
    const age = req.body.age || "random";
    const plot = req.body.plot || "random";

    const prompt = `Generate a random ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            personaHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const personaHistory = currentUser.personaHistory;

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        personaHistory: personaHistory
    });
});

// Saved Prompt Parameters
router.get('/persona/saved-prompt', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userID = currentUser._id;

    const savedPromptParameter = await Parameter.find({
        userId: userID
    });

    res.render("./persona/savedPrompt", { 
        savedPromptParameter: savedPromptParameter 
    });
});

router.post('/persona/saved-prompt/delete', async (req, res) => {
    const promptIDList = req.body.promptIDList;
    const parsedPromptIDList = JSON.parse(promptIDList);

    for (let i = 0; i < parsedPromptIDList.length; i++) {
        await Parameter.deleteOne({
            _id: parsedPromptIDList[i]
        });
    }

    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userID = currentUser._id;

    const savedPromptParameter = await Parameter.find({
        userId: userID
    });

    res.render("./persona/savedPrompt", {
        savedPromptParameter: savedPromptParameter
    });
});

router.post('/persona/chat/preset-prompt', async (req, res) => {
    const inputEntries = Object.entries(req.body);

    let parameterList = [];
    for (let [name, value] of inputEntries) {
        if (value.length === 0) {
            value = "random";
        }
        parameterList.push(`${name}: ${value}`);
    }

    const parameterInputs = parameterList.join(", ");

    const prompt = `Generate a random character with these attributes: ${parameterInputs}.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            personaHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const personaHistory = currentUser.personaHistory;

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        personaHistory: personaHistory
    });
});

// New Prompt Parameters
router.get('/persona/new-prompt', (req, res) => {
    res.render("./persona/newPrompt", { newParameter: newParameter });
});

router.post('/persona/new-prompt', (req, res) => {
    const parameter = req.body.parameter;
    newParameter.push(parameter);
    res.render("./persona/newPrompt", { newParameter: newParameter });
});

router.post('/persona/new-prompt/delete', (req, res) => {
    const { index } = req.body;
    if (index >= 0 && index < newParameter.length) {
        newParameter.splice(index, 1);
        res.render("./persona/newPrompt", { newParameter: newParameter });
    } else {
        res.status(400).send('Invalid index'); // Send an error response to the client
    }
});

router.post('/persona/new-prompt/saved', async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const parameterSet = newParameter;
    const date = new Date();

    const currentUser = await User.findOne({
        username: req.session.user.username
    });

    await Parameter.create({
        userId: currentUser._id,
        title: title,
        description: description,
        parameterSet: parameterSet,
        date: date
    });
    res.render("./persona/newPrompt", { 
        newParameter: newParameter 
    });
});



// Chat
router.get('/persona/chat', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const personaHistory = currentUser.personaHistory;

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        personaHistory: personaHistory
    });
});

router.post('/persona/chat', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;

    const responseData = await callOpenAIAPi(prompt);

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            personaHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    });

    const currentUser = await User.findOne({
        username: req.session.user.username
    });

    const personaHistory = currentUser.personaHistory;

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        personaHistory: personaHistory
    });
});

router.post('/persona/chat/save-persona', async (req, res) => {
    const index = req.body.save;
    const date = new Date();

    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const personaHistory = currentUser.personaHistory;

    const persona = personaHistory[index].botResponse;

    await Persona.create({
        userId: currentUser._id,
        persona: persona,
        date: date
    });

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        personaHistory: personaHistory
    });
});

module.exports = router;