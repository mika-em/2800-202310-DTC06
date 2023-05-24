const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Persona = require("../models/personaList");
const pdfkit = require("pdfkit");
const fs = require("fs");

router.get('/saved', (req, res) => {
    res.render("../views/saved/saved");
});

router.get('/filters', (req, res) => {
    res.render("../views/saved/filters");
});

router.get('/saved/dialogue', (req, res) => {
    res.render("../views/saved/saved-dialogue");
});

// saved personas
router.get('/saved/persona', async (req, res) => {
    const currentUser = await User.findOne({
        username: req.session.user.username
    });
    const userID = currentUser._id;

    const savedPersona = await Persona.find({
        userId: userID
    });

    console.log(savedPersona)
    console.log(savedPersona[0].persona)

    res.render("../views/saved/saved-persona", {
        savedPersona: savedPersona
    });
});

let personaList = [];

router.use('/persona', async (req, res, next) => {
    req.session.personaList = personaList;
    next();
});

router.post('/persona/saved-persona/dialogue-filters', (req, res) => {
    const savedPersona = req.body.persona // persona is an array
    console.log("this is the saved persona" + savedPersona); 
    personaList.push(savedPersona);
    console.log("this is the persona list" + personaList);

    req.session.persona = savedPersona;
    console.log("this is the saved persona" + savedPersona);



    res.render("./dialogue/dialogueFilters", {
        output: null
    });
});

router.post('/saved/persona/save-as-pdf', (req, res) => {
    const personaList = req.body.personaList;
    console.log(personaList);

    // instantiate the library
    let doc = new pdfkit();

    // set font style
    doc.font('Courier');

    // pipe to a writable stream which would save the result into the same directory
    doc.pipe(fs.createWriteStream('your_personas.pdf'));

    doc.image('./images/invsona/invsona.png', {
        fit: [100, 100],
        align: 'center',
    });

    doc.text('Your Personas by Invsona', {
        bold: true,
        underline: true,
        align: 'center'
    });

    // Encode the personaList to handle special characters
    // const encodedPersonaList = personaList.replaceAll('/n', '<br>');

    doc.text(personaList, {
        align: 'center'
    });

    // write out file
    doc.end();

    // res.render("../views/saved/saved-persona");
    res.send("PDF saved")
});

//Saved Dialogue


module.exports = router;