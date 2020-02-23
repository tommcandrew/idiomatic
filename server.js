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

app.use(fileUpload());

app.post("/upload", async (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  let fileContent;
  console.log(file.mimetype);
  if (file.mimetype === "application/pdf") {
    console.log("file is pdf");
    const data = await pdf(file.data);
    fileContent = data.text;
  } else {
    console.log("file is not pdf");
    fileContent = file.data.toString("utf8");
  }

  console.log(fileContent);
  const text = new Text({ title: file.name, content: fileContent });

  text.save().then(() => {
    console.log("text saved");
  });

  // file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send(err);
  //   }
  //   res.json({
  //     fileName: file.name,
  //     fileContent: fileContent,
  //     filePath: `/uploads/${file.name}`
  //   });
  // });
});

app.listen(5000, () => console.log("listening on port 5000"));
