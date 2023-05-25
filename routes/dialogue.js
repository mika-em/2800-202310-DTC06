const express = require("express");
const router = express.Router();
const User = require("../models/users");
const dotenv = require('dotenv');
const Dialogue = require("../models/dialogueList");
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
                botResponse: responseData,
                
            }
        }

    })

    const currentUser = await User.findOne({
        username: currentUsername
    });

    const innerDialogueHistory = currentUser.innerDialogueHistory
    console.log(innerDialogueHistory)
    res.render("dialogue/dialogueChat", {
        placeholderText: "Write a response here...",
        innerDialogueHistory: currentUser.innerDialogueHistory,
        personaServerList: persona || req.session.personaServerList
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

res.render("dialogue/dialogueChat", {
    placeholderText: "Write a response here...",
    innerDialogueHistory: currentUser.innerDialogueHistory,
    personaServerList: persona || req.session.personaServerList
});

})


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
                botResponse: `${persona}: ${responseData}`
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory;

    res.render("./dialogue/personaChat", {
        placeholderText: "What is your response?",
        userPersonaChatHistory: userPersonaChatHistory,
        personaServerList: req.session.personaServerList
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
        persona: persona,
        personaServerList: req.session.personaServerList
    });
});

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
                botResponse: `${persona}: ${responseData}`
            }
        }
    });

    const currentUser = await User.findOne({
        username: currentUsername
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory;

    res.render("./dialogue/personaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory,
        personaServerList: req.session.personaServerList
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

    res.render("dialogue/personaChat", {
        placeholderText: "Write a response here...",
        userPersonaChatHistory: currentUser.userPersonaChatHistory,
        personaServerList: req.session.personaServerList
    })
});


//Persona to Persona stuff
//Persona Persona Page

router.get('/dialogue/persona-to-persona-chat', async (req, res) => {
    res.render("./dialogue/personaToPersona");
});

router.post('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
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
    // const responseData = await callOpenAIAPi(prompt);
    // await User.updateOne({
    //     username: currentUsername
    // }, {
    //     $push: {
    //         PersonaPersonaChatHistory: {
    //             userPrompt: prompt,
    //             botResponse: responseData
    //         }
    //     }

    // })
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

router.get('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
        username: req.session.user.username
    });
    // const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory
    // console.log(currentUser)
    // console.log(PersonaPersonaChatHistory)
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
















// router.post('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
//     const currentUsername = req.session.user.username;
//     let persona1;
//     let persona2;

//     if (req.session.personaServerList && req.session.personaServerList.length > 1) {
//         // If at least two personas are available in the session, use the first two
//         persona1 = req.session.personaServerList[0];
//         persona2 = req.session.personaServerList[1];
//     } else {
//         // If not enough personas are available in the session, use random personas
//         persona1 = req.body.firstPersona || "random1";
//         persona2 = req.body.secondPersona || "random2";
//     }

//     const situation = req.body.situation || "random";
//     const prompt = `Generate an inner dialogue between ${persona1} and ${persona2} in a ${plot} setting where they are faced with ${situation}.`;
//     console.log(prompt);
//     const responseData = await callOpenAIAPi(prompt);

//     await User.updateOne({
//         username: currentUsername
//     }, {
//         $push: {
//             PersonaPersonaChatHistory: {
//                 userPrompt: prompt,
//                 botResponse: `${persona1}: ${responseData.split('\n')[0]}\n${persona2}: ${responseData.split('\n')[1]}`
//             }
//         }
//     });

//     const currentUser = await User.findOne({
//         username: currentUsername
//     });

//     const PersonaPersonaChatHistory = currentUser.PersonaPersonaChatHistory;

//     res.render("./dialogue/personaToPersonaChat", {
//         placeholderText: "Write a prompt here...",
//         PersonaPersonaChatHistory: PersonaPersonaChatHistory,
//     });
// });



// Route for displaying the persona-to-persona chat page
// router.get('/dialogue/chat/persona-to-persona-chat', async (req, res) => {
//     const currentUser = await User.findOne({
//         username: req.session.user.username
//     });
//     const personaPersonaChatHistory = currentUser.PersonaPersonaChatHistory;

//     res.render("./dialogue/personaToPersonaChat", {
//         placeholderText: "Write a prompt here...",
//         PersonaPersonaChatHistory: personaPersonaChatHistory,
//     });
// });

// // Route for submitting a prompt in the persona-to-persona chat
// router.post('/dialogue/chat/persona-to-persona', async (req, res) => {
//     const prompt = req.body.prompt;
//     const currentUsername = req.session.user.username;

//     const responseData = await callOpenAIAPi(prompt);

//     await User.updateOne({
//         username: currentUsername
//     }, {
//         $push: {
//             PersonaPersonaChatHistory: {
//                 persona: "User",
//                 userPrompt: prompt,
//                 botResponse: responseData,
//             },
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
// });

// //Saved Chat for Persona to Persona
// router.post('/dialogue/chat/persona-to-persona/save', async (req, res) => {
//     const index = req.body.index;
//     const date = new Date();
//     const currentUser = await User.findOne({
//         username: req.session.user.username
//     });
//     const dialogueHistory = currentUser.PersonaPersonaChatHistory;
//     const dialogue = dialogueHistory[index].botResponse

//     await Dialogue.create({
//         userId: currentUser_id,
//         dialogue: dialogue,
//         date: date
//     });

//     res.render("dialogue/personaChat", {
//         placeholderText: "Write a response here...",
//         PersonaPersonaChatHistory: PersonaPersonaChatHistory
//     })
// });


module.exports = router;