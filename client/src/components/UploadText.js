import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const UploadText = ({
  handleShowMyTexts,
  fetchSavedTexts,
  setErrorMessages
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [splitText, setSplitText] = useState(null);
  const [selectedWordIndices, setSelectedWordIndices] = useState([]);
  const [showOptionButtons, setShowOptionButtons] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showPasteForm, setShowPasteForm] = useState(false);

  //necessary to avoid handleSelectWord using stale state
  const refValue = useRef(selectedWordIndices);
  useEffect(() => {
    refValue.current = selectedWordIndices;
  });

  const goBack = () => {
    setShowUploadForm(false);
    setShowPasteForm(false);
    setShowOptionButtons(true);
  };

  const handleShowUploadForm = () => {
    setShowOptionButtons(false);
    setShowUploadForm(true);
  };

  const handleShowPasteForm = () => {
    setShowOptionButtons(false);
    setShowPasteForm(true);
  };

  const handleUpload = e => {
    e.preventDefault();
    const formData = new FormData();
    let splitText;
    if (showUploadForm) {
      formData.append("file", e.target.elements.myfile.files[0]);
      axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          if (res.data.content.length < 50) {
            alert("The text must be at least 50 characters long");
            return;
          }
          setShowUploadForm(false);
          setShowPasteForm(false);
          setUploadedFile(res.data);
          splitText = res.data.content.match(/\w+|\s+|[^\s\w]+/g);
          setSplitText(splitText);
        });
    } else {
      const content = e.target.pasted.value;
      const title = e.target.title.value;
      if (!title) {
        alert("You must add a title");
        return;
      }
      if (content.length < 50) {
        alert("The text must be at least 50 characters long");
        return;
      }
      setShowUploadForm(false);
      setShowPasteForm(false);
      setUploadedFile({ content, title });
      splitText = content.match(/\w+|\s+|[^\s\w]+/g);
      setSplitText(splitText);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    //eslint-disable-next-line
    const selectedWords = splitText.filter((word, index) => {
      if (selectedWordIndices.includes(index)) {
        return word;
      }
    });

    const targetSentences = [];
    let allSentences;
    allSentences = uploadedFile.content.split(".");
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
    const set = new Set(targetSentences);
    const targetSentencesNoDuplicates = [...set];
    const res = await axios.post("/getWordData", { selectedWords });
    let errorMessages;
    if (res.data.errorMessages.length > 0) {
      errorMessages = res.data.errorMessages;
    }
    const targetWordObjects = res.data.targetWordObjects;
    const token = localStorage.getItem("idiomatic-token");

    axios
      .post(
        "/saveText",
        {
          title: uploadedFile.title,
          content: uploadedFile.content,
          targetWordObjs: targetWordObjects,
          targetWords: selectedWords,
          targetSentences: targetSentencesNoDuplicates
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      .then(() => {
        setErrorMessages(errorMessages);
        handleShowMyTexts();
        fetchSavedTexts();
      });
  };

  const handleSelectWord = e => {
    const selectedIndex = parseInt(e.target.dataset.index);
    if (e.target.classList.contains("uploadText__word--selected")) {
      const updatedSelectedWordIndices = selectedWordIndices.filter(
        index => index !== selectedIndex
      );
      setSelectedWordIndices([...updatedSelectedWordIndices]);
      return;
    }

    setSelectedWordIndices([...refValue.current, selectedIndex]);
  };

  return (
    <div className="uploadText__wrapper">
      {showOptionButtons && (
        <div className="uploadText__option-buttons">
          <button onClick={handleShowUploadForm}>
            Upload file from computer
          </button>
          <button onClick={handleShowPasteForm}>Paste text</button>
        </div>
      )}
      {showUploadForm && (
        <form onSubmit={handleUpload}>
          <label htmlFor="myfile">Select a file (must be .txt or .pdf):</label>
          <input
            type="file"
            id="myfile"
            name="myfile"
            className="uploadText__choose-file"
          ></input>
          <button type="submit">Go</button>
          <button type="button" onClick={goBack}>
            Back
          </button>
        </form>
      )}
      {showPasteForm && (
        <form onSubmit={handleUpload}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" />
          <textarea name="pasted" cols="150" rows="20"></textarea>
          <button type="submit">Go</button>
          <button type="button" onClick={goBack}>
            Back
          </button>
        </form>
      )}
      <div className="uploadText__text">
        {uploadedFile && splitText && (
          <>
            <div className="uploadText__text-wrapper">
              <h2 className="uploadText__instruction">
                Select the words in the text you would like to be tested on.
                When you're done, click submit. You'll find your uploaded text
                in My Texts.
              </h2>
            </div>
            <div className="uploadText__text-content">
              <h1>{uploadedFile.fileName}</h1>
              <div>
                {splitText.map((word, index) => (
                  <span
                    key={"span" + index}
                    onClick={handleSelectWord}
                    data-index={index}
                    className={`uploadText__word ${
                      selectedWordIndices.includes(index)
                        ? "uploadText__word--selected"
                        : ""
                    } ${
                      word === "." ||
                      word === "," ||
                      word === "'" ||
                      word === "?"
                        ? "uploadText__punctuation"
                        : ""
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={handleSubmit}>Save</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadText;
