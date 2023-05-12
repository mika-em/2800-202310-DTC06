const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users"); // require the users.js file
const Joi = require("joi");
const app = express();
const port = 3003;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const MongoStore = require("connect-mongo");

// connect to database
mongoose
  .connect(
    "mongodb+srv://mika-em:wabisabi@teamcluster.hnn9rvs.mongodb.net/?retryWrites=true&w=majority", {
      // connect to the database
      useNewUrlParser: true, // this is to avoid deprecation warnings
    }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database: ", error);
  });

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://mika-em:wabisabi@teamcluster.hnn9rvs.mongodb.net/?retryWrites=true&w=majority`,
  // mongoUrl: mongodb_host,

  crypto: {
    secret: "secret"
  }
})

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: false,
})); // parses bodies in urlencoded format

app.use(express.json()); // parses bodies in json format

//more session stuff
app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: false,
  store: mongoStore,
}), );

//index page
app.get("/", (req, res) => {
  res.render("index");
});

//signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

//signup route 
app.post("/signup", async (req, res) => {
  console.log("ejs set up");
  console.log("signup route")
  const {
    name,
    username,
    email,
    password
  } = req.body;

  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  try {
    await User.create({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    });
    req.session.user = {
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
    };
    console.log("User created");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating your account.");
  }
});


//login page
app.get("/login", (req, res) => {
  res.render("login");
});

//login route
app.post("/loginUser", async (req, res) => {
  const {
    loginName,
    password
  } = req.body;
  console.log(loginName, password)

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginName);

  const queryField = isEmail ? "email" : "username";
  
  console.log(`isEmail: ${isEmail}, queryField: ${queryField}`);
  
  const user = await User.findOne({
    [queryField]: loginName
  }).select('name username email password _id').exec();
  console.log(user);
  
  if (!user) {
    // If user is not found, return an error message
    return res.status(400).send("Invalid email/username or password.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    req.session.authenticated = true;

    return res.redirect("/");
  } else {
    return res.status(400).send("Invalid email/username or password.");
  }
});


app.use(express.static(__dirname + "/")); // this is to serve static files like images

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
