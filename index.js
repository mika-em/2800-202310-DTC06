const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/users"); // require the users.js file
const Joi = require("joi");
const app = express();
const port = process.env.PORT || 3000;

mongoose
  .connect(
    "mongodb+srv://mika-em:wabisabi@teamcluster.hnn9rvs.mongodb.net/?retryWrites=true&w=majority",
    {
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

app.set("view engine", "ejs");

app.use(
  express.urlencoded({
    extended: false,
  })
); // this is to parse the body of the request

app.use(express.json());

//index page
app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/index.html");
  res.render("index");
});

//signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

//signup route
app.post("/signup", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    await User.create({
      name: name,
      username: username,
      password: password,
    });
    console.log("User created");

    res.redirect("/login");
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
  const schema = Joi.object({
    password: Joi.string(),
  });

  try {
    console.log(req.body.password);
    const value = await schema.validateAsync({
      password: req.body.password,
    });
  } catch (err) {
    console.log(err);
    console.log("The password has to be a string");
    return;
  }

  try {
    const result = await User.findOne({
      username: req.body.username,
    });
    if (req.body.password == result.password) {
      console.log("User authenticated");
      res.redirect("/");
    } else {
      res.send("wrong password");
    }
  } catch (error) {
    console.log(error);
  }
});

app.use(express.static(__dirname + "/")); // this is to serve static files like images

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
