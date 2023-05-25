const express = require("express");
const router = express.Router();
const User = require("../models/users");
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

//Inner Dialogue with Saved Persona
router.get('/persona/saved-persona/dialogue/inner-dialogue', (req, res) => {
    res.render("./dialogue/innerDialogue");
});

router.post('/persona/saved-persona/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUsername = req.session.user.username;
    const savedPersona = req.session.personaServerList;

    const persona = savedPersona;
    const situation = req.body.situation || "random";
    const plot = req.body.plot || "random";

    const prompt = `Generate an inner dialogue of a character described as ${persona} whose is in a ${plot} setting where they are faced with ${situation}.`;

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
        username: currentUsername
    });

    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(innerDialogueHistory)

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: innerDialogueHistory
    });
});

//Inner Dialogue Chat with Saved Persona
router.get('/persona/saved-persona/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(currentUser)
    console.log(innerDialogueHistory)

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: innerDialogueHistory
    });
});

//User Persona Chat with Saved Persona
router.get('/persona/saved-persona/dialogue/chat/user-persona-chat', async (req, res) => {
    res.render("./dialogue/userPersona");
});

router.post('/persona/saved-persona/dialogue/chat/user-persona-chat', async (req, res) => {
    const persona = req.session.personaServerList;
    const chat = req.body.chat || "random";

    const prompt = `Generate a chat between a user and a character. The character is described as ${persona}. The user says "${chat}" and the character responds.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            userPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    });

    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    res.render("dialogue/personaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

//Chat for User Persona Chat with Saved Persona
router.get('/persona/saved-persona/dialogue/chat/user-persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    res.render("./dialogue/personaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

router.post('/persona/saved-persona/dialogue/chat/user-persona', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;
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
        username: currentUsername
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    res.render("./dialogue/personaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

//Persona to Persona Page with Saved Persona
router.get('/persona/saved-persona/dialogue/chat/persona-to-persona', async (req, res) => {
    res.render("./dialogue/personaToPersona");
}
);

router.post('/persona/saved-persona/dialogue/chat/persona-to-persona', async (req, res) => {
    const personaList = req.session.personaServerList;
    //if there is two personas in the list, then it will generate a chat between the two personas
    //if only one persona, it will generate a chat between the persona and the user input
    if (personaList.length === 2) {
        firstPersona = personaList[0];
        secondPersona = personaList[1];
        setting = req.body.setting || "random";
        prompt = `Generate a chat between two characters. The first character is described as ${firstPersona}. The second character is described as ${secondPersona} and they are in a ${setting} setting.`;
    }
    else
    //if personaList is length == 1, fill in the first persona with the persona in the list and the second persona with the user input
    {
        firstPersona = personaList[0];
        secondPersona = req.body.secondPersona;
        setting = req.body.setting || "random";
        prompt = `Generate a chat between two characters. The first character is described as ${firstPersona}. The second character is described as ${secondPersona} and they are in a ${setting} setting.`;
    }
    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            personaToPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });
    const personaToPersonaChatHistory = currentUser.personaToPersonaChatHistory

    res.render("./dialogue/personaToPersonaChat", {
        placeholderText: "What is your response?",
        personaToPersonaChatHistory: personaToPersonaChatHistory
    });
});

// Chat for Persona to Persona with Saved Persona
router.get('/persona/saved-persona/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const personaToPersonaChatHistory = currentUser.personaToPersonaChatHistory

    res.render("./dialogue/personaToPersonaChat", {
        placeholderText: "What is your response?",
        personaToPersonaChatHistory: personaToPersonaChatHistory
    });
});

router.post('/persona/saved-persona/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;
    const responseData = await callOpenAIAPi(prompt);

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            personaToPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: responseData
            }
        }
    })
    const currentUser = await User.findOne({
        username: currentUsername
    });
    const personaToPersonaChatHistory = currentUser.personaToPersonaChatHistory

    res.render("./dialogue/personaToPersonaChat", {
        placeholderText: "What is your response?",
        personaToPersonaChatHistory: personaToPersonaChatHistory
    });
});

module.exports = router;


