const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const dotenv = require('dotenv');
dotenv.config();

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const mongoStore = new MongoDBStore({
    uri: `mongodb+srv://${mongodb_user}:${mongodb_password}@cluster0.jzcviee.mongodb.net/?retryWrites=true&w=majority`,
    collection: 'sessions',
    crypto: {
        secret: mongodb_session_secret
    }
});

const sessionConfig = session({
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore,
});

module.exports = sessionConfig;