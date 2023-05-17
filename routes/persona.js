const express = require("express");
const router = express.Router();
const axios = require("axios");

router.use("/persona", async (req, res, next) => {
  req.session.newParameter = newParameter;
  next();
});

router.get("/persona", (req, res) => {
  res.render("persona");
});

// General Prompt
router.get("/persona/general-prompt", (req, res) => {
  res.render("generalPrompt");
});

router.post("/persona/chat/general", async (req, res) => {
  const gender = req.body.gender || "random";
  const name = req.body.name || "random";
  const age = req.body.age || "random";
  const plot = req.body.plot || "random";

  const message = `Generate a ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting where they are faced with ${situation}.`;
  chatPrompt.push("You: " + message);
  chatPrompt.push("hello");
  //console.log(chatPrompt)

  res.render("chat", {
    placeholderText: "Write a prompt here...",
    personaHistory: personaHistory,
  });
});

// Saved Prompt Parameters
router.get("/persona/saved-prompt", async (req, res) => {
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const userID = currentUser._id;

  const savedPromptParameter = await Parameter.find({
    userId: userID,
  });

  console.log(savedPromptParameter);
  console.log(savedPromptParameter[0].parameterSet[0]);
  res.render("savedPrompt", { savedPromptParameter: savedPromptParameter });
});

// New Prompt Parameters
router.get("/persona/new-prompt", (req, res) => {
  res.render("newPrompt", { newParameter: newParameter });
});

router.post("/persona/new-prompt", (req, res) => {
  const parameter = req.body.parameter;
  newParameter.push(parameter);
  console.log(newParameter);
  res.render("newPrompt", { newParameter: newParameter });
});

router.post("/persona/new-prompt/delete", (req, res) => {
  const { index } = req.body;
  if (index >= 0 && index < newParameter.length) {
    newParameter.splice(index, 1);
    console.log(newParameter);
    res.render("newPrompt", { newParameter: newParameter });
  } else {
    res.status(400).send("Invalid index"); // Send an error response to the client
  }
});

router.post("/persona/new-prompt/saved", async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const parameterSet = newParameter;
  const date = new Date();

  const currentUser = await User.findOne({
    username: req.session.user.username,
  });

  await Parameter.create({
    userId: currentUser._id,
    title: title,
    description: description,
    parameterSet: parameterSet,
    date: date,
  });
  res.render("newPrompt", { newParameter: newParameter });
});

router.get("/persona/chat", async (req, res) => {
  const currentUser = await User.findOne({
    username: req.session.user.username,
  });
  const personaHistory = currentUser.personaHistory;

  res.render("chat", {
    placeholderText: "Write a prompt here...",
    personaHistory: personaHistory,
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

router.post("/persona/chat", async (req, res) => {
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

  const { Configuration, OpenAIApi } = require("openai");

  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a persona generator.",
      },
      {
        role: "user",
        content: req.body,
      },
    ],
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
