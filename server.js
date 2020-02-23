const express = require("express");
const fileUpload = require("express-fileupload");
const pdf = require("pdf-parse");
const mongoose = require("mongoose");
const User = require("./models/User.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
              res.status(200).send({ token: token, userName: user.name });
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
          res.send(token);
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
        res.status(200).send("Text saved");
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

app.listen(5000, () => console.log("listening on port 5000"));
