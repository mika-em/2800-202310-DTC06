const express = require("express");
const app = express();
const authRoutes = require("./routes/authorization");
const profileRoutes = require("./routes/profile");
const database = require("./src/database");
const sessionConfig = require("./src/session");
const middleware = require('./src/middleware'); 
const persona = require("./routes/persona");


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