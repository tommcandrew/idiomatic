import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AlertWrapper from "./AlertWrapper";

const UploadText = ({
  setCurrentComponent,
  fetchSavedTexts,
  setInfoMessages,
  infoMessages,
  savedTexts,
  closeAlert
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showOptionButtons, setShowOptionButtons] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showPasteForm, setShowPasteForm] = useState(false);
  const [splitSentencesWithObjs, setSplitSentencesWithObjs] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [allSentences, setAllSentences] = useState([]);
  const [loading, setLoading] = useState(false);

  //necessary to avoid handleSelectWord using stale state
  const refValue = useRef(selectedWords);
  useEffect(() => {
    refValue.current = selectedWords;
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
    if (!e.target.elements.myfile && !e.target.pasted.value) {
      setInfoMessages([
        { text: "Either choose a file or paste some text", type: "warning" }
      ]);
      return;
    }
    let allSentences = [];
    const formData = new FormData();
    if (showUploadForm) {
      formData.append("file", e.target.elements.myfile.files[0]);
      axios
        .post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          if (res.data.content.length < 50) {
            alert("The text must be at least 50 characters long");
            return;
          }
          for (let i = 0; i < savedTexts.length; i++) {
            if (savedTexts[i].title === res.data.title) {
              setInfoMessages([
                ...infoMessages,
                {
                  text: "A text with that name already exists",
                  type: "warning"
                }
              ]);
              return;
            }
          }

          setShowUploadForm(false);
          setShowPasteForm(false);
          setUploadedFile(res.data);
          allSentences = res.data.content.match(/[^.!?]+[.!?]+/g);
          //for some reason this variable is not accessible in the final part of this function so am saving to state
          setAllSentences(allSentences);
        });
    } else {
      const content = e.target.pasted.value;
      const title = e.target.title.value;
      if (!title) {
        setInfoMessages([
          ...infoMessages,
          { text: "You must add a title", type: "warning" }
        ]);
        return;
      }
      if (content.length < 50) {
        setInfoMessages([
          ...infoMessages,
          {
            text: "The text must be at least 50 characters long",
            type: "warning"
          }
        ]);
        return;
      }
      setShowUploadForm(false);
      setShowPasteForm(false);
      setUploadedFile({ content, title });
      const trimmed = content.trim();
      allSentences = trimmed.match(/[^.!?]+[.!?]+/g);
      setAllSentences(allSentences);
    }
  };

  useEffect(() => {
    //wait for code above to finish before doing the rest
    const splitSentences = allSentences.map(sentence => {
      return sentence.match(/[\w'’]+|[.,!?;]/g);
    });
    const splitSentencesWithObjs = splitSentences.map(
      (sentence, sentenceIndex) => {
        return sentence.map((el, elIndex) => {
          return { element: el, sentenceIndex, elIndex };
        });
      }
    );
    setSplitSentencesWithObjs(splitSentencesWithObjs);
  }, [allSentences]);

  const handleSubmit = e => {
    setLoading(true);
    e.preventDefault();
    const token = localStorage.getItem("idiomatic-token");
    axios
      .post(
        "/api/saveText",
        {
          title: uploadedFile.title,
          selectedWords,
          content: uploadedFile.content
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )
      .then(res => {
        setInfoMessages(res.data);
        setCurrentComponent("MyTexts");
        fetchSavedTexts();
      });
  };

  const handleSelectWord = e => {
    const sentenceIndex = parseInt(e.target.dataset.sentenceIndex);
    const elementIndex = parseInt(e.target.dataset.elementIndex);
    const element = e.target.innerText;
    if (e.target.classList.contains("uploadText__word--selected")) {
      const updatedSelectedWords = selectedWords.filter(
        obj =>
          obj.sentenceIndex !== sentenceIndex ||
          obj.elementIndex !== elementIndex
      );
      setSelectedWords([...updatedSelectedWords]);
      return;
    }

    setSelectedWords([
      ...refValue.current,
      { element, sentenceIndex, elementIndex }
    ]);
  };

  const getElementClassNames = (sentenceIndex, elementIndex, element) => {
    const classNames = ["uploadText__element"];
    for (let i = 0; i < selectedWords.length; i++) {
      if (
        selectedWords[i].sentenceIndex === sentenceIndex &&
        selectedWords[i].elementIndex === elementIndex
      ) {
        classNames.push("uploadText__word--selected");
      }
    }
    const nonWordElements = [",", ",", "'", "?", "!", "."];
    if (nonWordElements.includes(element)) {
      classNames.push("uploadText__punctuation");
    } else {
      classNames.push("uploadText__word");
    }
    return classNames.join(" ");
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="uploadText__wrapper">
      {showOptionButtons && (
        <div className="uploadText__option-buttons">
          <button onClick={handleShowUploadForm}>Upload file</button>
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
          <div className="uploadText__submit-buttons">
            <button type="submit" className="uploadText__go">
              Go
            </button>
            <button type="button" onClick={goBack} className="uploadText__back">
              Back
            </button>
          </div>
        </form>
      )}
      {showPasteForm && (
        <form onSubmit={handleUpload}>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" className="uploadText__title-input" />
          <label htmlFor="content">Content</label>
          <textarea
            name="pasted"
            className="uploadText__text-input"
            id="content"
          ></textarea>
          <button type="submit" className="uploadText__go">
            Go
          </button>
          <button type="button" onClick={goBack} className="uploadText__back">
            Back
          </button>
        </form>
      )}
      <div className="uploadText__text">
        {uploadedFile && splitSentencesWithObjs && (
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
                {splitSentencesWithObjs.map((sentence, sentenceIndex) =>
                  sentence.map((obj, elementIndex) => (
                    <span
                      data-sentence-index={sentenceIndex}
                      data-element-index={elementIndex}
                      key={"span" + (sentenceIndex + elementIndex)}
                      onClick={handleSelectWord}
                      className={getElementClassNames(
                        sentenceIndex,
                        elementIndex,
                        obj.element
                      )}
                    >
                      {obj.element}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="uploadText__buttons">
              <button onClick={handleSubmit} className="uploadText__save">
                Save
              </button>
              <button
                onClick={() => setCurrentComponent("Dashboard")}
                className="uploadText__cancel"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {infoMessages.length > 0 && (
          <AlertWrapper messages={infoMessages} closeAlert={closeAlert} />
        )}
      </div>
    </div>
  );
};

export default UploadText;
