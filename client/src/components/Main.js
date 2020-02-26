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
import texts from "../assets/texts.js";

const Main = () => {
  const [showDashboard, setShowDashboard] = useState(true);
  const [showTexts, setShowTexts] = useState(false);
  const [showUploadText, setShowUploadText] = useState(false);
  const [showStartPage, setShowStartPage] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [showMyTexts, setShowMyTexts] = useState(false);
  const [showGapFill, setShowGapFill] = useState(false);
  const [showMatchDefinitions, setShowMatchDefinitions] = useState(false);
  const [showSpelling, setShowSpelling] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showMyWords, setShowMyWords] = useState(false);
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedText, setSelectedText] = useState(null);
  const [infoMessages, setInfoMessages] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [numQuestions, setNumQuestions] = useState(null);
  const [completedTexts, setCompletedTexts] = useState([]);
  const [savedTexts] = useState(fetchSavedTexts() || []);

  function fetchSavedTexts() {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .get("/savedtexts", {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(res => {
        return res.data;
      });
  }

  //would id be better?
  const deleteText = title => {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .put(
        "/deleteText",
        { title },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      .then(() => {
        fetchSavedTexts();
        setInfoMessages(["Text deleted"]);
      });
  };

  const handleChooseText = (e, title) => {
    //until I add data for other texts
    if (title !== "Greenland") {
      setInfoMessages(["Not available right now"]);
      return;
    }
    //better way to do this?
    if (
      !e.target.classList.contains("textTile__content") &&
      !e.target.classList.contains("textTile__title") &&
      !e.target.classList.contains("textTile__level")
    ) {
      return;
    }
    let selectedText;
    //if user is looking at own uploaded texts
    if (showMyTexts) {
      selectedText = savedTexts.filter(text => text.title === title)[0];
    } else {
      //or site's texts
      selectedText = texts.filter(text => text.title === title)[0];
    }
    setSelectedText(selectedText);
    setShowTexts(false);
    setShowMyTexts(false);
    setShowStartPage(true);
    //used when giving final results
    setNumQuestions(selectedText.targetWords.length * 3);
  };

  const incrementCorrectAnswers = num => {
    setCorrectAnswers(correctAnswers + num);
  };

  const markTextComplete = () => {
    setCompletedTexts([...completedTexts, selectedText.title]);
  };
  const closeAlert = () => {
    setInfoMessages([]);
  };

  //functions to open/close components
  const handleShowDashboard = () => {
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

  const handleShowResults = () => {
    setShowSpelling(false);
    setShowResults(true);
  };

  const handleShowSpelling = () => {
    setShowMatchDefinitions(false);
    setShowSpelling(true);
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
        handleShowUploadText={handleShowUploadText}
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
          targetSentences={selectedText.targetSentences}
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
