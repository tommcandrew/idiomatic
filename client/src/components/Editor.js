import React, { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";

const Editor = ({ text, setCurrentComponent, updateText, setInfoMessages }) => {
  const [sentencesOfSpanElements, setSentencesOfSpanElements] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedText, setSelectedText] = useState(null);

  useEffect(() => {
    setSelectedText(text);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedText) {
      createSpanArray();
    }
    //eslint-disable-next-line
  }, [selectedText]);

  useEffect(() => {
    if (sentencesOfSpanElements && sentencesOfSpanElements.length > 0) {
      createTableRows();
    }
    //eslint-disable-next-line
  }, [sentencesOfSpanElements]);

  //copied from Reader - maybe put in Utils?
  const createSpanArray = () => {
    const sentences = selectedText.content.match(/[^.!?]+[.!?]+/g);
    const splitSentences = sentences.map(sentence =>
      sentence.match(/[\w'’]+|[.,!?;]/g)
    );
    const sentencesOfSpanElements = splitSentences.map(
      (sentence, sentenceIndex) =>
        sentence.map((word, elementIndex) => {
          const nonWordElements = [",", ",", "'", "?", "!", ".", ":", ";"];
          let classNames = [];
          for (let i = 0; i < selectedText.targetWordObjs.length; i++) {
            if (
              sentenceIndex === selectedText.targetWordObjs[i].sentence &&
              elementIndex === selectedText.targetWordObjs[i].element
            ) {
              classNames.push("editor__word--target");
            }
          }
          if (nonWordElements.includes(word)) {
            classNames.push("editor__punctuation");
          } else {
            classNames.push("editor__word");
          }
          classNames = classNames.join(" ");
          return (
            <span
              key={"word" + (sentenceIndex + elementIndex)}
              className={classNames}
              onClick={handleWordClick}
              data-sentence-index={sentenceIndex}
              data-element-index={elementIndex}
            >
              {word}
            </span>
          );
        })
    );
    setSentencesOfSpanElements(sentencesOfSpanElements);
  };

  const handleWordClick = e => {
    const sentenceIndex = parseInt(e.target.dataset.sentenceIndex);
    const elementIndex = parseInt(e.target.dataset.elementIndex);
    const element = e.target.innerText;
    const updatedWordArr = [
      ...selectedText.targetWordObjs,
      {
        word: element,
        sentence: sentenceIndex,
        element: elementIndex
      }
    ];

    const updatedText = {
      ...selectedText,
      targetWordObjs: updatedWordArr
    };
    setSelectedText(updatedText);
  };

  const createTableRows = () => {
    const rows = selectedText.targetWordObjs.map((obj, index) => {
      return (
        <div key={"row" + index}>
          <span
            className="editor__dic"
            onClick={() => handleDictionaryClick(obj.word)}
            title="Get word data from dictionary"
          >
            &#128366;
          </span>
          <span
            className="editor__delete"
            onClick={() => handleDeleteClick(obj.word)}
          >
            &times;
          </span>
          <span>{obj.word}</span>

          <input
            defaultValue={obj.wordType}
            onChange={e => handleInputChange(e, obj._id, "wordType")}
          />
          <input
            defaultValue={
              obj.isPlural ? "true" : obj.isPlural === false ? "false" : "-"
            }
            onChange={e => handleInputChange(e, obj._id, "isPlural")}
          />
          <input
            defaultValue={obj.singularForm ? obj.singularForm : "-"}
            onChange={e => handleInputChange(e, obj._id, "singularForm")}
          />
          <input
            defaultValue={obj.infinitiveForm ? obj.infinitiveForm : "-"}
            onChange={e => handleInputChange(e, obj._id, "infinitiveForm")}
          />
          <input
            defaultValue={obj.positiveForm ? obj.positiveForm : "-"}
            onChange={e => handleInputChange(e, obj._id, "positiveForm")}
          />
          <input
            defaultValue={obj.definition}
            className="editor__def"
            onChange={e => handleInputChange(e, obj._id, "definition")}
          />
        </div>
      );
    });
    setTableRows(rows);
  };

  const handleDeleteClick = word => {
    setSelectedWord(word);
    setShowConfirmModal(true);
  };

  const handleDictionaryClick = word => {
    axios.post("/getWordData", { word }).then(res => {
      const {
        definition,
        audio,
        isPlural,
        singularForm,
        wordType,
        infinitiveForm,
        positiveForm
      } = res.data;
      let updatedText = { ...selectedText };
      for (let i = 0; i < updatedText.targetWordObjs.length; i++) {
        if (updatedText.targetWordObjs[i].word === word) {
          updatedText.targetWordObjs[i] = {
            ...updatedText.targetWordObjs[i],
            definition,
            audio,
            isPlural,
            singularForm,
            wordType,
            infinitiveForm,
            positiveForm
          };
        }
      }
      setSelectedText(updatedText);
    });
  };

  const handleDeleteWord = () => {
    //maybe wait until user clicks save at the end before updating database
    const updatedText = {
      ...selectedText,
      targetWordObjs: selectedText.targetWordObjs.filter(
        obj => obj.word !== selectedWord
      )
    };
    setSelectedText(updatedText);
    setSelectedWord(null);
    setShowConfirmModal(false);
  };

  const handleInputChange = (e, id, type) => {
    const newValue = e.target.value;
    const updatedWordArr = selectedText.targetWordObjs.map(obj => {
      if (obj._id === id) {
        obj[type] = newValue;
      }
      return obj;
    });

    const updatedText = {
      ...selectedText,
      targetWordObjs: updatedWordArr
    };
    setSelectedText(updatedText);
  };

  const handleSubmit = () => {
    if (selectedText.targetWordObjs.length < 3) {
      setInfoMessages([
        {
          text: "Text must contain at least 3 target words",
          type: "warning"
        }
      ]);
      return;
    }
    updateText(selectedText);
    setCurrentComponent("Dashboard");
    setInfoMessages([{ text: "Text updated!", type: "success" }]);
  };

  return (
    <div className="editor__wrapper">
      <p className="editor__instruction1">
        Click on words in the text to add to the target word list.
      </p>
      <div className="editor__text-wrapper">
        <div className="editor__text">{sentencesOfSpanElements}</div>
      </div>
      <p className="editor__instruction2">
        Here you can add/edit word data and get data from the dictionary by
        clicking on the button on the left
      </p>
      <div className="editor__table">
        <div className="editor__table-header">
          <span className="editor__dic-header"></span>
          <span className="editor__delete-header"></span>
          <span>Word</span>
          <span>Type</span>
          <span>Plural?</span>
          <span>Singular</span>
          <span>Infinitive</span>
          <span>Positive</span>
          <span className="editor__def-header">Definition</span>
        </div>
        {tableRows}
      </div>
      {showConfirmModal && (
        <ConfirmModal
          setShowConfirmModal={setShowConfirmModal}
          actionOnConfirm={handleDeleteWord}
          thingToDelete="this word"
        />
      )}
      <div className="editor__buttons">
        <button onClick={handleSubmit} className="editor__save">
          Save
        </button>
        <button
          onClick={() => setCurrentComponent("Dashboard")}
          className="editor__cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Editor;
