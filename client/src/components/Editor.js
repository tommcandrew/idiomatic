import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Editor = ({ text, setCurrentComponent, updateText, setInfoMessages }) => {
  const [sentencesOfSpanElements, setSentencesOfSpanElements] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [deleting, setDeleting] = useState(false)

  const myForm = useRef()

  useEffect(() => {
    console.log('table rows changed')
    console.log(tableRows)
  }, [tableRows])

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
    let updatedWordArr
    //if word has already been selected, remove it from array
    if (selectedText.targetWordObjs.some(obj => {
      if (obj.sentence === sentenceIndex && obj.element === elementIndex) {
        return true
      }
    })) {
      updatedWordArr = selectedText.targetWordObjs.filter(obj => obj.sentence !== sentenceIndex || obj.element !== elementIndex)
      setDeleting(true)
      //otherwise add it to array
    } else {
      updatedWordArr = [
        ...selectedText.targetWordObjs,
        {
          word: element,
          sentence: sentenceIndex,
          element: elementIndex
        }
      ];
    }
    //(in either case) update array
    const updatedText = {
      ...selectedText,
      targetWordObjs: updatedWordArr
    };
    setSelectedText(updatedText);
  };

  const createTableRows = () => {
    //reset inputs if deleting word, otherwise values don't update
    if (deleting) {
      myForm.current.reset()
      setDeleting(false)
    }
    const rows = selectedText.targetWordObjs.map((obj, index) => {
      return (
        <div key={"row" + index} className="editor__table-row">

          <div className="editor__table-cell">
            <span className="editor__table-label">

            </span>
            <span
              className="editor__dic"
              onClick={() => handleDictionaryClick(obj.word)}
              title="Get word info from dictionary"
            >
              &#128366;
          </span>
          </div>

          <div className="editor__table-cell">
            <span className="editor__table-label">Word</span>
            <input defaultValue={obj.word} />
          </div>

          <div className="editor__table-cell">
            <span className="editor__table-label">Word Type</span>
            <input
              onChange={e => handleInputChange(e, obj._id, "wordType")}
              className={!obj.wordType ? "greyedOut" : undefined}
              defaultValue={obj.wordType}
            />
          </div>

          <div className="editor__table-cell">
            <span className="editor__table-label">Singular</span>
            <input
              onChange={e => handleInputChange(e, obj._id, "singularForm")}
              className={!obj.singularForm ? "greyedOut" : undefined}
              defaultValue={obj.singularForm}
            />
          </div>

          <div className="editor__table-cell">
            <span className="editor__table-label">Infinitive</span>
            <input
              onChange={e => handleInputChange(e, obj._id, "infinitiveForm")}
              className={!obj.infinitiveForm ? "greyedOut" : undefined}
              defaultValue={obj.infinitiveForm}
            />
          </div>

          <div className="editor__table-cell">
            <span className="editor__table-label">Main Adj.</span>
            <input
              onChange={e => handleInputChange(e, obj._id, "positiveForm")}
              className={!obj.positiveForm ? "greyedOut" : undefined}
              defaultValue={obj.positiveForm}
            />
          </div>

          <div className="editor__table-cell">
            <span className="editor__table-label">Definition</span>
            <input
              className={`editor__def ${!obj.definition ? "greyedOut" : undefined}`}
              onChange={e => handleInputChange(e, obj._id, "definition")}
              defaultValue={obj.definition}
            />
          </div>

        </div>
      );
    });
    myForm.current.reset()
    setTableRows(rows);
  };

  const handleDictionaryClick = word => {
    axios.post("/getWordData", { word }).then(res => {
      console.log(res)
      const {
        definition,
        audio,
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
    if (selectedText.targetWordObjs.some(obj => !obj.definition)) {
      setInfoMessages([
        {
          text: "All words must have a definition",
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
        Click on words in the text to add/remove them
      </p>
      <div className="editor__text-wrapper">
        <div className="editor__text">{sentencesOfSpanElements}</div>
      </div>
      <p className="editor__instruction2">
        Add/edit word info and get info from the dictionary by
        clicking book image
      </p>
      <form className="editor__table" ref={myForm}>
        <div className="editor__table-header">
          <span className="editor__dic-header"></span>
          <span>Word</span>
          <span>Type</span>
          <span>Singular</span>
          <span>Infinitive</span>
          <span>Main adj.</span>
          <span className="editor__def-header">Definition</span>
        </div>
        {tableRows}
      </form>
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
