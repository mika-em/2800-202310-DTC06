const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,
    username: String,
    password: String,
    email: String,
    securityQuestion: String,
    securityAnswer: String,
    personaHistory: Array,
    dialogueHistory: Array,
    profilePicture: {
        fileName: String,
        contentType: String,
    },
    filter: {
      default: Boolean,
      status: Boolean,
      class: Boolean,
      drop: Boolean,
      race: Boolean,
    },
  },
  // this is the name of the collection in the database
  { collection: "users" }
);


const dialogueModel = mongoose.model("Dialogue", dialogueSchema);
const dialogueModel = mongoose.model("Dialogue", dialogueSchema);

module.exports = {
  usersModel,
  dialogueModel,
  usersModel,
  dialogueModel,
};
