const url = require('url');

module.exports = (req, res, next) => {
    res.locals.navLinks = navLinks;
    res.locals.personaLinks = personaLinks;
    res.locals.currentURL = url.parse(req.url).pathname;
    res.locals.dialogueLinks = dialogueLinks;
    res.locals.dialogueFilters = dialogueFilters;
    res.locals.savedPersonaDialogueFilters = savedPersonaDialogueFilters;
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
    icon: 'border_color',
    upperName: 'PERSONA',
    description: 'Create a character with unique personality traits and a backstory.'
},
{
    name: 'Dialogue',
    link: '/dialogue',
    icon: 'forum',
    upperName: 'DIALOGUE',
    description: 'Create a conversation between two characters.'
},
{
    name: 'Saved',
    link: '/saved',
    icon: 'collections_bookmark',
    upperName: 'SAVED',
    description: 'Save your character prompts, dialogue scripts, and unique prompts.'
},
{
    name: 'Profile',
    link: '/profile',
    icon: 'account_circle',
    upperName: 'PROFILE',
    description: 'Access your profile and account settings.'
},
];

const personaLinks = [{
    name: 'General presets',
    link: '/persona/general-prompt'
},
{
    name: 'Saved presets',
    link: '/persona/saved-prompt'
},
{
    name: 'Create a new preset',
    link: '/persona/new-prompt'
},
{
    name: 'Write my own preset',
    link: '/persona/chat'
},
];

const dialogueLinks = [{
    name: 'Start a new dialogue',
    link: '/dialogueFilters'
},
{
    name: 'Saved dialogues',
    link: '/saved/dialogue'
}
];

const dialogueFilters = [{
    name: 'Inner Dialogue',
    link: '/dialogue/inner-dialogue' 
},
{
    name: 'User & Persona Conversation',
    link: '/dialogue/user-persona-chat' 
},
{
    name: 'Persona to Persona Conversation',
    link: '/dialogue/persona-to-persona-chat'
}];

const savedPersonaDialogueFilters = [{
    name: 'Inner Dialogue',
    link: '/saved/persona/dialogue/inner-dialogue' 
},
{
    name: 'User & Persona Conversation',
    link: '/saved/persona/dialogue/user-persona-chat' 
},
{
    name: 'Persona to Persona Conversation',
    link: '/saved/persona/dialogue/persona-to-persona-chat'
}];


