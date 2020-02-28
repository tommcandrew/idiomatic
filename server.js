const express = require("express");
const fileUpload = require("express-fileupload");
const pdf = require("pdf-parse");
const mongoose = require("mongoose");
const User = require("./models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const dictionaryKey = "083cdcb6-cd9f-4856-a7b6-21c474d149c8";
const pluralize = require("pluralize");
const fs = require("fs");

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

const verifyToken = (req, res, next) => {
  const bearer = req.headers["authorization"];
  const bearerHeader = bearer.split(" ");
  const token = bearerHeader[1];
  if (token) {
    jwt.verify(token, "secretkey", (err, tokenData) => {
      if (err) {
        res.status(403).send("Forbidden");
      } else {
        req.tokenData = tokenData;
        next();
      }
    });
  }
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then(user => {
    if (!user) {
      res.status(403).send("That email is not registered");
    } else {
      bcrypt.compare(password, user.password, (err, isSame) => {
        if (err) {
          res.status(403).send("Problem comparing the passwords");
        } else {
          if (!isSame) {
            res.status(403).send("Wrong password");
          } else {
            jwt.sign({ user }, "secretkey", (err, token) => {
              res.status(200).send({
                token: token,
                userName: user.name,
                registerDate: user.createdAt
              });
            });
          }
        }
      });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  if (password.length < 8) {
    res.status(500).send();
    return;
  }
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/.test(email) === false) {
    res.status(400).send("Please enter a valid email address");
    return;
  }
  if (password !== password2) {
    res.status(400).send("Passwords must match");
    return;
  }
  User.findOne({ email }).then(user => {
    if (user) {
      res.status(403).send("That email is already registered");
      return;
    }
  });
  const user = new User({ name, email, password });
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      user.save().then(user => {
        jwt.sign({ user }, "secretkey", (err, token) => {
          res.send({ token, registerDate: user.createdAt });
        });
      });
    });
  });
});

app.get("/checkAuth", verifyToken, (req, res) => {
  res.status(200).send(req.tokenData);
});

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

app.post("/saveText", verifyToken, (req, res) => {
  const {
    title,
    content,
    targetWords,
    targetWordObjs,
    targetSentences
  } = req.body;
  const text = {
    title,
    content,
    targetWords,
    targetWordObjs,
    targetSentences
  };
  const email = req.tokenData.user.email;

  User.findOne({ email })
    .then(user => {
      user.texts.push(text);
      user.save().then(() => {
        // res.status(200).send("Text saved");
        fs.writeFile("text.txt", JSON.stringify(text), () =>
          console.log("text written")
        );
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/savedTexts", verifyToken, (req, res) => {
  const email = req.tokenData.user.email;
  User.findOne({ email })
    .then(user => {
      res.status(200).send(user.texts);
    })
    .catch(err => {
      console.log(err);
    });
});

//why can't I see the req.body with axios.post?
app.post("/deleteAccount", verifyToken, (req, res) => {
  const { email } = req.body;
  User.findOneAndDelete({ email })
    .then(() => {
      res.status(200).send("Account deleted");
    })
    .catch(err => {
      console.log(err);
    });
});

//why can't I see the req.body with axios.post?
app.post("/getWordData", async (req, res) => {
  const infoMessages = [];
  const { selectedWords } = req.body;
  const targetWordObjects = [];
  for (let i = 0; i < selectedWords.length; i++) {
    const isPlural = pluralize.isPlural(selectedWords[i]);
    let word;
    if (isPlural) {
      word = pluralize.singular(selectedWords[i]);
    } else {
      word = selectedWords[i];
    }
    const response = await axios.get(
      "https://dictionaryapi.com/api/v3/references/learners/json/" +
        word +
        "?key=" +
        dictionaryKey
    );
    if (!response.data[0].shortdef) {
      infoMessages.push('"' + word + '"' + " was not found in the dictionary");
      break;
    }
    const shortDef = response.data[0].shortdef[0];
    const wordType = response.data[0].fl;
    let infinitiveForm;
    if (wordType === "verb") {
      infinitiveForm = response.data[0].hwi.hw.replace(
        //eslint-disable-next-line
        /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
        ""
      );
    } else {
      infinitiveForm = null;
    }
    let audioUrl;
    if (response.data[0].hwi.prs) {
      audioUrl =
        "https://media.merriam-webster.com/soundc11/" +
        response.data[0].hwi.prs[0].sound.audio.toString().charAt(0) +
        "/" +
        response.data[0].hwi.prs[0].sound.audio +
        ".wav";
    } else {
      audioUrl = null;
    }

    let singularForm;
    if (isPlural) {
      singularForm = pluralize.singular(word);
    } else {
      singularForm = null;
    }

    targetWordObjects.push({
      word: selectedWords[i],
      def: shortDef,
      audio: audioUrl,
      isPlural: isPlural,
      singularForm: singularForm,
      wordType: wordType,
      infinitiveForm: infinitiveForm
    });
  }
  res.status(200).send({ targetWordObjects, infoMessages });
});

app.put("/deleteText", verifyToken, (req, res) => {
  const { title } = req.body;
  const email = req.tokenData.user.email;
  User.update(
    { email: email },
    { $pull: { texts: { title: title } } },
    { safe: true, multi: true }
  )
    .then(() => {
      res.status(200).send("Text deleted");
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(5000, () => console.log("listening on port 5000"));
