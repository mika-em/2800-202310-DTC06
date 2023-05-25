const express = require("express");
const router = express.Router();
const User = require("../models/users");
const dotenv = require('dotenv');
const Dialogue = require("../models/dialogueList");

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
    console.log("User Prompt:", userPrompt);

    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${userPrompt}`,
            temperature: 0,
            max_tokens: 1000,
        });


        const responseData = response.data.choices[0].text;
        console.log("Response Data:", responseData.replace(/\n/g, "\\n"));
        console.log("Response Data:", responseData);

        return responseData;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}


//Inner Dialogue
router.get('saved/persona/dialogue/inner-dialogue', (req, res) => {
    console.log("its working!")
    res.render("./dialogue/fromSavedPersona/innerDialogueHome");
});

router.post('saved/persona/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUsername = req.session.user.username;
    let persona;
    if (req.session.personaServerList && req.session.personaServerList.length > 0) {
        persona = req.session.personaServerList;
    } else {
        persona = req.body.persona || "random";
    }
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
                botResponse: responseData,
                
            }
        }

    })

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(innerDialogueHistory)
    res.render("dialogue/fromSavedPersona/innderDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: currentUser.innerDialogueHistory,
        personaServerList: persona || req.session.personaServerList
    });

});


//Inner Dialogue Chat
router.get('saved/persona/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(currentUser)
    console.log(innerDialogueHistory)

    res.render("dialogue/fromSavedPersona/innderDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: innerDialogueHistory
    });
});

router.post('saved/persona/dialogue/chat/inner-dialogue/save', async (req, res) => {
const index = req.body.save;
const date = new Date();
const currentUser = await User.findOne({
    username: req.session.user.username
});
const dialogue = currentUser.innerDialogueHistory[index].response;

await Dialogue.create({
    userId: currentUser._id,
    dialogue: dialogue,
    date: date
});

res.render("dialogue/fromSavedPersona/innderDialogueChat", {
    placeholderText: "Write a response here...",
    innerDialogueHistory: currentUser.innerDialogueHistory,
    personaServerList: persona || req.session.personaServerList
});

})


//User Persona Chat
router.get('saved/persona/dialogue/user-persona-chat', async (req, res) => {
    res.render("./dialogue/fromSavedPersona/userPersonaChatHome");
});

router.post('saved/persona/dialogue/chat/user-persona-chat', async (req, res) => {
    let persona;
    if (req.session.personaServerList && req.session.personaServerList.length > 0) {
        persona = req.session.personaServerList;
    } else {
        persona = req.body.persona || "random";
        req.session.personaServerList = persona; //persona in the session
    }
    const chat = req.body.chat || "random";

    const prompt = `Pretend you're a character described as ${persona} after it is told ${chat}.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            userPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: `${responseData}`,
                personaServerList: persona || req.session.personaServerList
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory;

    res.render("./dialogue/fromSavedPersona/userPersonaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});

//Chat for User Persona Chat
router.get('saved/persona/dialogue/chat/user-persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory;

    // Retrieve persona from the session
    const persona = req.session.personaServerList;

    res.render("./dialogue/fromSavedPersona/userPersonaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});

router.post('saved/persona/dialogue/chat/user-persona', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;
    const persona = req.session.personaServerList;

    const personaPrompt = `Pretend you're a character described as ${persona} after it is told ${prompt}.`;
    const responseData = await callOpenAIAPi(personaPrompt);

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            userPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: `${responseData}`
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory;

    res.render("./dialogue/fromSavedPersona/userPersonaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});


//Saved Chat for User Persona Chat
router.post('saved/persona/dialogue/chat/user-persona/save', async (req, res) => {
    const index = req.body.save;
    const date = new Date();
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    // const dialogueHistory = currentUser.userPersonaChatHistory;
    const dialogue = currentUser.userPersonaChatHistory[index].botResponse

    await Dialogue.create({
        userId: currentUser._id,
        dialogue: dialogue,
        date: date
    });

    res.render("dialogue/fromSavedPersona/userPersonaChat", {
        placeholderText: "Write a response here...",
        userPersonaChatHistory: currentUser.userPersonaChatHistory,
    })
});


//Persona to Persona stuff
//Persona Persona Page

router.get('saved/persona/dialogue/persona-to-persona-chat', async (req, res) => {
    res.render("./dialogue/personaToPersona");
});

router.post('saved/persona/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    const currentUsername = req.session.user.username;
    let persona;
    if (req.session.personaServerList && req.session.personaServerList.length > 0) {
        firstPersona = req.session.personaServerList[0];
        secondPersona = req.session.personaServerList[1];
    } else {
        firstPersona = req.body.firstPersona || "random";
        secondPersona = req.body.secondPersona || "random";

    }
    const situation = req.body.situation || "random";
    const prompt = `Generate a conversation between ${firstPersona} and ${secondPersona} when they are in a ${situation} situation`;
    const responseData = await callOpenAIAPi(prompt);
    const conversation = `${firstPersona}: ${req.body.firstPersona}\n${secondPersona}: ${req.body.secondPersona}\n`;

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            PersonaPersonaChatHistory: {
                userPrompt: conversation,
                botResponse: responseData
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory
    console.log(PersonaPersonaChatHistory)

    res.render("dialogue/fromSavedPersona/personaToPersonaChat", {
        placeholderText: "Write a prompt here...",
        PersonaPersonaChatHistory: PersonaPersonaChatHistory
    });
});

router.get('saved/persona/dialogue/chat/persona-to-persona-chat', async (req, res) => {
        currentUser = await User.findOne({
            username: req.session.user.username
    });
    const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory.map(entry => {
        return {
            userPrompt: entry.userPrompt.split('\n').map(line => `${line.split(':')[0].trim()}:`).join('\n'),
            botResponse: entry.botResponse
        };
    });

    res.render("dialogue/fromSavedPersona/personaToPersonaChat", {
        placeholderText: "Write a response here...",
        PersonaPersonaChatHistory: PersonaPersonaChatHistory
    });
});


router.post('saved/persona/dialogue/chat/persona-to-persona-chat/save', async (req, res) => {
    const index = req.body.save;
    const date = new Date();
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const dialogue = currentUser.PersonaPersonaChatHistory[index].botResponse;

    await Dialogue.create({
        userId: currentUser._id,
        dialogue: dialogue,
        date: date
    });

    res.render("dialogue/fromSavedPersona/personaToPersonaChat", {
        placeholderText: "Write a response here...",
        PersonaPersonaChatHistory: currentUser.PersonaPersonaChatHistory
    })
});

module.exports = router;