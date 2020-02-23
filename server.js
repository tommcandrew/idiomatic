const express = require("express");
const fileUpload = require("express-fileupload");
const pdf = require("pdf-parse");
const mongoose = require("mongoose");
const Text = require("./models/Text.model");

mongoose.connect(
  "mongodb://localhost:27017/idiomatic",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  },
  () => console.log("connected to db")
);

const app = express();

app.use(express.json());

app.use(fileUpload());

app.post("/upload", async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  let content;
  if (file.mimetype === "application/pdf") {
    const data = await pdf(file.data);
    content = data.text;
  } else {
    content = file.data.toString("utf8");
  }
  const title = file.name.substr(0, file.name.length - 4);
  res.status(200).send({ title, content });
});

app.post("/saveText", (req, res) => {
  const { title, content, targetWords, targetSentences } = req.body;
  const text = new Text({ title, content, targetWords, targetSentences });
  text.save().then(() => {
    console.log("text saved");
    res.status(200).send();
  });
});

app.get("/savedTexts", (req, res) => {
  console.log("savedTexts request received");
  Text.find().then(texts => {
    res.status(200).send(texts);
  });
});

app.listen(5000, () => console.log("listening on port 5000"));
