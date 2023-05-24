const url = require('url');

module.exports = (req, res, next) => {
    res.locals.navLinks = navLinks;
    res.locals.personaLinks = personaLinks;
    res.locals.currentURL = url.parse(req.url).pathname;
    res.locals.dialogueLinks = dialogueLinks;
    res.locals.dialogueFilters = dialogueFilters;
    next();
};

const navLinks = [{
    name: 'Home',
    link: '/',
    icon: './images/invsona.png',
    upperName: 'HOME',
    description: 'Lorem ipsum dolor'
},
{
    name: 'Persona',
    link: '/persona',
    icon: './images/icons/persona.png',
    upperName: 'PERSONA',
    description: 'Create a character with unique personality traits and a backstory.'
},
{
    name: 'Dialogue',
    link: '/dialogue',
    icon: './images/icons/dialogue.png',
    upperName: 'DIALOGUE',
    description: 'Create a conversation between two characters.'
},
{
    name: 'Saved',
    link: '/saved',
    icon: './images/icons/saved.png',
    upperName: 'SAVED',
    description: 'Save your character prompts, dialogue scripts, and unique prompts.'
},
{
    name: 'Profile',
    link: '/profile',
    icon: './images/icons/profile.png',
    upperName: 'PROFILE',
    description: 'Access your profile and account settings.'
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

const dialogueLinks = [{
    name: 'Start a new dialogue',
    link: '/dialogueFilters',
    description: 'Create a fresh, new dialogue'
},
{
    name: 'Saved dialogues',
    link: '/persona/saved-dialogue',
    description: 'View your saved dialogues'
}
];

const dialogueFilters = [{
    name: 'Inner Dialogue',
    link: '/dialogue/inner-dialogue'
},
{
    name: 'User-Persona Chat',
    link: '/dialogue/user-persona-chat'
},
{
    name: 'Persona to Persona Chat',
    link: '/dialogue/persona-to-persona-chat'
}
];