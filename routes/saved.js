const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Persona = require("../models/personaList");

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

    res.render("../views/saved/saved-persona", { savedPersona: savedPersona });
});

let personaList = [];

router.use('/persona', async (req, res, next) => {
    req.session.personaList = personaList;
    next();
});

router.post('/persona/saved-persona/dialogue-filters', (req, res) => {
    const persona = req.body.persona
    console.log(persona);
    personaList.push(persona);

    res.render("../views/saved/saved-dialogue-filters");
});

module.exports = router;