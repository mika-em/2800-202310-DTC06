const express = require("express");
const router = express.Router();

//access to About Us page
router.get("/about-us", (req, res) => {
    res.render("../views/profile/aboutUs");
});

//access to FAQ page
router.get("/faq", (req, res) => {
    res.render("../views/profile/faq");
});

module.exports = router;