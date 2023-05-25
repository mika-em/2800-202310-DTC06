const url = require('url');

module.exports = (req, res, next) => {
    res.locals.navLinks = navLinks;
    res.locals.personaLinks = personaLinks;
    res.locals.currentURL = url.parse(req.url).pathname;
    res.locals.dialogueLinks = dialogueLinks;
    res.locals.dialogueFilters = dialogueFilters;
    res.locals.savedPersonaDialogueFilters = savedPersonaDialogueFilters;
    res.locals.filters = filters;
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
    icon: 'fa-solid fa-person-dots-from-line fa-lg',
    upperName: 'PERSONA',
    description: 'Create a character with unique personality traits and a backstory.'
},
{
    name: 'Dialogue',
    link: '/dialogue',
    icon: 'fa-solid fa-comment-dots fa-lg',
    upperName: 'DIALOGUE',
    description: 'Create a conversation between two characters.'
},
{
    name: 'Saved',
    link: '/saved',
    icon: 'fa-solid fa-book-bookmark fa-lg',
    upperName: 'SAVED',
    description: 'Save your character prompts, dialogue scripts, and unique prompts.'
},
{
    name: 'Profile',
    link: '/profile',
    icon: 'fa-solid fa-circle-user fa-lg',
    upperName: 'PROFILE',
    description: 'Access your profile and account settings.'
},
];

const personaLinks = [{
    name: 'General presets',
    icon: 'fa-solid fa-user-astronaut fa-2xl',
    link: '/persona/general-prompt'
},
{
    name: 'Saved presets',
    icon: 'fa-solid fa-floppy-disk fa-2xl',
    link: '/persona/saved-prompt'
},
{
    name: 'Create a new preset',
    icon: 'fa-solid fa-circle-plus fa-2xl',
    link: '/persona/new-prompt'
},
{
    name: 'Write my own preset',
    icon: 'fa-solid fa-pen-to-square fa-2xl',
    link: '/persona/chat'
},
];

const dialogueLinks = [{
    name: 'Start a new dialogue',
    icon: 'fa-solid fa-comment-medical fa-2xl',
    link: '/dialogueFilters'
},
{
    name: 'Saved dialogues',
    icon: 'fa-solid fa-heart fa-2xl"',
    link: '/persona/saved-dialogue'
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
const filters = [{
    name: 'Default',
    icon: 'fa-solid fa-circle fa-2xl',
},
{
    name: 'Status',
    icon: 'fa-solid fa-circle fa-2xl',
},
{
    name: 'Class',
    icon: 'fa-solid fa-circle fa-2xl',
},
{
    name: 'Drop',
    icon: 'fa-solid fa-circle fa-2xl',
},
{
    name: 'Race',
    icon: 'fa-solid fa-circle fa-2xl',
}];
