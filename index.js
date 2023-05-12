const url = require('url');
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users"); // require the users.js file
const Joi = require("joi");
const app = express();
const port = 3005;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const MongoStore = require("connect-mongo");
const expireTime = 24 * 60 * 60 * 1000;
app.set('view engine', 'ejs');

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

app.use('/', (req, res, next) => {
  app.locals.navLinks = navLinks;
  app.locals.personaLinks = personaLinks;
  app.locals.chatPrompt = chatPrompt;
  app.locals.savedPromptParameter = savedPromptParameter;
  app.locals.currentURL = url.parse(req.url).pathname;
  next();
});

mongoose
  .connect(
    "mongodb+srv://mika:mika@cluster0.jzcviee.mongodb.net/?retryWrites=true&w=majority", {
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
  mongoUrl: `mongodb+srv://mika:mika@cluster0.jzcviee.mongodb.net/?retryWrites=true&w=majority`,
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
  resave: false,
  saveUninitialized: false,
  store: mongoStore,
}),);

//index page
app.get("/", (req, res) => {
  res.render("index");
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
    req.session.user = {
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
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
    // If user is not found, return an error message
    return res.status(400).send("Invalid email/username or password.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  const name = user.name;


  if (passwordMatch) {
    req.session.authenticated = true;
    req.session.cookie.maxAge = expireTime;
    req.session.user = name


    return res.render("home", {
      name: name
    })
  } else {
    return res.status(400).send("Invalid email/username or password.");
  }
});

app.use(express.static(__dirname + "/")); // this is to serve static files like images


app.get('/resetPassword', (req, res) => {
  res.render("resetPassword",
    {
      email: "",
      securityQuestion: "",
      securityAnswer: "",
      password: "",
      disabled: true,
    }
  );
});

app.post('/resetPassword', async (req, res) => {
  try {
    console.log(req.body.email)
    userReset = await User.findOne({ email: req.body.email })
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
  userReset = await User.findOne({ email: req.body.email })
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
    await User.updateOne(
      { email: req.body.email },
      {
        $set: {
          password: hashedPassword,
        }
      })
    res.render('index')
  } catch (error) {
    res.status(500).send("An error occurred while creating your account.");
  }
});

app.get('/home', (req, res) => {
  res.render("home", {
    // name: req.session.user.name,
  });
});

app.get('/profile', (req, res) => {
  res.render("profile", {
    // name: req.session.user.name
  });
});

app.get('/profile/account-setting', async (req, res) => {
  const currentUser = await User.findOne({
    username: "mika"
  });
  const name = currentUser.name;
  const username = currentUser.username;
  const email = currentUser.email;
  const securityQuestion = currentUser.securityQuestion;
  const securityAnswer = currentUser.securityAnswer;
  console.log(securityAnswer)
  res.render("accountsetting", {
    name: name,
    username: username,
    email: email,
    securityQuestion: securityQuestion,
    securityAnswer: securityAnswer,
    disabled: true
  });
});

app.post('/profile/account-setting', async (req, res) => {
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
    res.render("accountsetting", {
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
    res.render("accountsetting", {
      name: name,
      username: username,
      email: email,
      securityQuestion: securityQuestion,
      securityAnswer: securityAnswer,
      disabled: true
    });
  }
});

app.get('/persona', (req, res) => {
  res.render("persona");
});

app.get('/persona/general-prompt', (req, res) => {
  console.log(chatPrompt)
  res.render("generalPrompt");
});

app.post('/persona/general-prompt', (req, res) => {
  const name = req.body.name || "random";
  const age = req.body.age || "random";
  const gender = req.body.gender || "random";
  const situation = req.body.plot || "random";
  const plot = req.body.plot || "random";

  const message = `Generate a ${gender} character whose name is ${name} and age is ${age}, and is in a ${plot} setting where they are faced with ${situation}.`;
  chatPrompt.push("You: " + message);
  chatPrompt.push("hello");
  console.log(chatPrompt)

  // placeholder for db for chatPrompt/chatHistory
  res.redirect('/persona/chat');
});

app.get('/persona/saved-prompt', (req, res) => {
  res.render("savedPrompt");
});

app.get('/persona/new-prompt', (req, res) => {
  res.render("newPrompt");
});

app.post('/persona/new-prompt', (req, res) => {
  // placeholder for db for chatPrompt/chatHistory
  const parameter = req.body.parameter;
  savedPromptParameter.push(parameter);
  console.log(savedPromptParameter);
  res.render("newPrompt");
});

app.get('/persona/chat', (req, res) => {
  // placeholder for db for chatPrompt/chatHistory
  console.log(chatPrompt);
  res.render("chat");
});

app.post('/persona/chat', (req, res) => {
  // placeholder for db for chatPrompt/chatHistory
  const message = req.body.message;
  chatPrompt.push("You: " + message);
  console.log(chatPrompt);
  res.render("chat");
});


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render("logout");
});

app.post('/signout', (req, res) => {
  res.render("index")
});

app.use(express.static(__dirname + "/"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});