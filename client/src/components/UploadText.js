import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const UploadText = ({ handleShowDashboard }) => {
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
    axios
      .post("/saveText", {
        title: uploadedFile.fileName,
        content: uploadedFile.content,
        targetWords: selectedWords
      })
      .then(res => {
        console.log(res);
      });
  };

  const handleSelectWord = e => {
    const newWord = e.target.innerText.replace(
      //eslint-disable-next-line
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ""
    );
    console.log(selectedWords);
    setSelectedWords([...refValue.current, newWord]);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="myfile">Select a file:</label>
        <input
          type="file"
          id="myfile"
          name="myfile"
          onChange={handleUpload}
        ></input>
        <button type="submit">Submit</button>
      </form>
      <div className="uploadText__text">
        {uploadedFile && spans && (
          <>
            <div>
              <h2>
                Select the words in the text you would like to be tested on.
                Click submit when you're done.
              </h2>
              <div>{selectedWords}</div>
            </div>
            <div className="uploadText__text-content">
              <h1>{uploadedFile.fileName}</h1>
              <div>{spans}</div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default UploadText;