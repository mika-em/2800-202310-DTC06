const url = require('url');

module.exports = (req, res, next) => {
    res.locals.navLinks = navLinks;
    res.locals.personaLinks = personaLinks;
    res.locals.chatPrompt = chatPrompt;
    res.locals.savedPromptParameter = savedPromptParameter;
    res.locals.currentURL = url.parse(req.url).pathname;
    next();
};

const navLinks = [{
        name: 'Home',
        link: '/',
        upperName: 'HOME',
        description: 'Lorem ipsum dolor'
    },
    {
        name: 'Persona',
        link: '/persona',
        upperName: 'PERSONA',
        description: 'Lorem ipsum dolor'
    },
    {
        name: 'Dialogue',
        link: '/dialogue',
        upperName: 'DIALOGUE',
        description: 'Lorem ipsum dolor'
    },
    {
        name: 'Saved',
        link: '/saved',
        upperName: 'SAVED',
        description: 'Lorem ipsum dolor'
    },
    {
        name: 'Profile',
        link: '/profile',
        upperName: 'PROFILE',
        description: 'Lorem ipsum dolor'
    },
];

const personaLinks = [{
        name: 'General prompt presets',
        link: '/persona/general-prompt'
    },
    {
        name: 'Saved prompt presets',
        link: '/persona/saved-prompt'
    },
    {
        name: 'Create a new prompt preset',
        link: '/persona/new-prompt'
    },
    {
        name: 'Write my own prompt',
        link: '/persona/chat'
    },
];

// placeholder for db for chatPrompt/chatHistory
var chatPrompt = ["test"];
var savedPromptParameter = ["hello", "world", "test"];


