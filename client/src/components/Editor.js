import React, { useState, useEffect } from "react";
import axios from "axios";
import createSpanArray from '../utils/createSpanArray'
import WordModal from './WordModal'

const Editor = ({ text, updateText, setInfoMessages }) => {
  const [sentencesOfSpanElements, setSentencesOfSpanElements] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [showWordModal, setShowWordModal] = useState(false)
  const [selectedWordObj, setSelectedWordObj] = useState(null)
  const [wordIsSaved, setWordIsSaved] = useState(null)

  useEffect(() => {
    //make copy of text, otherwise original is modified
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

  const handleWordClick = e => {
    const sentenceIndex = parseInt(e.target.dataset.sentenceIndex);
    const elementIndex = parseInt(e.target.dataset.elementIndex);
    const word = e.target.innerText
    let wordObj
    //if the word is already a target word, retrieve the saved targetWordObj containing the word data
    if (e.target.classList.contains('editor__word--target')) {
      wordObj = selectedText.targetWordObjs.filter(obj => obj.element === elementIndex && obj.sentence === sentenceIndex)[0]
      //this is used to conditionally render a 'delete' button in the modal (only needed if word was already a saved target word) as well as to determine whether a new word obj is to replace an old one or not (in handleSubmit function)
      setWordIsSaved(true)
    }
    else {
      //otherwise create a new obj 
      wordObj = {
        word: word,
        sentence: sentenceIndex,
        element: elementIndex
      }
    }
    //this object is passed down to modal component
    setSelectedWordObj(wordObj)
    setShowWordModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    e.persist()
    //get audio for word from dictionary API (should be added to word without user explicitly requesting)
    //is this inefficient?
    const res = await axios.post("/getWordData", { word: selectedWordObj.word })
    const audio = res.data.audio
    //create object for word with updated data from modal form
    const updatedWordObj = {
      word: selectedWordObj.word,
      sentence: selectedWordObj.sentence,
      element: selectedWordObj.element,
      audio: audio,
      singularForm: e.target.singularForm.value,
      wordType: e.target.wordType.value,
      infinitiveForm: e.target.infinitiveForm.value,
      positiveForm: e.target.positiveForm.value,
      definition: e.target.definition.value
    }
    let updatedWordArr
    //copied from handleWordClick
    //if word was already a target word
    if (wordIsSaved) {
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
    //saving to state optimistically first (this results in the text refreshing with new target word)
    setSelectedText(updatedText)
    updateText(updatedText)
    handleCloseWordModal()
    setInfoMessages([{ type: "success", text: "Word saved" }])
  }

  const handleDictionaryClick = () => {
    axios.post("/getWordData", { word: selectedWordObj.word }).then(res => {
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
    const updatedWordArr = selectedText.targetWordObjs.filter(obj => obj.sentence !== selectedWordObj.sentenceIndex || obj.element !== selectedWordObj.elementIndex)
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

  return (
    <div className="editor__wrapper">
      <p className="editor__instruction1">
        Click on words in the text to edit data
      </p>
      <div className="editor__text-wrapper">
        <div className="editor__text">{sentencesOfSpanElements}</div>
      </div>
      {showWordModal && selectedWordObj && <WordModal selectedWordObj={selectedWordObj} handleCloseWordModal={handleCloseWordModal} handleSubmit={handleSubmit} handleDictionaryClick={handleDictionaryClick} handleDelete={handleDelete} wordIsSaved={wordIsSaved} />}
    </div>
  );
};

export default Editor;
