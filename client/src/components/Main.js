import React, { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Texts from "./Texts";
import UploadText from "./UploadText";
import Header from "./Header";
import StartPage from "./StartPage";
import Reader from "./Reader";
import axios from "axios";
import MyTexts from "./MyTexts";
import GapFill from "./GapFill";
import MatchDefinitions from "./MatchDefinitions";
import Spelling from "./Spelling";
import Results from "./Results";
import MyWords from "./MyWords";
import MyProfile from "./MyProfile";
import Alert from "./Alert";

const texts = [
  {
    title: "Greenland",
    level: "Upper-intermediate",
    tags: ["geography"],
    targetSentences: [
      "The warmest part of the island is on the south coast and that is where most Greenlanders live.",
      "Erik's name might have come from the colour of his hair and beard, or possibly because of his fiery temper.",
      "The old stories of Iceland say that Erik became bored and lonely and wanted to persuade other people to come and live on this freezing-cold island with him.",
      "What happened to them is still a mystery."
    ],
    targetWords: ["coast", "beard", "persuade", "mystery"],
    targetWordObjs: [
      {
        word: "coast",
        def: "The land near the sea.",
        audio: "https://media.merriam-webster.com/soundc11/c/coast001.wav"
      },
      {
        word: "beard",
        def: "The hair that grows on a man's face.",
        audio: "https://media.merriam-webster.com/soundc11/b/beard001.wav"
      },
      {
        word: "persuade",
        def: "To make someone do something by talking.",
        audio: "https://media.merriam-webster.com/soundc11/p/persua02.wav"
      },
      {
        word: "mystery",
        def: "Something that is impossible to explain.",
        audio: "https://media.merriam-webster.com/soundc11/m/myster02.wav"
      }
    ],
    content:
      "Greenland is a huge island in the far, far north of the world. The weather there is very harsh and cold. Even the hottest summer day in Greenland is like a cool winter's day in England. In the summer months, the sun never sets; it is light all through the night. The warmest part of the island is on the south coast and that is where most Greenlanders live. However, it is still a very hard place to live because of the cold. Over the years, different groups of people have tried to live in Greenland, but most found it too difficult. One man who did live there, and one of the most famous Greenlanders, was 'Erik the Red'. Erik's name might have come from the colour of his hair and beard, or possibly because of his fiery temper. About 1000 years ago, Erik was sent away from his home in Iceland. He sailed away from this small ice-covered island to a great big ice-covered island. This island had no name yet and no one lived there, so Erik made it his home. The old stories of Iceland say that Erik became bored and lonely and wanted to persuade other people to come and live on this freezing-cold island with him. Erik had an idea. He called the island ”Greenland” and pretended that it was lovely, warm and ... green. His trick worked. When the people from Iceland heard about this perfect place called ”Greenland”, many of them decided to join Erik. About 300 of them packed up their belongings and set off to join him. Although life was hard, these people lived on Greenland for many years and it became their home. They built houses that were snug and strong from stone, wood and turf. They planted crops and kept cows, goats and sheep that they had brought with them all the way from Iceland. However, 500 years later, there was nothing left of Erik and his friends in Greenland. What happened to them is still a mystery."
  },
  {
    title: "Plastic and the environment",
    level: "Beginner",
    tags: ["environment"]
  },
  {
    title: "Bats in your garden",
    level: "Lower-intermediate",
    tags: ["animals"]
  },
  { title: "Guide dogs", level: "Advanced", tags: ["animals"] },
  { title: "Clouds", level: "Upper-intermediate", tags: ["nature", "science"] },
  {
    title: "All about potatoes",
    level: "Intermediate",
    tags: ["food", "science"]
  },
  {
    title: "Diwali",
    level: "Upper-intermediate",
    tags: ["culture", "festivals"]
  },
  { title: "London", level: "Upper-intermediate", tags: ["cities"] },
  {
    title: "Halloween",
    level: "Beginner",
    tags: ["festivals", "culture"]
  },
  { title: "My City", level: "Intermediate", tags: ["cities"] }
];

const Main = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showTexts, setShowTexts] = useState(false);
  const [showUploadText, setShowUploadText] = useState(false);
  const [showStartPage, setShowStartPage] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [showReader, setShowReader] = useState(false);
  const [showMyTexts, setShowMyTexts] = useState(false);
  const [savedTexts, setSavedTexts] = useState([]);
  const [showGapFill, setShowGapFill] = useState(false);
  const [showMatchDefinitions, setShowMatchDefinitions] = useState(false);
  const [showSpelling, setShowSpelling] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [numQuestions, setNumQuestions] = useState(null);
  const [completedTexts, setCompletedTexts] = useState([]);
  const [showMyWords, setShowMyWords] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [infoMessages, setInfoMessages] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    fetchSavedTexts();
  }, []);

  const fetchSavedTexts = () => {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .get("/api/savedtexts", {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(res => {
        setSavedTexts(res.data);
      });
  };

  const handleShowTexts = () => {
    setShowDashboard(false);
    setShowMyWords(false);
    setShowMyProfile(false);
    setShowSpelling(false);
    setShowResults(false);
    setShowStartPage(false);
    setShowUploadText(false);
    setShowMyTexts(false);
    setShowGapFill(false);
    setShowMatchDefinitions(false);
    setShowMobileMenu(false);
    setShowTexts(true);
  };

  const handleShowUploadText = () => {
    setShowDashboard(false);
    setShowMyTexts(false);
    setShowUploadText(true);
    setShowMobileMenu(false);
  };

  const handleShowDashboard = () => {
    console.log("show dashboard");
    setShowTexts(false);
    setShowUploadText(false);
    setShowStartPage(false);
    setShowReader(false);
    setShowMyTexts(false);
    setShowMyWords(false);
    setShowResults(false);
    setShowSpelling(false);
    setShowGapFill(false);
    setShowMatchDefinitions(false);
    setShowMyProfile(false);
    setShowMobileMenu(false);
    setShowDashboard(true);
  };

  const deleteText = title => {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .put(
        "/api/deleteText",
        { title },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      .then(res => {
        fetchSavedTexts();
        setInfoMessages(["Text deleted"]);
        console.log(res);
      });
  };

  const handleChooseText = (e, title) => {
    if (title !== "Greenland") {
      setInfoMessages(["Not available right now"]);
      return;
    }
    if (
      !e.target.classList.contains("textTile__content") &&
      !e.target.classList.contains("textTile__title")
    ) {
      return;
    }
    let selectedText;
    if (showMyTexts) {
      selectedText = savedTexts.filter(text => text.title === title)[0];
    } else {
      selectedText = texts.filter(text => text.title === title)[0];
    }
    setSelectedText(selectedText);
    setShowTexts(false);
    setShowMyTexts(false);
    setShowStartPage(true);
    setNumQuestions(selectedText.targetWords.length * 3);
  };

  const handleShowReader = () => {
    setShowStartPage(false);
    setShowReader(true);
  };

  const handleShowMyTexts = () => {
    setShowDashboard(false);
    setShowTexts(false);
    setShowMyWords(false);
    setShowMyProfile(false);
    setShowSpelling(false);
    setShowResults(false);
    setShowStartPage(false);
    setShowUploadText(false);
    setShowGapFill(false);
    setShowMatchDefinitions(false);
    setShowMobileMenu(false);

    setShowMyTexts(true);
  };

  const handleShowGapFill = () => {
    setShowReader(false);
    setShowGapFill(true);
  };

  const handleShowMatchDefinitions = () => {
    setShowGapFill(false);
    setShowMatchDefinitions(true);
  };

  const handleShowSpelling = () => {
    setShowMatchDefinitions(false);
    setShowSpelling(true);
  };

  const handleShowResults = () => {
    setShowSpelling(false);
    setShowResults(true);
  };

  const incrementCorrectAnswers = num => {
    setCorrectAnswers(correctAnswers + num);
  };

  const markTextComplete = () => {
    setCompletedTexts([...completedTexts, selectedText.title]);
  };

  const handleShowMyWords = () => {
    setShowDashboard(false);
    setShowTexts(false);
    setShowMyProfile(false);
    setShowSpelling(false);
    setShowResults(false);
    setShowStartPage(false);
    setShowUploadText(false);
    setShowMyTexts(false);
    setShowGapFill(false);
    setShowMatchDefinitions(false);
    setShowMyWords(true);
  };

  const handleShowMyProfile = () => {
    setShowDashboard(false);
    setShowTexts(false);
    setShowSpelling(false);
    setShowResults(false);
    setShowStartPage(false);
    setShowUploadText(false);
    setShowMyTexts(false);
    setShowGapFill(false);
    setShowMatchDefinitions(false);
    setShowMyWords(false);
    setShowMyProfile(true);
  };

  const closeAlert = () => {
    setInfoMessages([]);
  };

  return (
    <div className="main__wrapper">
      <Header
        handleShowDashboard={handleShowDashboard}
        handleShowMyTexts={handleShowMyTexts}
        handleShowMyWords={handleShowMyWords}
        handleShowTexts={handleShowTexts}
        handleShowMyProfile={handleShowMyProfile}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
      />
      {showDashboard && (
        <Dashboard
          handleShowTexts={handleShowTexts}
          handleShowUploadText={handleShowUploadText}
        />
      )}
      {showTexts && (
        <Texts
          setSelectedText={setSelectedText}
          texts={texts}
          handleChooseText={handleChooseText}
        />
      )}
      {showUploadText && (
        <UploadText
          fetchSavedTexts={fetchSavedTexts}
          handleShowMyTexts={handleShowMyTexts}
          setInfoMessages={setInfoMessages}
          infoMessages={infoMessages}
          savedTexts={savedTexts}
          closeAlert={closeAlert}
        />
      )}
      {showStartPage && (
        <StartPage
          selectedText={selectedText}
          handleShowReader={handleShowReader}
        />
      )}
      {showReader && (
        <Reader text={selectedText} handleShowGapFill={handleShowGapFill} />
      )}
      {showMyTexts && (
        <MyTexts
          texts={savedTexts}
          handleChooseText={handleChooseText}
          deleteText={deleteText}
          handleShowUploadText={handleShowUploadText}
        />
      )}
      {showGapFill && (
        <GapFill
          sentences={selectedText.targetSentences}
          targetWords={selectedText.targetWords}
          handleShowMatchDefinitions={handleShowMatchDefinitions}
          incrementCorrectAnswers={incrementCorrectAnswers}
        />
      )}
      {showMatchDefinitions && (
        <MatchDefinitions
          text={selectedText}
          handleShowSpelling={handleShowSpelling}
          incrementCorrectAnswers={incrementCorrectAnswers}
        />
      )}
      {showSpelling && (
        <Spelling
          text={selectedText}
          handleShowResults={handleShowResults}
          incrementCorrectAnswers={incrementCorrectAnswers}
          markTextComplete={markTextComplete}
        />
      )}
      {showResults && (
        <Results
          correctAnswers={correctAnswers}
          numQuestions={numQuestions}
          handleShowDashboard={handleShowDashboard}
        />
      )}
      {showMyWords && (
        <MyWords
          texts={texts}
          savedTexts={savedTexts}
          completedTexts={completedTexts}
        />
      )}
      {showMyProfile && <MyProfile />}
      {infoMessages &&
        infoMessages.map((message, index) => (
          <Alert
            alertInfo={{ type: "info", text: message }}
            closeAlert={closeAlert}
            key={"alert" + index}
            closeAlert={closeAlert}
          />
        ))}
    </div>
  );
};

export default Main;
