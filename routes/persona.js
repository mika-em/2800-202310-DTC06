const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

dotenv.config();

const configuration = new Configuration({
  organization: "org-IK9aHGvfAPS3zqJgEZurc5B7",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

router.use(express.json());
router.use(cors());
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

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3500, // 5 requests per minute
});

// debounce mechanism to prevent too many API calls
let typingTimeout;
let tokensUsed = 0;
const maxTokensPerRequest = 10;

router.post("/persona/chat", limiter, async (req, res) => {
  try {
    const prompt = req.body.prompt;

    clearTimeout(typingTimeout); // clear the timeout on every request

    // check if the response is available in the cache
    if (prompt in promptCache) {
      console.log("Response from cache");
      res.status(200).send({
        bot: promptCache[prompt],
      });
    } else {
      // Check if the remaining tokens can accommodate the request
      const remainingTokens = 90000 - tokensUsed;
      const tokensNeeded = prompt.length + maxTokensPerRequest;
      if (tokensNeeded > remainingTokens) {
        console.error("Token limit exceeded");
        res
          .status(429)
          .send({ error: "Token limit exceeded. Please try again later." });
        return;
      }

      typingTimeout = setTimeout(async () => {
        // wait for 500ms of inactivity before making the API call
        try {
          const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            prompt: `${prompt}`,
            temperature: 0.5,
            // max_tokens: 64,
            // top_p: 1,
            // frequency_penalty: 0.5,
            // presence_penalty: 0.5,
          });

          const botResponse = response.data.choices[0].text;

          // store the response in the cache
          promptCache[prompt] = botResponse;

          console.log("Response from API");
          res.status(200).send({
            bot: botResponse,
          });
          // Update the tokens used count
          tokensUsed += prompt.length + botResponse.length;
        } catch (error) {
          console.log("Error from OpenAI API", error);
          res.status(500).send({ error: "Failed to generate bot response" });
        }
      }, 500);
    }
  } catch (error) {
    console.log("Internal Server Error", error);
    res.status(500).send({ error });
  }
});

// var chatPrompt = ["test"];
// var savedPromptParameter = ["hello", "world", "test"];

module.exports = router;
