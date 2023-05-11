const url = require('url');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

const navLinks = [
    { name: 'Home', link: '/' },
    { name: 'Persona', link: '/persona' },
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

app.get('/', (req, res) => {
    res.render("home");
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