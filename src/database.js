const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_url = `mongodb+srv://${mongodb_user}:${mongodb_password}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority`;

async function connect() {
    try {
        await mongoose.connect(mongodb_url);
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

module.exports = {connect};