const express = require("express");
const router = express.Router();
const User = require("../models/users").usersModel;
const dotenv = require('dotenv');


const {
    Configuration,
    OpenAIApi
} = require('openai');

dotenv.config();
router.use(express.static('public'));

const configuration = new Configuration({
    organization: "org-wZOT14YD6omEzAgdgaFU5gz3",
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
    console.log(responseData);
    return responseData;
}

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

//Inner Dialogue
router.get('/dialogue/inner-dialogue', (req, res) => {
    res.render("./dialogue/innerDialogue");
});

router.post('/dialogue/chat/inner-dialogue', async (req, res) => {
    const persona = req.body.persona || "random";
    const situation = req.body.plot || "random";
    const plot = req.body.plot || "random";

    const message = `Generate an inner dialogue of a character described as ${persona} whose is in a ${plot} setting where they are faced with ${situation}.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;
    console.log(currentUsername)

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            personaHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    })

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const personaHistory = currentUser.personaHistory
    console.log(personaHistory)

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        personaHistory: personaHistory
    });
});

//Inner Dialogue Chat
router.get('/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: innerDialogueHistory
    });
});


router.post('/dialogue/chat/inner-dialogue', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;
    console.log(prompt);

    const responseData = await callOpenAIAPi(prompt);

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            innerDialogueHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    })
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory

    console.log(innerDialogueHistory)

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: innerDialogueHistory
    });
});




//User Persona Chat
router.get('/dialogue/user-persona-chat', async (req, res) => {
    res.render("./dialogue/userPersonaChat");
});

router.post('/dialogue/chat/user-persona-chat', async (req, res) => {
    const name = req.body.name || "random";
    const chat = req.body.chat || "random";

    const message = `Generate a response from a character described as ${name} after it is told ${chat}.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;
    console.log(currentUsername)

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            userPersonaChatHistory: {
                userPrompt: message,
                botResponse: responseData
            }
        }
    })

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const userPersonaChatHistory = currentUser.userPersonaChatHistory
    console.log(userPersonaChatHistory)

    res.render("/dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

//Chat for User Persona Chat
router.get('/dialogue/chat/user-persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    res.render("/dialogue/userPersonaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

router.post('/dialogue/chat/user-persona', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;
    console.log(prompt);

    const responseData = await callOpenAIAPi(prompt);

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            userPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    })
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    console.log(innerDialogueHistory)

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

module.exports = router;