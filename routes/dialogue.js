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

// router.get('/dialogue/inner-dialogue', async (req, res) => {
//     const currentUser = await User.findOne({
//         username: req.session.user.username
//     });
//     const dialogueHistory = currentUser.dialogueHistory;

//     res.render("/dialogue/dialogueChat", {
//         placeholderText: "Write a prompt here...",
//         dialogueHistory: dialogueHistory
//     });
// });

// async function callOpenAIAPi(userPrompt, persona) {
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: `${persona}\n${userPrompt}`,
//         temperature: 0,
//         max_tokens: 1000,
//     });
//     const responseData = response.data.choices[0].text;
//     console.log(responseData);
//     return responseData;
// }

// router.post('/dialogue/inner-dialogue', async (req, res) => {
//     try {
//         const prompt = req.body.prompt;
//         const currentUsername = req.session.user.username;
//         console.log(prompt);

//         const currentUser = await User.findOne({
//             username: currentUsername
//         });

//         const responseData = await callOpenAIAPi(prompt);

//         currentUser.dialogueHistory.push({
//             userPrompt: prompt,
//             botResponse: responseData
//         });
//         await currentUser.save();

//         const updatedUser = await User.findOne({
//             username: currentUsername
//         });
//         const dialogueHistory = updatedUser.dialogueHistory;

//         console.log(dialogueHistory);

//         res.render("dialogueChat", {
//             placeholderText: "Write a prompt here...",
//             dialogueHistory: dialogueHistory
//         });
//     } catch (error) {
//         console.error(error);
//         // Handle the error and send an appropriate response
//         res.status(500).send("An error occurred");
//     }
// });



// inner dialogue

// router.get('/dialogue/inner-dialogue', (req, res) => {
//     // console.log(chatPrompt)
//     res.render("./dialogue/innerDialogue");
// });

// router.post('/dialogue/inner-dialogue', (req, res) => {
//     const persona = req.body.persona || "random";
//     const situation = req.body.situation || "random";
//     const plot = req.body.plot || "random";
//     console.log(req.body)
//     console.log("line 119 " + persona, situation, plot)
    
//     const message = `Generate an inner dialogue of a character who is ${persona}, and is in a ${plot} setting where they are faced with ${situation}.`;
//     chatPrompt.push("You: " + message);
//     chatPrompt.push("hello");
//     //console.log(chatPrompt)
    
//     // placeholder for db for chatPrompt/chatHistory
//     res.redirect('/dialogue/chat', {
        
//         placeholderText: "Write a prompt here..."
//     });
// });

// router.get('/dialogue/chat', async (req, res) => {
//     const currentUser = await User.findOne({
//         username: req.session.user.username
//     });

//     const innerDialogueHistory = Object.values(currentUser.innerDialogueHistory);

//     res.render("dialogue/dialogueChat", {
//         placeholderText: "Write a prompt here...",
//         innerDialogueHistory: innerDialogueHistory
//     });
// });


// async function callOpenAIAPi(userPrompt) {
//     const response = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: `${userPrompt}`,
//         temperature: 0,
//         max_tokens: 1000,
//     });
//     const responseData = response.data.choices[0].text;
//     console.log(responseData);
//     return responseData;
// }

// router.post('/dialogue/chat', async (req, res) => {
//     const prompt = req.body.prompt;
//     const currentUsername = req.session.user.username;
//     console.log(prompt);

//     const responseData = await callOpenAIAPi(prompt);

//     await User.updateOne({
//         username: currentUsername
//     }, {
//         $push: {
//             innerDialogueHistory: {
//                 userPrompt: prompt,
//                 botResponse: responseData
//             }
//         }
//     });

//     const currentUser = await User.findOne({
//             username: currentUsername
//         })
//         .lean()
//         .exec();
//     const innerDialogueHistory = Object.values(currentUser.innerDialogueHistory);

//     console.log(innerDialogueHistory);

//     res.render("dialogue/dialogueChat", {
//         placeholderText: "Write a prompt here...",
//         innerDialogueHistory: innerDialogueHistory
//     });
// });



// router.get('/dialogue/inner-dialogue', (req, res) => {
//     // console.log(chatPrompt)
//     res.render("./dialogue/innerDialogue");
// });

// router.post('/dialogue/inner-dialogue', (req, res) => {
//     const persona = req.body.persona || "random";
//     const situation = req.body.situation || "random";
//     const plot = req.body.plot || "random";

//     const message = `Generate an inner dialogue of a character who is ${persona}, and is in a ${plot} setting where they are faced with ${situation}.`;
//     chatPrompt.push("You: " + message);
//     chatPrompt.push("hello");
//     //console.log(chatPrompt)

//     // placeholder for db for chatPrompt/chatHistory
//     res.redirect('/dialogue/chat', {
//         placeholderText: "Write a prompt here..."
//     });
// });

// router.get('/dialogue/chat', async (req, res) => {
//     const currentUser = await User.findOne({
//         username: req.session.user.username
//     });
//     const innerDialogueHistory = Object.values(currentUser.innerDialogueHistory);

//     res.render("dialogue/dialogueChat", {
//         placeholderText: "Write a prompt here...",
//         innerDialogueHistory: innerDialogueHistory
//     });
// });


router.get('/dialogue/inner-dialogue', (req, res) => {
    // console.log(chatPrompt)
    res.render("./dialogue/innerDialogue");
});

router.post('/dialogue/inner-dialogue', (req, res) => {
    const persona = req.body.persona || "random";
    const situation = req.body.plot || "random";
    const plot = req.body.plot || "random";

    const message = `Generate an inner dialogue of a character described as ${persona} whose is in a ${plot} setting where they are faced with ${situation}.`;
    chatPrompt.push("You: " + message);
    chatPrompt.push("hello");
    //console.log(chatPrompt)

    // placeholder for db for chatPrompt/chatHistory
    res.redirect('/dialogue/dialogueChat', { placeholderText: "Write a prompt here..." });
});


router.get('/dialogue/chat', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const innerDialogueHistory = currentUser.innerDialogueHistory

    res.render("/dialogue/innerDialogue", {
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: innerDialogueHistory
    });
});

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

router.post('/dialogue/chat', async (req, res) => {
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

    res.render("chat", { 
        placeholderText: "Write a prompt here...",
        innerDialogueHistory: innerDialogueHistory
     });
});




//user persona chat

router.get('/dialogue/user-persona-chat/', (req, res) => {
    // console.log(chatPrompt)
    res.render("./dialogue/userPersonaChat");
});

router.post('/dialogue/user-persona-chat', (req, res) => {
    const name = req.body.name || "random";
    const age = req.body.chat || "random";

    const message = `Generate a response from a character described as ${name} after it is told ${chat}.`;
    chatPrompt.push("You: " + message);
    chatPrompt.push("hello");
    //console.log(chatPrompt)

    // placeholder for db for chatPrompt/chatHistory
    res.redirect('/dialogue/userPersonaChat', { placeholderText: "Write a prompt here..." });
});


router.get('/dialogue/chat', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userPersonaChatHistory = currentUser.userPersonaChatHistory

    res.render("/dialogue/userPersonaChat", {
        placeholderText: "Write a prompt here...",
        userPersonaChatHistory: userPersonaChatHistory
    });
});

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

router.post('/dialogue/chat', async (req, res) => {
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
        // console.log(message);
    }
}

saveBotResponse();




module.exports = router;