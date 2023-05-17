const app = express();
const express = require("express"); 
const database = require("./src/database"); // Database Connection
const sessionConfig = require("./src/session"); // Session Configuration
const middleware = require('./src/middleware'); // Middleware Configuration
const authRoutes = require("./routes/authorization"); // includes login, signup, logout, password reset, index, and home
const profileRoutes = require("./routes/profile"); // includes profile, account settings, and update account settings
const persona = require("./routes/persona"); // includes persona and saved personas

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(sessionConfig);

// Routes
app.use(middleware);
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", persona);

// Database & Port Connection
database.connect();

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});

app.use(express.static(__dirname + "/"));

module.exports = app;