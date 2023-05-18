const express = require("express");
const router = express.Router();
const openai = require('openai');


openai.apiKey = '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'

router.get('/dialogue', (req, res) => {
    res.render("dialogueHome");
});

router.get('/dialogue/new', (req, res) => {
    res.render("startNewDialogue");
});

router.get('/dialogueFilters', (req, res) => {
    res.render("dialogueFilters", {
        output: null
    });
});

router.get('/dialogue/inner-dialogue', (req, res) => {
    res.render("dialogue-chat", {placeholderText: "Start an inner dialogue."});
});
router.get('/dialogue/conversation', (req, res) => {
    res.render("innerDialogue");
});
router.get('/dialogue/user-persona-chat', (req, res) => {
    res.render("innerDialogue");
});

router.post("/dialogue/inner-dialogue", (req, res) => {
});
router.post("/dialogue/inner-dialogue", (req, res) => {
});
router.post("/dialogue/inner-dialogue", (req, res) => {
});


router.post('/dialogue/new', (req, res) => {});

router.get('/dialogue/saved', (req, res) => {
    res.render("savedDialogue");
});

router.post('/dialogue/saved', (req, res) => {});




router.post('/dialogueFilters', async (req, res) => {
    const button = req.query.button;

    try {
        const output = await generateResponse(button);
        res.render('dialogueTheme', {
            output
        });
    } catch (error) {
        res.render('dialogueTheme', {
            output: error.message
        });
    }
});


router.post('/dialogue/pick-a-theme', (req, res) => {

});

router.get('/dialogue/pick-a-theme/inner-dialogue', (req, res) => {
    res.render("innerDialogue");
});

router.post('dialogue/pick-a-theme/inner-dialogue', (req, res) => {
    const theme = req.body.theme;
    console.log(theme);
    res.render("innerDialogue");
});

router.get('/dialogue/pick-a-theme/talk-to-another-character', (req, res) => {
    res.render("talkToAnotherCharacter");
});

router.post('dialogue/pick-a-theme/talk-to-another-character', (req, res) => {
    const theme = req.body.theme;
    console.log(theme);
    res.render("talkToAnotherCharacter");
});

router.get('/dialogue/pick-a-theme/chat-with-yourself', (req, res) => {
    res.render("chatWithYourself");
});

router.post('dialogue/pick-a-theme/chat-with-yourself', (req, res) => {
    const theme = req.body.theme;
    console.log(theme);
    res.render("chatWithYourself");
});


// Function to generate AI response based on the selected button
async function generateResponse(button) {
    // Define the input prompt based on the selected button
    let prompt;
    if (button === 'Inner Dialogue') {
        prompt = 'Generate inner dialogue from persona.';
    } else if (button === 'Conversation') {
        prompt = 'Generate conversation between two personas.';
    } else if (button === 'User-Persona Chat') {
        prompt = 'Have a chat between the user and a persona.';
    } else {
        return 'Invalid button selection.';
    }

    // Generate AI response using OpenAI API
    const response = await openai.complete({
        engine: `gpt-3.5-turbo`, // davinci, curie, babbage, ada, or davinci-instruct-beta
        prompt: prompt,
        max_tokens: 50, // Adjust the desired length of the response
    });

    return response.choices[0].text.trim();
}

module.exports = router;