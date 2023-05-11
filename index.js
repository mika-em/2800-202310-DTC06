const url = require('url');
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users"); // require the users.js file
const Joi = require("joi");
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const navLinks = [
  { name: 'Home', link: '/', upperName: 'HOME', description: 'Lorem ipsum dolor'},
  { name: 'Persona', link: '/persona', upperName: 'PERSONA', description: 'Lorem ipsum dolor' },
  { name: 'Dialogue', link: '/dialogue', upperName: 'DIALOGUE', description: 'Lorem ipsum dolor' },
  { name: 'Saved', link: '/saved', upperName: 'SAVED', description: 'Lorem ipsum dolor' },
  { name: 'Profile', link: '/profile', upperName: 'PROFILE', description: 'Lorem ipsum dolor' },
];

const personaLinks = [
  { name: 'General prompt presets', link: '/persona/general-prompt' },
  { name: 'Saved prompt presets', link: '/persona/saved-prompt' },
  { name: 'Create a new prompt preset', link: '/persona/new-prompt' },
  { name: 'Write my own prompt', link: '/persona/chat' },
];

// placeholder for db for chatPrompt/chatHistory
var chatPrompt = ["test"];
var savedPromptParameter = ["hello", "world", "test"];

app.use('/', (req, res, next) => {
  app.locals.navLinks = navLinks;
  app.locals.personaLinks = personaLinks;
  app.locals.chatPrompt = chatPrompt;
  app.locals.savedPromptParameter = savedPromptParameter;
  app.locals.currentURL = url.parse(req.url).pathname;
  next();
});

mongoose
  .connect(
    "mongodb+srv://mika-em:wabisabi@teamcluster.hnn9rvs.mongodb.net/?retryWrites=true&w=majority",
    {
      // connect to the database
      useNewUrlParser: true, // this is to avoid deprecation warnings
    }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });

app.use(
  express.urlencoded({
    extended: false,
  })
); // this is to parse the body of the request

app.use(express.json());

//index page
app.get("/", (req, res) => {
    res.render("index");
});

//signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

//signup route
app.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    await User.create({
      name: name,
      username: username,
      password: password,
    });
    console.log("User created");

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating your account.");
  }
});

//login page
app.get("/login", (req, res) => {
  res.render("login");
});

//login route
app.post("/loginUser", async (req, res) => {
  const schema = Joi.object({
    password: Joi.string(),
  });

  try {
    console.log(req.body.password);
    const value = await schema.validateAsync({
      password: req.body.password,
    });
  } catch (err) {
    console.log(err);
    console.log("The password has to be a string");
    return;
  }

  try {
    const result = await User.findOne({
      username: req.body.username,
    });
    if (req.body.password == result.password) {
      console.log("User authenticated");
      res.redirect("/");
    } else {
      res.send("wrong password");
    }
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(__dirname + "/")); // this is to serve static files like images

app.get('/home', (req, res) => {
    res.render("home");
});

app.get('/profile', (req, res) => {
    res.render("profile");
});

app.get('/persona', (req, res) => {
    res.render("persona");
});

app.get('/persona/general-prompt', (req, res) => {
    console.log(chatPrompt)
    res.render("generalPrompt");
});

app.post('/persona/general-prompt', (req, res) => {
    const name = req.body.name || "random";
    const age = req.body.age || "random";
    const gender = req.body.gender || "random";
    const situation = req.body.plot || "random";
    const plot = req.body.plot || "random";

    const message = `Generate a ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting where they are faced with ${situation}.`;
    chatPrompt.push("You: " + message);
    chatPrompt.push("hello");
    console.log(chatPrompt)

    // placeholder for db for chatPrompt/chatHistory
    res.redirect('/persona/chat');
});

app.get('/persona/saved-prompt', (req, res) => {
    res.render("savedPrompt");
});

app.get('/persona/new-prompt', (req, res) => {
    res.render("newPrompt");
});

app.post('/persona/new-prompt', (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    const parameter = req.body.parameter;
    savedPromptParameter.push(parameter);
    console.log(savedPromptParameter);
    res.render("newPrompt");
});

app.get('/persona/chat', (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    console.log(chatPrompt);
    res.render("chat");
});

app.post('/persona/chat', (req, res) => {
    // placeholder for db for chatPrompt/chatHistory
    const message = req.body.message;
    chatPrompt.push("You: " + message);
    console.log(chatPrompt);
    res.render("chat");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
