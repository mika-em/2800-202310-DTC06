const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const User = require("../models/users").usersModel;
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();

const configuration = new Configuration({
    organization: "org-wZOT14YD6omEzAgdgaFU5gz3",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.get('/persona', (req, res) => {
    res.render("./persona/persona");
});

router.get('/persona/general-prompt', (req, res) => {
    console.log(chatPrompt)
    res.render("./persona/generalPrompt");
});

router.post("/persona/general-prompt", (req, res) => {
  const name = req.body.name || "random";
  const age = req.body.age || "random";
  const gender = req.body.gender || "random";
  const situation = req.body.plot || "random";
  const plot = req.body.plot || "random";

  const message = `Generate a ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting where they are faced with ${situation}.`;
  chatPrompt.push("You: " + message);
  chatPrompt.push("hello");
  console.log(chatPrompt);

  // placeholder for db for chatPrompt/chatHistory
  res.redirect("/persona/chat", { placeholderText: "Write a prompt here..." });
});

router.get('/persona/saved-prompt', (req, res) => {
    res.render("./persona/savedPrompt");
});

router.get('/persona/new-prompt', (req, res) => {
    res.render("./persona/newPrompt");
});

router.post('/persona/new-prompt', (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    const parameter = req.body.parameter;
    savedPromptParameter.push(parameter);
    console.log(savedPromptParameter);
    res.render("./persona/newPrompt");
});

router.get('/persona/chat', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const personaHistory = currentUser.personaHistory

    res.render("chat", {
        placeholderText: "Write a prompt here...",
        personaHistory: personaHistory
    });
});

router.post('/persona/chat', async (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    // const message = req.body.message;
    // chatPrompt.push("You: " + message);
    // console.log(chatPrompt);
    // res.render("chat");


    // try {
    //     const {
    //         prompt
    //     } = req.body;

    //     // Make a request to the Chat Completions API endpoint
    //     const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    //         model: 'gpt-3.5-turbo',
    //         messages: [{
    //             role: 'system',
    //             content: 'You are a persona generator.'
    //         }, {
    //             role: 'user',
    //             content: prompt
    //         }],
    //     }, {
    //         headers: {
    //             'Authorization': 'Bearer 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',
    //             'Content-Type': 'application/json',
    //         },
    //     });

        const {
            Configuration,
            OpenAIApi
        } = require("openai");

        const configuration = new Configuration({
            apiKey: "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",
        });
        const openai = new OpenAIApi(configuration);

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: 'system',
                content: 'You are a persona generator.'
            }, {
                role: 'user',
                content: req.body
            }],
        });
        console.log(completion.data.choices[0].message);
    });



        // Process the response and extract the generated message
//         const {
//             choices
//         } = response.data;
//         const generatedMessage = choices[0].message.content;

//         res.json({
//             message: generatedMessage
//         });
//     } catch (error) {
//         console.error('Error generating persona:', error);
//         res.status(500).json({
//             error: 'Failed to generate persona'
//         });
//     }
// });


var chatPrompt = ["test"];
var savedPromptParameter = ["hello", "world", "test"];

module.exports = router;
