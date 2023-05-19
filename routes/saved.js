const express = require("express");
const router = express.Router();

router.get("/saved", (req, res) => {
  res.render("../views/saved/saved");
});

router.get("/filters", (req, res) => {
  res.render("../views/saved/filters");
});

router.get("/saved/dialogue", (req, res) => {
  res.render("../views/saved/saved-dialogue");
});

router.get("/saved/persona", (req, res) => {
  res.render("../views/saved/saved-persona");
});

module.exports = router;
