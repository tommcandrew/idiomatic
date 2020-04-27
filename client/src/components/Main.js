import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import Dashboard from "./Dashboard";
import Texts from "./Texts";
import UploadText from "./UploadText";
import Header from "./Header";
import StartPage from "./StartPage";
import Reader from "./Reader";
import MyTexts from "./MyTexts";
import GapFill from "./GapFill";
import MatchDefinitions from "./MatchDefinitions";
import Spelling from "./Spelling";
import Results from "./Results";
import MyWords from "./MyWords";
import MyAccount from "./MyAccount";
import AlertWrapper from "./AlertWrapper";
import Editor from "./Editor";
import FlashcardContainer from "./FlashcardContainer";
import Wizard from "./Wizard";

import texts from "../assets/texts.js";

import AuthContext from "../context/AuthContext";

const Main = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("Dashboard");
  const [selectedText, setSelectedText] = useState(null);
  const [infoMessages, setInfoMessages] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [numQuestions, setNumQuestions] = useState(null);
  const [completedTexts, setCompletedTexts] = useState([]);
  const [savedTexts, setSavedTexts] = useState([]);
  const [studiedWords, setStudiedWords] = useState([]);

  const { isNewUser, setIsNewUser } = useContext(AuthContext)


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
        setSavedTexts(res.data.texts);
        setCompletedTexts(res.data.completedTexts);
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
    let selectedText;
    //if user is looking at own uploaded texts
    if (currentComponent === "MyTexts") {
      selectedText = savedTexts.filter(text => text.title === title)[0];
    } else {
      //or site's texts
      selectedText = texts.filter(text => text.title === title)[0];
    }
    setSelectedText(selectedText);
    setCorrectAnswers(0)
    setCurrentComponent("StartPage");
    //used when giving final results
    setNumQuestions(selectedText.targetWordObjs.length * 3);
  };

  const incrementCorrectAnswers = num => {
    setCorrectAnswers(correctAnswers + num);
  };

  const markTextComplete = () => {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .post(
        "/complete",
        { title: selectedText.title },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      //probably not very efficient to fetch all texts again
      .then(() => {
        fetchSavedTexts();
        setInfoMessages([
          { text: "New words added to My Words!", type: "info" }
        ]);
      });
  };

  const handleEditText = (e, title) => {
    e.stopPropagation();
    const selectedText = savedTexts.find(text => text.title === title);
    setSelectedText(selectedText);
    setCurrentComponent("Editor");
  };

  const updateText = updatedText => {
    const token = localStorage.getItem("idiomatic-token");
    axios
      .put(
        "/updateText",
        { updatedText },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      .then(res => {
        fetchSavedTexts();
      });
  };

  const handleStartFlashcardStudy = studiedWords => {
    if (studiedWords.length === 0) {
      setInfoMessages([
        { text: "You don't have any studied words yet.", type: "warning" }
      ]);
      return;
    }
    setStudiedWords(studiedWords)
    setCurrentComponent("FlashcardContainer");
  }

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
          completedTexts={completedTexts}
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
          handleEditText={handleEditText}
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
          handleStartFlashcardStudy={handleStartFlashcardStudy}
        />
      )}
      {currentComponent === "Editor" && selectedText && (
        <Editor
          text={selectedText}
          setCurrentComponent={setCurrentComponent}
          updateText={updateText}
          setInfoMessages={setInfoMessages}
        />
      )}
      {currentComponent === "FlashcardContainer" && (
        <FlashcardContainer studiedWords={studiedWords} setCurrentComponent={setCurrentComponent} infoMessages={infoMessages} setInfoMessages={setInfoMessages} />
      )}
      {currentComponent === "MyAccount" && <MyAccount />}
      {infoMessages.length > 0 && <AlertWrapper messages={infoMessages} />}
      {isNewUser && <Wizard setIsNewUser={setIsNewUser} />}
    </div>
  );
};

export default Main;
