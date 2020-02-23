const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Text = new Schema({
  title: String,
  content: String
});

module.exports = mongoose.model("Text", Text);
