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
                botResponse: `${persona}: ${responseData}`
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

//Inner Dialogue Chat
router.get('/dialogue/chat/inner-dialogue', async (req, res) => {
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

router.post('/dialogue/chat/inner-dialogue/save', async (req, res) => {
    const index = req.body.index;
    const date = new Date();
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const dialogueHistory = currentUser.innerDialogueHistory;
    const dialogue = dialogueHistory[index].botResponse

    await Dialogue.create({
        userId: currentUser_id,
        dialogue: dialogue,
        date: date
    });

    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: innerDialogueHistory
    })
});


//User Persona Chat
router.get('/dialogue/user-persona-chat', async (req, res) => {
    res.render("./dialogue/userPersona");
});

router.post('/dialogue/chat/user-persona-chat', async (req, res) => {
    let persona;
    if (req.session.personaServerList && req.session.personaServerList.length > 0) {
        persona = req.session.personaServerList;
    } else {
        persona = req.body.persona || "random";
    }
    const chat = req.body.chat || "random";

    const prompt = `Pretend you're a character described as ${persona} after it is told ${chat}.`;

    const responseData = await callOpenAIAPi(prompt);

    const currentUsername = req.session.user.username;
    console.log(currentUsername)

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            userPersonaChatHistory: {
                userPrompt: prompt,
                botResponse: `${persona}: ${responseData}`
            }
        }
    })

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const userPersonaChatHistory = currentUser.userPersonaChatHistory
    console.log(userPersonaChatHistory)

    res.render("./dialogue/personaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

//Chat for User Persona Chat
router.get('/dialogue/chat/user-persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    res.render("./dialogue/personaChat", {
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

    res.render("./dialogue/personaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

//Saved Chat for User Persona Chat
router.post('/dialogue/chat/user-persona/save', async (req, res) => {
    const index = req.body.index;
    const date = new Date();
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const dialogueHistory = currentUser.userPersonaChatHistory;
    const dialogue = dialogueHistory[index].botResponse

    await Dialogue.create({
        userId: currentUser_id,
        dialogue: dialogue,
        date: date
    });

    res.render("dialogue/personaChat", {
        placeholderText: "Write a response here...",
        userPersonaChatHistory: userPersonaChatHistory
    })
});


//Persona to Persona stuff
//Persona Persona Page
// Route for initiating the persona-to-persona chat

router.get('/dialogue/persona-to-persona-chat', async (req, res) => {
    res.render("./dialogue/personaToPersona");
});

// router.post('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
//     try {let firstPersona;
//     let secondPersona;
//     if (req.session.personaServerList && req.session.personaServerList.length === 2) {
//         firstPersona = req.session.personaServerList[0];
//         secondPersona = req.session.personaServerList[1];
//     } else {
//         firstPersona = req.body.firstPersona || "random";
//         secondPersona = req.body.secondPersona || "random";
//     }

//     const setting = req.body.setting || "random";

//     const conversationLength = 10;
//     const PersonaPersonaChatHistory = [];

//     for (let i = 0; i < conversationLength; i++) {
//         const currentPersona = i % 2 === 0 ? firstPersona : secondPersona;
//         const currentPrompt = `Create a dialogue for ${currentPersona} in a ${setting} setting.`;
//         const currentResponse = await callOpenAIAPi(currentPrompt);

//         PersonaPersonaChatHistory.push({
//             persona: currentPersona,
//             userPrompt: currentPrompt,
//             botResponse: currentResponse,
//         });
//     }

//     const currentUsername = req.session.user.username;

//     await User.updateOne({
//         username: currentUsername
//     }, {
//         $push: {
//             PersonaPersonaChatHistory: PersonaPersonaChatHistory,
//         },
//     });

//     const currentUser = await User.findOne({
//         username: currentUsername
//     });
//     const personaPersonaChatHistory = currentUser.PersonaPersonaChatHistory;

//     res.render("./dialogue/personaToPersonaChat", {
//         placeholderText: "Write a prompt here...",
//         PersonaPersonaChatHistory: personaPersonaChatHistory,
//     });
// } catch (err) {
//     console.log(err);
//     res.status(500).json({
//         message: "Something went wrong",
//     });
// }
// });


//Attempt at optimizing the API Calls: 
// Route for initiating the persona-to-persona chat
router.post('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    try {let firstPersona;
    let secondPersona;
    if (req.session.personaServerList && req.session.personaServerList.length === 2) {
        firstPersona = req.session.personaServerList[0];
        secondPersona = req.session.personaServerList[1];
    } else {
        firstPersona = req.body.firstPersona || "random";
        secondPersona = req.body.secondPersona || "random";
    }

    const setting = req.body.setting || "random";
    const conversationLength = 10; // Define the desired length of the conversation

    const conversationPrompts = Array.from({
        length: conversationLength
    }, (_, i) => {
        const currentPersona = i % 2 === 0 ? firstPersona : secondPersona;
        const currentPrompt = `Create a dialogue for ${currentPersona} in a ${setting} setting.`;
        return currentPrompt;
    });

    const conversationResponses = await Promise.all(conversationPrompts.map(prompt => callOpenAIAPi(prompt)));

    const currentUsername = req.session.user.username;

    const PersonaPersonaChatHistory = conversationPrompts.map((prompt, index) => ({
        persona: index % 2 === 0 ? firstPersona : secondPersona,
        userPrompt: prompt,
        botResponse: conversationResponses[index],
    }));

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            PersonaPersonaChatHistory: PersonaPersonaChatHistory,
        },
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });
    const personaPersonaChatHistory = currentUser.PersonaPersonaChatHistory;
    

    res.render("./dialogue/personaToPersonaChat", {
        placeholderText: "Write a prompt here...",
        PersonaPersonaChatHistory: personaPersonaChatHistory,
    });
}
catch (err) {
    console.log(err);
    res.redirect('/dialogue/persona-to-persona-chat');
}});


// Route for displaying the persona-to-persona chat page
router.get('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const personaPersonaChatHistory = currentUser.PersonaPersonaChatHistory;

    res.render("./dialogue/personaToPersonaChat", {
        placeholderText: "Write a prompt here...",
        PersonaPersonaChatHistory: personaPersonaChatHistory,
    });
});

// Route for submitting a prompt in the persona-to-persona chat
router.post('/dialogue/chat/persona-to-persona', async (req, res) => {
    const prompt = req.body.prompt;
    const currentUsername = req.session.user.username;

    const responseData = await callOpenAIAPi(prompt);

    await User.updateOne({
        username: currentUsername
    }, {
        $push: {
            PersonaPersonaChatHistory: {
                persona: "User",
                userPrompt: prompt,
                botResponse: responseData,
            },
        },
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });
    const personaPersonaChatHistory = currentUser.PersonaPersonaChatHistory;

    res.render("./dialogue/personaToPersonaChat", {
        placeholderText: "Write a prompt here...",
        PersonaPersonaChatHistory: personaPersonaChatHistory,
    });
});

//Previous Version of Persona To Persona Chat
// router.get('/dialogue/persona-to-persona-chat', async (req, res) => {
//     res.render("./dialogue/personaToPersona");
// });

// router.post('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
//     let persona;
//     if (req.session.personaServerList && req.session.personaServerList.length == 2) {
//         firstPersona = req.session.personaServerList[0];
//         secondPersona = req.session.personaServerList[1];
//     } else {
//         firstPersona = req.body.firstPersona || "random";
//         secondPersona = req.body.secondPersona || "random";
//     }


//     const setting = req.body.setting || "random";

//     const prompt = `Create a dialogue between two characters described as ${firstPersona} and ${secondPersona} in a ${setting} setting.`;

//     const responseData = await callOpenAIAPi(prompt);

//     const currentUsername = req.session.user.username;
//     console.log(currentUsername)

//     await User.updateOne({
//         username: currentUsername
//     }, {
//         $push: {
//             PersonaPersonaChatHistory: {
//                 userPrompt: prompt,
//                 botResponse: responseData
//             }
//         }
//     })

//     const currentUser = await User.findOne({
//         username: currentUsername
//     });

//     const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory
//     console.log(userPersonaChatHistory)

//     res.render("./dialogue/personaToPersonaChat", {
//         placeholderText: "Write a prompt here...",
//         PersonaPersonaChatHistory: PersonaPersonaChatHistory
//     });
// });

// //Chat for Persona to Persona 
// router.get('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
//     const currentUser = await User.findOne({
//         username: req.session.user.username
//     });
//     const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory

//     res.render("./dialogue/personaToPersonaChat", {
//         placeholderText: "Write a prompt here...",
//         PersonaPersonaChatHistory: PersonaPersonaChatHistory
//     });
// });

// router.post('/dialogue/chat/persona-to-persona', async (req, res) => {
//     const prompt = req.body.prompt;
//     const currentUsername = req.session.user.username;
//     console.log(prompt);

//     const responseData = await callOpenAIAPi(prompt);

//     await User.updateOne({
//         username: currentUsername
//     }, {
//         $push: {
//             PersonaPersonaChatHistory: {
//                 userPrompt: prompt,
//                 botResponse: responseData
//             }
//         }
//     })
//     const currentUser = await User.findOne({
//         username: req.session.user.username
//     });
//     const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory

//     console.log(PersonaPersonaChatHistory)

//     res.render("./dialogue/personaToPersonaChat", {
//         placeholderText: "Write a prompt here...",
//         PersonaPersonaChatHistory: PersonaPersonaChatHistory
//     });
// });

//Saved Chat for Persona to Persona
router.post('/dialogue/chat/persona-to-persona/save', async (req, res) => {
    const index = req.body.index;
    const date = new Date();
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const dialogueHistory = currentUser.PersonaPersonaChatHistory;
    const dialogue = dialogueHistory[index].botResponse

    await Dialogue.create({
        userId: currentUser_id,
        dialogue: dialogue,
        date: date
    });

    res.render("dialogue/personaChat", {
        placeholderText: "Write a response here...",
        PersonaPersonaChatHistory: PersonaPersonaChatHistory
    })
});


module.exports = router;