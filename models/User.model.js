const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    name: String,
    email: String,
    password: String,
    texts: [
      {
        _id: mongoose.Types.ObjectId,
        title: String,
        added: Date,
        content: String,
        targetWordObjs: [
          {
            _id: mongoose.Types.ObjectId,
            word: String,
            sentence: Number,
            element: Number,
            audio: String,
            isPlural: Boolean,
            singularForm: String,
            wordType: String,
            infinitiveForm: String,
            positiveForm: String,
            definition: String
          }
        ]
      }
    ],
    completedTexts: [String]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", User);
