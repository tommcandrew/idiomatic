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
import AlertWrapper from "./AlertWrapper";
import texts from "../assets/texts.js";

const Main = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("Dashboard");
  const [selectedText, setSelectedText] = useState(null);
  const [infoMessages, setInfoMessages] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [numQuestions, setNumQuestions] = useState(null);
  const [completedTexts, setCompletedTexts] = useState([]);
  const [savedTexts, setSavedTexts] = useState([]);

  useEffect(() => {
    fetchSavedTexts();
  }, []);

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      setInfoMessages([]);
    }, 2500);
    return () => {
      clearTimeout(alertTimer);
    };
  }, [infoMessages]);

  const fetchSavedTexts = () => {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .get("/savedtexts", {
        headers: {
          Authorization: "Bearer " + token
        }
      })
      .then(res => {
        setSavedTexts(res.data);
      });
  };

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
        setInfoMessages([{ text: "Text deleted", type: "success" }]);
      });
  };

  const handleChooseText = (e, title) => {
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
    if (currentComponent === "MyTexts") {
      selectedText = savedTexts.filter(text => text.title === title)[0];
    } else {
      //or site's texts
      selectedText = texts.filter(text => text.title === title)[0];
    }
    setSelectedText(selectedText);
    setCurrentComponent("StartPage");
    //used when giving final results
    setNumQuestions(selectedText.targetWordObjs.length * 3);
  };

  const incrementCorrectAnswers = num => {
    setCorrectAnswers(correctAnswers + num);
  };

  const markTextComplete = () => {
    setCompletedTexts([...completedTexts, selectedText.title]);
    setInfoMessages([{text: "New words added to My Words!", type: "info"}])
  };

  return (
    <div className="main__wrapper">
      <Header
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        currentComponent={currentComponent}
        setCurrentComponent={setCurrentComponent}
      />
      {currentComponent === "Dashboard" && (
        <Dashboard setCurrentComponent={setCurrentComponent} />
      )}
      {currentComponent === "Texts" && (
        <Texts
          setSelectedText={setSelectedText}
          texts={texts}
          handleChooseText={handleChooseText}
        />
      )}
      {currentComponent === "UploadText" && (
        <UploadText
          fetchSavedTexts={fetchSavedTexts}
          setCurrentComponent={setCurrentComponent}
          setInfoMessages={setInfoMessages}
          infoMessages={infoMessages}
          savedTexts={savedTexts}
        />
      )}
      {currentComponent === "StartPage" && (
        <StartPage
          selectedText={selectedText}
          setCurrentComponent={setCurrentComponent}
        />
      )}
      {currentComponent === "Reader" && (
        <Reader text={selectedText} setCurrentComponent={setCurrentComponent} />
      )}
      {currentComponent === "MyTexts" && (
        <MyTexts
          texts={savedTexts}
          handleChooseText={handleChooseText}
          deleteText={deleteText}
          setCurrentComponent={setCurrentComponent}
        />
      )}
      {currentComponent === "GapFill" && (
        <GapFill
          setCurrentComponent={setCurrentComponent}
          incrementCorrectAnswers={incrementCorrectAnswers}
          text={selectedText}
          setInfoMessages={setInfoMessages}
        />
      )}
      {currentComponent === "MatchDefinitions" && (
        <MatchDefinitions
          text={selectedText}
          setCurrentComponent={setCurrentComponent}
          incrementCorrectAnswers={incrementCorrectAnswers}
          setInfoMessages={setInfoMessages}
        />
      )}
      {currentComponent === "Spelling" && (
        <Spelling
          text={selectedText}
          setCurrentComponent={setCurrentComponent}
          incrementCorrectAnswers={incrementCorrectAnswers}
          markTextComplete={markTextComplete}
          infoMessages={infoMessages}
          setInfoMessages={setInfoMessages}
        />
      )}
      {currentComponent === "Results" && (
        <Results
          correctAnswers={correctAnswers}
          numQuestions={numQuestions}
          setCurrentComponent={setCurrentComponent}
        />
      )}
      {currentComponent === "MyWords" && (
        <MyWords
          texts={texts}
          savedTexts={savedTexts}
          completedTexts={completedTexts}
        />
      )}
      {currentComponent === "MyProfile" && <MyProfile />}
      {infoMessages.length > 0 && <AlertWrapper messages={infoMessages} />}
    </div>
  );
};

export default Main;
