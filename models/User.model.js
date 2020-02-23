const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  email: String,
  password: String,
  texts: [
    {
      title: String,
      content: String,
      targetWordObjs: [{}],
      targetWords: [String],
      targetSentences: [String]
    }
  ]
});

module.exports = mongoose.model("User", User);
