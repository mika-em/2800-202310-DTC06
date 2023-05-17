const url = require('url');
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const expireTime = 24 * 60 * 60 * 1000;

const app = express();
app.set('view engine', 'ejs');
app.use(express.json());

app.set("view engine", "ejs");

var MongoDBStore = require('connect-mongodb-session')(session);

const dotenv = require('dotenv');
dotenv.config();


// secret info
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
// const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

var mongoStore = new MongoDBStore({
  uri: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.jzcviee.mongodb.net/?retryWrites=true&w=majority`,
  collection: 'sessions',

  crypto: {
    secret: mongodb_session_secret
  }
})

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.jzcviee.mongodb.net/?retryWrites=true&w=majority`);

  console.log("connected to db");
  app.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
  });
}


app.use(express.urlencoded({
  extended: false,
}));

//more session stuff
app.use(
  session({
    secret: node_session_secret,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
  })
);


//index page
app.get("/", (req, res) => {
  res.render("index");
});

app.use('/', (req, res, next) => {
  app.locals.navLinks = navLinks;
  app.locals.personaLinks = personaLinks;
  app.locals.chatPrompt = chatPrompt;
  app.locals.savedPromptParameter = savedPromptParameter;
  app.locals.currentURL = url.parse(req.url).pathname;
  next();
});

app.get("/index", (req, res) => {
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
    password,
    securityQuestion,
    securityAnswer,
  } = req.body;

  const hashedPassword = await bcrypt.hashSync(password, saltRounds);

  try {
    await User.create({
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
    });
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
    password,
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
    return res.status(400).send("Invalid email/username or password.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    req.session.authenticated = true;
    req.session.cookie.maxAge = expireTime;
    req.session.user = {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
      securityQuestion: user.securityQuestion,
      securityAnswer: user.securityAnswer
    };

    console.log(req.session.user.name)

    return res.render("home", {
      name: req.session.user.name,

    })
  } else {
    return res.status(400).send("Invalid email/username or password.");
  }
});


app.get('/resetPassword', (req, res) => {
  res.render("resetPassword", {
    email: "",
    securityQuestion: "",
    securityAnswer: "",
    password: "",
    disabled: true,
  });
});

app.post('/resetPassword', async (req, res) => {
  try {
    console.log(req.body.email)
    userReset = await User.findOne({
      email: req.body.email
    })
    console.log(userReset)
    res.render('resetPassword', {
      email: req.body.email,
      securityQuestion: userReset.securityQuestion,
      securityAnswer: "",
      password: "",
      disabled: true,
    })
  } catch (error) {
    return res.status(400).send("Invalid email.");
  }
});

app.post('/resetPassword/verified', async (req, res) => {
  userReset = await User.findOne({
    email: req.body.email
  })
  const securityAnswer = userReset.securityAnswer
  console.log(securityAnswer)
  if (securityAnswer === req.body.securityAnswer) {
    res.render('resetPassword', {
      email: req.body.email,
      securityQuestion: userReset.securityQuestion,
      securityAnswer: userReset.securityAnswer,
      password: "",
      disabled: false,
    })
  } else {
    res.send("Incorrect answer to security question.");
  }
});

app.post('/', async (req, res) => {
  const password = req.body.password;
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);
  try {
    await User.updateOne({
      email: req.body.email
    }, {
      $set: {
        password: hashedPassword,
      }
    })
    res.render('index')
  } catch (error) {
    res.status(500).send("An error occurred while creating your account.");
  }
});

app.get('/', (req, res) => {
  res.render("home", {
    name: req.session.user.name,
  });
});

app.get('/profile', (req, res) => {
  res.render("profile", {
    name: req.session.user.name,
  });
});

app.get('/profile/account-settings', async (req, res) => {
  const currentUser = await User.findOne({
    username: "mika"
  });
  const name = currentUser.name;
  const username = currentUser.username;
  const email = currentUser.email;
  const securityQuestion = currentUser.securityQuestion;
  const securityAnswer = currentUser.securityAnswer;
  console.log(securityAnswer)
  res.render("accountSettings", {
    name: name,
    username: username,
    email: email,
    securityQuestion: securityQuestion,
    securityAnswer: securityAnswer,
    disabled: true
  });
});

app.post('/profile/account-settings', async (req, res) => {
  const usernameInput = "mika"
  if (req.body.action === "Edit") {
    console.log("edit")
    console.log(usernameInput)
    const currentUser = await User.findOne({
      username: usernameInput
    });
    const name = currentUser.name;
    const username = currentUser.username;
    const email = currentUser.email;
    const securityQuestion = currentUser.securityQuestion;
    const securityAnswer = currentUser.securityAnswer;
    res.render("accountSettings", {
      name: name,
      username: username,
      email: email,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      disabled: false
    });
  } else if (req.body.action === "Save") {
    console.log("save")
    const nameInput = req.body.name
    const emailInput = req.body.email
    const securityQuestionInput = req.body.securityQuestion
    const securityAnswerInput = req.body.securityAnswer
    console.log(nameInput)
    console.log(usernameInput)
    await User.updateOne({
      username: usernameInput
    }, {
      $set: {
        name: nameInput,
        email: emailInput,
        securityQuestion: securityQuestionInput,
        securityAnswer: securityAnswerInput
      }
    })
    const currentUser = await User.findOne({
      username: usernameInput
    });
    const name = currentUser.name;
    const username = currentUser.username;
    const email = currentUser.email;
    const securityQuestion = currentUser.securityQuestion;
    const securityAnswer = currentUser.securityAnswer;
    res.render("accountSettings", {
      name: name,
      username: username,
      email: email,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      disabled: true
    });
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render("logout");
});

app.post('/signout', (req, res) => {
  res.render("index")
});


app.use(express.static(__dirname + "/"));

const navLinks = [{
    name: 'Home',
    link: '/',
    upperName: 'HOME',
    description: 'Lorem ipsum dolor'
  },
  {
    name: 'Persona',
    link: '/persona',
    upperName: 'PERSONA',
    description: 'Lorem ipsum dolor'
  },
  {
    name: 'Dialogue',
    link: '/dialogue',
    upperName: 'DIALOGUE',
    description: 'Lorem ipsum dolor'
  },
  {
    name: 'Saved',
    link: '/saved',
    upperName: 'SAVED',
    description: 'Lorem ipsum dolor'
  },
  {
    name: 'Profile',
    link: '/profile',
    upperName: 'PROFILE',
    description: 'Lorem ipsum dolor'
  },
];

const personaLinks = [{
    name: 'General prompt presets',
    link: '/persona/general-prompt'
  },
  {
    name: 'Saved prompt presets',
    link: '/persona/saved-prompt'
  },
  {
    name: 'Create a new prompt preset',
    link: '/persona/new-prompt'
  },
  {
    name: 'Write my own prompt',
    link: '/persona/chat'
  },
];

// placeholder for db for chatPrompt/chatHistory
var chatPrompt = ["test"];
var savedPromptParameter = ["hello", "world", "test"];

module.exports = app;