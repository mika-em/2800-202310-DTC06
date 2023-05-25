const express = require("express"); 
const app = express();
const $ = require('jquery');
const path = require('path');
const database = require("./src/database"); // Database Connection
const sessionConfig = require("./src/session"); // Session Configuration
const middleware = require('./src/middleware'); // Middleware Configuration
const authRoutes = require("./routes/authorization"); // includes login, signup, logout, password reset, index, and home
const profileRoutes = require("./routes/profile"); // includes profile, account settings, and update account settings
const persona = require("./routes/persona"); // includes persona and saved personas
const infoRoutes = require("./routes/info"); // includes about us, FAQ and contact us
const saved = require("./routes/saved"); // includes saved personas, dialogues, and filters
// const persona = require("./routes/persona"); // includes persona and saved persona
const dialogue = require("./routes/dialogue"); // includes dialogue and saved dialogue
const personaToDialogue = require("./routes/personaToDialogue"); // includes routes from saved persona to dialogue

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(sessionConfig);
app.use(express.static('public'));


// Routes
app.use(middleware);
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", persona);
app.use("/", dialogue)
app.use("/", infoRoutes);
app.use("/", saved);
app.use("/", dialogue);
app.use("/", personaToDialogue);

// Database & Port Connection
database.connect();

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});


// Serve JS files from the "public/js" directory
app.use(express.static(__dirname + "/"));

//404 page not found 
app.get("*", (req, res) => {
    res.render("../views/error/404");
});

app.post("/404", (req, res) => {
    res.status(404).redirect("/");
});

module.exports = app;