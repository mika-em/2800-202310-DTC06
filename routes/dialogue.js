const express = require("express");
const router = express.Router();
const User = require("../models/users");
const dotenv = require('dotenv');
const Dialogue = require("../models/dialogueList");

// ======= AI API STUFF =======
const {
    Configuration,
    OpenAIApi
} = require('openai');

dotenv.config();
router.use(express.static('public'));

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_KEY,
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// function to call OpenAI API
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

// ======= END AI API STUFF =======

// ======= DIALOGUE ROUTES =======

//Dialogue Home
router.get('/dialogue', (req, res) => {
    res.render("./dialogue/dialogueHome");
});

//Dialogue Filters
router.get('/dialogue/new', (req, res) => {
    res.render("dialogueFilters");
});

//Dialogue Filters
router.get('/dialogueFilters', (req, res) => {
    res.render("./dialogue/dialogueFilters", {
        output: null
    });
});


// ======= Inner Dialogue =======
//Route for Inner Dialogue
router.get('/dialogue/inner-dialogue', (req, res) => {
    res.render("./dialogue/innerDialogueHome");
});

//Route for Inner Dialogue Chat
router.post('/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUsername = req.session.user.username;
    const persona = req.body.persona || "random";
    const situation = req.body.situation || "random";
    const setting = req.body.setting || "random";

    const prompt = `Generate an inner dialogue of a character described as ${persona} whose is in a ${setting} setting where they are faced with ${situation}.`;
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
    res.render("dialogue/innerDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: currentUser.innerDialogueHistory,
        // persona : req.body.persona,
    });

});


//Route for Inner Dialogue Chat
router.get('/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(currentUser)
    console.log(innerDialogueHistory)

    res.render("dialogue/innerDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: innerDialogueHistory
    });
});

//Route for Inner Dialogue Chat Save
router.post('/dialogue/chat/inner-dialogue/save', async (req, res) => {
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

    res.render("dialogue/innerDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: currentUser.innerDialogueHistory,
    });

})


// ======= User Persona Conversation Stuff =======

//Route for User Persona Chat
router.get('/dialogue/user-persona-chat', async (req, res) => {
    res.render("./dialogue/userPersonaHome");
});

//Route for User Persona Chat
router.post('/dialogue/chat/user-persona-chat', async (req, res) => {
    persona = req.body.persona || "random";
    req.session.personaServerList = persona; //persona in the session

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

    res.render("./dialogue/userPersonaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});

//Chat for User Persona Chat
router.get('/dialogue/chat/user-persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory;

    // Retrieve persona from the session
    const persona = req.session.personaServerList;

    res.render("./dialogue/personaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});

//Route for User Persona Chat
router.post('/dialogue/chat/user-persona', async (req, res) => {
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

    res.render("./dialogue/userPersonaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});


//Saved Chat for User Persona Chat
router.post('/dialogue/chat/user-persona/save', async (req, res) => {
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

    res.render("dialogue/userPersonaChat", {
        placeholderText: "Write a response here...",
        userPersonaChatHistory: currentUser.userPersonaChatHistory,
    })
});


// ======= Persona to Persona Conversation =======

//Route for Persona to Persona Chat
router.get('/dialogue/persona-to-persona-chat', async (req, res) => {
    res.render("./dialogue/personaToPersonaHome");
});

//Route for Persona to Persona Chat
router.post('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    const currentUsername = req.session.user.username;
    const firstPersona = req.body.firstPersona || "random";
    const secondPersona = req.body.secondPersona || "random";
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

    res.render("dialogue/personaToPersonaChat", {
        placeholderText: "Write a prompt here...",
        PersonaPersonaChatHistory: PersonaPersonaChatHistory
    });
});

//Route for Persona to Persona Chat
router.get('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    currentUser = await User.findOne({
        username: req.session.user.username
    });
    const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory.map(entry => {
        return {
            userPrompt: entry.userPrompt.split('\n').map(line => `${line.split(':')[0].trim()}:`).join('\n'),
            botResponse: entry.botResponse
        };
    });

    res.render("dialogue/personaToPersonaChat", {
        placeholderText: "Write a response here...",
        PersonaPersonaChatHistory: PersonaPersonaChatHistory
    });
});

//Saved Chat for Persona to Persona Chat
router.post('/dialogue/chat/persona-to-persona-chat/save', async (req, res) => {
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

    res.render("dialogue/personaToPersonaChat", {
        placeholderText: "Write a response here...",
        PersonaPersonaChatHistory: currentUser.PersonaPersonaChatHistory
    })
});



// ##########################################
// #         Routes from Saved Persona      #
// ##########################################


// ======= Inner Dialogue =======

//Route to Inner Dialogue Home
router.get('/saved/persona/dialogue/inner-dialogue', (req, res) => {
    let persona = req.session.personaServerList[0] || [];
    res.render("./fromSavedPersona/innerDialogueHome", {
        persona: persona
    });
});

//Route to Inner Dialogue Chat
router.post('/saved/persona/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUsername = req.session.user.username;
    let persona;
    if (req.session.personaServerList && req.session.personaServerList.length > 0) {
        persona = req.session.personaServerList;
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
    res.render("./fromSavedPersona/innerDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: currentUser.innerDialogueHistory,
        personaServerList: persona || req.session.personaServerList,
        persona: persona
    });
});


//Route to save inner dialogue to database
router.get('/saved/persona/dialogue/chat/inner-dialogue', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(currentUser)
    console.log(innerDialogueHistory)

    res.render("./fromSavedPersona/innerDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: currentUser.innerDialogueHistory,
        personaServerList: persona || req.session.personaServerList,
        // persona: persona
    });
});


// Save inner dialogue to database
router.post('/saved/persona/dialogue/chat/inner-dialogue/save', async (req, res) => {
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

    res.render("./fromSavedPersona/innerDialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: currentUser.innerDialogueHistory,
        // personaServerList: persona || req.session.personaServerList
    });

})


// ======= User Persona Conversation =======

// Route to generate a user persona chat
router.get('/saved/persona/dialogue/user-persona-chat', (req, res) => {
    let persona = req.session.personaServerList[0] || [];

    res.render("./fromSavedPersona/userPersonaHome", {
        persona: persona
    });
});

// Route to generate a user persona chat
router.post('/saved/persona/dialogue/chat/user-persona-chat', async (req, res) => {
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

    res.render("./fromSavedPersona/userPersonaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});

// Route to render the user persona chat page
router.get('/saved/persona/dialogue/chat/user-persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory;

    // Retrieve persona from the session
    const persona = req.session.personaServerList;

    res.render("fromSavedPersona/userPersonaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});

// Route to save a user persona chat
router.post('/saved/persona/dialogue/chat/user-persona', async (req, res) => {
    const prompt = req.body.prompt || "random";
    const currentUsername = req.session.user.username;
    const persona = req.session.personaServerList;

    const personaPrompt = `Respond as a character described as ${persona} after it is told ${prompt}.`;
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

    res.render("fromSavedPersona/userPersonaChat", {
        placeholderText: "What else do you want to say?",
        userPersonaChatHistory: userPersonaChatHistory,
    });
});

//Route for saving a user persona chat
router.post('/saved/persona/dialogue/chat/user-persona/save', async (req, res) => {
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

    res.render("fromSavedPersona/userPersonaChat", {
        placeholderText: "Write a response here...",
        userPersonaChatHistory: currentUser.userPersonaChatHistory,
    })
});


// ======= Persona to Persona Conversation =======

//Route for the persona to persona chat home page
router.get('/saved/persona/dialogue/persona-to-persona-chat', (req, res) => {
    const currentUsername = req.session.user.username;
    const firstPersona = req.session.personaServerList[0];
    let secondPersona

    if (req.session.personaServerList.length > 1) {
        secondPersona = req.session.personaServerList[1];
    } else {
        secondPersona = req.body.secondPersona || '';
    }
    res.render("./fromSavedPersona/personaToPersonaHome", {
        firstPersona: firstPersona,
        secondPersona: secondPersona,
        personaServerList: req.session.personaServerList
    });
});

//Route for the persona to persona chat
router.post('/saved/persona/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    const currentUsername = req.session.user.username;
    const firstPersona = req.session.personaServerList[0];
    let secondPersona

    if (req.session.personaServerList.length > 1) {
        secondPersona = req.session.personaServerList[1];
    } else {
        secondPersona = req.body.secondPersona || '';
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

    res.render("fromSavedPersona/personaToPersonaChat", {
        placeholderText: "Write a prompt here...",
        PersonaPersonaChatHistory: PersonaPersonaChatHistory,
        personaServerList: req.session.personaServerList
    });
});

// Route for the persona to persona chat page
router.get('/saved/persona/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    currentUser = await User.findOne({
        username: req.session.user.username
    });
    const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory.map(entry => {
        return {
            userPrompt: entry.userPrompt.split('\n').map(line => `${line.split(':')[0].trim()}:`).join('\n'),
            botResponse: entry.botResponse
        };
    });

    res.render("fromSavedPersona/personaToPersonaChat", {
        placeholderText: "Write a response here...",
        PersonaPersonaChatHistory: PersonaPersonaChatHistory
    });
});

// Save the conversation to the database
router.post('/saved/persona/dialogue/chat/persona-to-persona-chat/save', async (req, res) => {
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

    res.render("fromSavedPersona/personaToPersonaChat", {
        placeholderText: "Write a response here...",
        PersonaPersonaChatHistory: currentUser.PersonaPersonaChatHistory
    })
});
module.exports = router;