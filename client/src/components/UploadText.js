import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import dictionaryKey from "../apiKey";

const UploadText = ({ handleShowDashboard, fetchSavedTexts }) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [spans, setSpans] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);

  //necessary to avoid handleSelectWord using stale state
  const refValue = useRef(selectedWords);
  useEffect(() => {
    refValue.current = selectedWords;
  });

  const handleUpload = e => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(res => {
        setUploadedFile(res.data);
        const split = res.data.content.split(" ");
        const spans = split.map((word, index) => (
          <span key={"span" + index} onClick={handleSelectWord}>
            {word}
          </span>
        ));
        setSpans(spans);
      });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const targetSentences = [];
    const allSentences = uploadedFile.content.split(".");
    const allSentencesSplit = [];
    for (let i = 0; i < allSentences.length; i++) {
      const splitSentence = allSentences[i].split(" ");
      allSentencesSplit.push(splitSentence);
    }

    for (let i = 0; i < selectedWords.length; i++) {
      for (let j = 0; j < allSentencesSplit.length; j++) {
        if (allSentencesSplit[j].includes(selectedWords[i])) {
          targetSentences.push(allSentences[j]);
          break;
        }
      }
    }

    const targetWordObjects = [];
    for (let i = 0; i < selectedWords.length; i++) {
      const res = await axios.get(
        "https://dictionaryapi.com/api/v3/references/learners/json/" +
          selectedWords[i] +
          "?key=" +
          dictionaryKey
      );
      const shortDef = res.data[0].shortdef[0];
      let audioUrl;
      if (res.data[0].hwi.prs) {
        audioUrl =
          "https://media.merriam-webster.com/soundc11/" +
          res.data[0].hwi.prs[0].sound.audio.toString().charAt(0) +
          "/" +
          res.data[0].hwi.prs[0].sound.audio +
          ".wav";
      } else {
        audioUrl = null;
      }

      targetWordObjects.push({
        word: selectedWords[i],
        def: shortDef,
        audio: audioUrl
      });
    }
    const token = localStorage.getItem("idiomatic-token");

    axios
      .post(
        "/saveText",
        {
          title: uploadedFile.title,
          content: uploadedFile.content,
          targetWordObjs: targetWordObjects,
          targetWords: selectedWords,
          targetSentences: targetSentences
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      .then(() => {
        handleShowDashboard();
        fetchSavedTexts();
      });
  };

  const handleSelectWord = e => {
    const newWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    setSelectedWords([...refValue.current, newWord]);
  };

  return (
    <div className="uploadText__wrapper">
      <form onSubmit={handleSubmit}>
        <label htmlFor="myfile">Select a file (must be .txt or .pdf):</label>
        <input
          type="file"
          id="myfile"
          name="myfile"
          onChange={handleUpload}
          className="uploadText__choose-file"
        ></input>
        <button type="submit">Submit</button>
      </form>
      <div className="uploadText__text">
        {uploadedFile && spans && (
          <>
            <div className="uploadText__text-wrapper">
              <div className="uploadText__selected-words">
                {selectedWords.map(word => (
                  <div className="uploadText__selected-word">{word}</div>
                ))}
              </div>
              <h2 className="uploadText__instruction">
                Select the words in the text you would like to be tested on.
                When you're done, click submit. You'll find your uploaded text
                in My Texts.
              </h2>
            </div>
            <div className="uploadText__text-content">
              <h1>{uploadedFile.fileName}</h1>
              <div>{spans}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadText;
