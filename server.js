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
const winston = require("winston");
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "logs.txt" })]
});
const path = require("path");

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

app.use(express.static(path.join(__dirname, "client/build")));

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
  const time = new Date(Date.now()).toUTCString();
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
            logger.info("User logging in: " + email + ", " + time);
            jwt.sign({ user }, "secretkey", (err, token) => {
              res.status(200).send({
                token: token,
                userName: user.name
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
  const time = new Date(Date.now()).toUTCString();
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
        logger.info("New user registering: " + email + ", " + time);
        jwt.sign({ user }, "secretkey", (err, token) => {
          res.send({ token });
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

app.get("/savedTexts", verifyToken, (req, res) => {
  const email = req.tokenData.user.email;
  User.findOne({ email })
    .then(user => {
      res
        .status(200)
        .send({ texts: user.texts, completedTexts: user.completedTexts });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/complete", verifyToken, (req, res) => {
  console.log('marking text complete in db')
  const email = req.tokenData.user.email;
  console.log(email)
  const title = req.body.title;
  User.findOne({ email })
    .then(user => {
      console.log(user)
      user.completedTexts.push(title);
      user
        .save()
        .then(() => {
          res
            .status(200)
            .send({ texts: user.texts, completedTexts: user.completedTexts });
        })
        .catch(err => {
          console.log(err);
        });
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

//same as code in /saveText so should be separated
app.post("/getWordData", async (req, res) => {
  const { word } = req.body;
  const isPlural = pluralize.isPlural(word);
  let wordToSearch;
  if (isPlural) {
    wordToSearch = pluralize.singular(word);
  } else {
    wordToSearch = word;
  }
  const response = await axios.get(
    "https://dictionaryapi.com/api/v3/references/learners/json/" +
    word +
    "?key=" +
    dictionaryKey
  );
  let definition;
  if (!response.data[0].shortdef) {
    definition = null;
  } else {
    definition = response.data[0].shortdef[0];
  }

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
  let positiveForm;
  if (wordType === "adjective" && response.data[0].meta.id !== word) {
    positiveForm = response.data[0].meta.stems[0];
  } else {
    positiveForm = null;
  }
  let audioUrl;
  if (response.data[0].hwi.prs && response.data[0].hwi.prs[0].sound) {
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
  const wordData = {
    definition: definition,
    audio: audioUrl,
    singularForm: singularForm,
    wordType: wordType,
    infinitiveForm: infinitiveForm,
    positiveForm
  };
  res.status(200).send(wordData);
});

app.post("/saveText", verifyToken, async (req, res) => {
  const date = new Date();
  const infoMessages = [];
  const { title, selectedWords, content } = req.body;
  const targetWordObjs = [];
  for (let i = 0; i < selectedWords.length; i++) {
    //const element = selectedWords[i]
    const isPlural = pluralize.isPlural(selectedWords[i].element);
    let wordToSearch;
    if (isPlural) {
      wordToSearch = pluralize.singular(selectedWords[i].element);
    } else {
      wordToSearch = selectedWords[i].element;
    }
    const response = await axios.get(
      "https://dictionaryapi.com/api/v3/references/learners/json/" +
      wordToSearch +
      "?key=" +
      dictionaryKey
    );
    //definition
    if (!response.data[0].shortdef) {
      infoMessages.push({
        text:
          '"' +
          selectedWords[i].element +
          '"' +
          " was not found in the dictionary",
        type: "warning"
      });
      break;
    }
    const definition = response.data[0].shortdef[0];
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
    let positiveForm;
    if (
      wordType === "adjective" &&
      response.data[0].meta.id !== selectedWords[i].element
    ) {
      positiveForm = response.data[0].meta.stems[0];
    } else {
      positiveForm = null;
    }
    let audioUrl;
    if (response.data[0].hwi.prs && response.data[0].hwi.prs[0].sound) {
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
      singularForm = pluralize.singular(selectedWords[i].element);
    } else {
      singularForm = null;
    }
    targetWordObjs.push({
      _id: mongoose.Types.ObjectId(),
      word: selectedWords[i].element,
      sentence: selectedWords[i].sentenceIndex,
      element: selectedWords[i].elementIndex,
      definition: definition,
      audio: audioUrl,
      singularForm: singularForm,
      wordType: wordType,
      infinitiveForm: infinitiveForm,
      positiveForm
    });
  }
  if (targetWordObjs.length < 3) {
    infoMessages.push({
      text: "Not saved - text must contain at least 3 target words",
      type: "failure"
    });
    res.status(200).send(infoMessages);
    return;
  }
  const text = {
    title,
    added: date,
    content,
    targetWordObjs,
    _id: mongoose.Types.ObjectId()
  };
  const email = req.tokenData.user.email;

  User.findOne({ email })
    .then(user => {
      user.texts.push(text);
      user.save().then(() => {
        infoMessages.push({ text: "Text saved", type: "success" });
        res.status(200).send(infoMessages);
      });
    })
    .catch(err => {
      console.log(err);
    });
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

app.put("/updateText", verifyToken, (req, res) => {
  const email = req.tokenData.user.email;
  const { updatedText } = req.body;
  User.findOne({ email })
    .then(user => {
      for (let i = 0; i < user.texts.length; i++) {
        //not using strict equality because id on document in db will be object while updatedText._id will be string
        if (user.texts[i]._id == updatedText._id) {
          user.texts[i] = updatedText;
        }
      }
      user.markModified("texts");
      user
        .save()
        .then(() => {
          res.status(200).send("Text updated");
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(5000, () => console.log("listening on port 5000"));
