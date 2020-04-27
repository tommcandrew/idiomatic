import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import createSpanArray from '../utils/createSpanArray'
import WordModal from './WordModal'

const Editor = ({ text, setCurrentComponent, updateText, setInfoMessages }) => {
  const [sentencesOfSpanElements, setSentencesOfSpanElements] = useState([]);
  // const [tableRows, setTableRows] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  // const [deleting, setDeleting] = useState(false)
  const [showWordModal, setShowWordModal] = useState(false)
  const [selectedWordObj, setSelectedWordObj] = useState(null)
  const [wordIsSaved, setWordIsSaved] = useState(null)

  // const myForm = useRef()

  useEffect(() => {
    //make copy otherwise original is modified
    const textCopy = JSON.parse(JSON.stringify(text))
    setSelectedText(textCopy);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedText) {
      const sentencesOfSpanElements = createSpanArray(selectedText, handleWordClick, "editor__word", "editor__word--target", "editor__punctuation");
      setSentencesOfSpanElements(sentencesOfSpanElements)
    }
    //eslint-disable-next-line
  }, [selectedText]);

  // useEffect(() => {
  //   if (sentencesOfSpanElements && sentencesOfSpanElements.length > 0) {
  //     createTableRows();
  //   }
  //   //eslint-disable-next-line
  // }, [sentencesOfSpanElements]);

  const handleWordClick = e => {
    const sentenceIndex = parseInt(e.target.dataset.sentenceIndex);
    const elementIndex = parseInt(e.target.dataset.elementIndex);
    const word = e.target.innerText
    let wordObj
    //if the word is already a target word, retrieve the saved targetWordObj containing the word data
    if (selectedText.targetWordObjs.some(obj => {
      if (obj.sentence === sentenceIndex && obj.element === elementIndex) {
        return true
      }

    })) {

      wordObj = selectedText.targetWordObjs.filter(obj => obj.element === elementIndex && obj.sentence === sentenceIndex)[0]
      setWordIsSaved(true)
    }
    else {
      //otherwise create a new obj with blank fields 
      wordObj = {
        word: word,
        sentence: sentenceIndex,
        element: elementIndex
      }
    }
    setSelectedWordObj(wordObj)
    setShowWordModal(true)
  }

  const handleSubmit = e => {
    console.log('submitting')
    e.preventDefault()
    console.log(selectedWordObj)
    //create object for word with updated data
    const updatedWordObj = {
      word: selectedWordObj.word,
      sentence: selectedWordObj.sentence,
      element: selectedWordObj.element,
      singularForm: e.target.singularForm.value,
      wordType: e.target.wordType.value,
      infinitiveForm: e.target.infinitiveForm.value,
      positiveForm: e.target.positiveForm.value,
      definition: e.target.definition.value
    }
    let updatedWordArr
    //copied from handleWordClick
    //if word was already a target word
    if (selectedText.targetWordObjs.some(obj => {
      if (obj.sentence === selectedWordObj.sentence && obj.element === selectedWordObj.element) {
        return true
      }

    })) {
      //replace object in selectedText 
      updatedWordArr = selectedText.targetWordObjs.map(obj => {
        if (obj.sentence === selectedWordObj.sentence && obj.element === selectedWordObj.element) {
          obj = updatedWordObj
        }
        return obj;
      });


    } else {
      //otherwise just add it on to the end of the array
      updatedWordArr = [...selectedText.targetWordObjs, updatedWordObj]
    }



    const updatedText = {
      ...selectedText,
      targetWordObjs: updatedWordArr
    };
    console.log('updatedText:')
    console.log(updatedText)

    //saving to state optimistically first (this results in the text refreshing with new target word)
    setSelectedText(updatedText)
    updateText(updatedText)
    handleCloseWordModal()
    setInfoMessages([{ type: "success", text: "Word saved" }])

  }

  const handleDictionaryClick = () => {
    axios.post("/getWordData", { word: selectedWordObj.word }).then(res => {
      console.log(res)
      const {
        definition,
        audio,
        singularForm,
        wordType,
        infinitiveForm,
        positiveForm
      } = res.data;
      const updatedWordObj = {
        word: selectedWordObj.word,
        sentence: selectedWordObj.sentence,
        element: selectedWordObj.element,
        definition,
        audio,
        singularForm,
        wordType,
        infinitiveForm,
        positiveForm
      }
      setSelectedWordObj(updatedWordObj)
    });
  }

  const handleDelete = () => {
    const sentenceIndex = selectedWordObj.sentence;
    const elementIndex = selectedWordObj.element;
    const updatedWordArr = selectedText.targetWordObjs.filter(obj => obj.sentence !== sentenceIndex || obj.element !== elementIndex)
    const updatedText = {
      ...selectedText,
      targetWordObjs: updatedWordArr
    };
    //save to state (optimistically) so text refreshes
    setSelectedText(updatedText);
    updateText(updatedText);
    handleCloseWordModal()
    setInfoMessages([{ type: "success", text: "Word deleted" }])
  }

  const handleCloseWordModal = () => {
    setShowWordModal(false)
    setSelectedWordObj(null)
    setWordIsSaved(null)
  }


  // const handleWordClick = e => {
  //   const sentenceIndex = parseInt(e.target.dataset.sentenceIndex);
  //   const elementIndex = parseInt(e.target.dataset.elementIndex);
  //   const element = e.target.innerText;
  //   let updatedWordArr
  //   //if word has already been selected, remove it from array
  //   if (selectedText.targetWordObjs.some(obj => {
  //     if (obj.sentence === sentenceIndex && obj.element === elementIndex) {
  //       return true
  //     }
  //   })) {
  //     updatedWordArr = selectedText.targetWordObjs.filter(obj => obj.sentence !== sentenceIndex || obj.element !== elementIndex)
  //     setDeleting(true)
  //     //otherwise add it to array
  //   } else {
  //     updatedWordArr = [
  //       ...selectedText.targetWordObjs,
  //       {
  //         word: element,
  //         sentence: sentenceIndex,
  //         element: elementIndex
  //       }
  //     ];
  //   }
  //   //(in either case) update array
  //   const updatedText = {
  //     ...selectedText,
  //     targetWordObjs: updatedWordArr
  //   };
  //   setSelectedText(updatedText);
  // };

  // const createTableRows = () => {
  //   //reset inputs if deleting word, otherwise values don't update
  //   if (deleting) {
  //     myForm.current.reset()
  //     setDeleting(false)
  //   }
  //   const rows = selectedText.targetWordObjs.map((obj, index) => {
  //     return (
  //       <div key={"row" + index} className="editor__table-row">

  //         <div className="editor__table-cell">
  //           <span className="editor__table-label">

  //           </span>
  //           <span
  //             className="editor__dic"
  //             onClick={() => handleDictionaryClick(obj.word)}
  //             title="Get word info from dictionary"
  //           >
  //             &#128366;
  //         </span>
  //         </div>

  //         <div className="editor__table-cell">
  //           <span>{obj.word}</span>
  //         </div>

  //         <div className="editor__table-cell">
  //           <input
  //             onChange={e => handleInputChange(e, obj._id, "wordType")}
  //             className={!obj.wordType ? "greyedOut" : undefined}
  //             defaultValue={obj.wordType}
  //           />
  //         </div>

  //         <div className="editor__table-cell">
  //           <input
  //             onChange={e => handleInputChange(e, obj._id, "singularForm")}
  //             className={!obj.singularForm ? "greyedOut" : undefined}
  //             defaultValue={obj.singularForm}
  //           />
  //         </div>

  //         <div className="editor__table-cell">
  //           <input
  //             onChange={e => handleInputChange(e, obj._id, "infinitiveForm")}
  //             className={!obj.infinitiveForm ? "greyedOut" : undefined}
  //             defaultValue={obj.infinitiveForm}
  //           />
  //         </div>

  //         <div className="editor__table-cell">
  //           <input
  //             onChange={e => handleInputChange(e, obj._id, "positiveForm")}
  //             className={!obj.positiveForm ? "greyedOut" : undefined}
  //             defaultValue={obj.positiveForm}
  //           />
  //         </div>

  //         <div className="editor__table-cell">
  //           <input
  //             className={`editor__def ${!obj.definition ? "greyedOut" : undefined}`}
  //             onChange={e => handleInputChange(e, obj._id, "definition")}
  //             defaultValue={obj.definition}
  //           />
  //         </div>

  //       </div>
  //     );
  //   });
  //   myForm.current.reset()
  //   setTableRows(rows);
  // };

  // const handleDictionaryClick = word => {
  //   axios.post("/getWordData", { word }).then(res => {
  //     console.log(res)
  //     const {
  //       definition,
  //       audio,
  //       singularForm,
  //       wordType,
  //       infinitiveForm,
  //       positiveForm
  //     } = res.data;
  //     let updatedText = { ...selectedText };
  //     for (let i = 0; i < updatedText.targetWordObjs.length; i++) {
  //       if (updatedText.targetWordObjs[i].word === word) {
  //         updatedText.targetWordObjs[i] = {
  //           ...updatedText.targetWordObjs[i],
  //           definition,
  //           audio,
  //           singularForm,
  //           wordType,
  //           infinitiveForm,
  //           positiveForm
  //         };
  //       }
  //     }
  //     setSelectedText(updatedText);
  //   });
  // };

  // const handleInputChange = (e, id, type) => {
  //   //prevent cursor from jumping to front of input field
  //   const caret = e.target.selectionStart
  //   const element = e.target
  //   window.requestAnimationFrame(() => {
  //     element.selectionStart = caret
  //     element.selectionEnd = caret
  //   })

  //   const newValue = e.target.value;
  //   const updatedWordArr = selectedText.targetWordObjs.map(obj => {
  //     if (obj._id === id) {
  //       obj[type] = newValue;
  //     }
  //     return obj;
  //   });

  //   const updatedText = {
  //     ...selectedText,
  //     targetWordObjs: updatedWordArr
  //   };
  //   setSelectedText(updatedText);
  // };

  // const handleSubmit = () => {
  //   if (selectedText.targetWordObjs.length < 3) {
  //     setInfoMessages([
  //       {
  //         text: "Text must contain at least 3 target words",
  //         type: "warning"
  //       }
  //     ]);
  //     return;
  //   }
  //   if (selectedText.targetWordObjs.some(obj => !obj.definition)) {
  //     setInfoMessages([
  //       {
  //         text: "All words must have a definition",
  //         type: "warning"
  //       }
  //     ]);
  //     return;
  //   }
  //   updateText(selectedText);
  //   setCurrentComponent("Dashboard");
  //   setInfoMessages([{ text: "Text updated!", type: "success" }]);
  // };

  // const handleCancel = () => {
  //   setCurrentComponent("Dashboard")
  // }

  return (
    <div className="editor__wrapper">
      <p className="editor__instruction1">
        Click on words in the text to edit data
      </p>
      <div className="editor__text-wrapper">
        <div className="editor__text">{sentencesOfSpanElements}</div>
      </div>
      {/* <p className="editor__instruction2">
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
          onClick={handleCancel}
          className="editor__cancel"
        >
          Cancel
        </button>
      </div> */}
      {showWordModal && selectedWordObj && <WordModal wordObj={selectedWordObj} handleCloseWordModal={handleCloseWordModal} handleSubmit={handleSubmit} handleDictionaryClick={handleDictionaryClick} handleDelete={handleDelete} wordIsSaved={wordIsSaved} />}
    </div>
  );
};

export default Editor;
