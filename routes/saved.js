const express = require("express");
const router = express.Router();

router.get('/saved', (req, res) => {
    res.render("../views/saved/saved");
});



module.exports = router;