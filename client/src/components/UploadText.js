import React, { useState } from "react";
import axios from "axios";

const UploadText = ({ handleShowDashboard }) => {
  const [file, setFile] = useState("");

  const handleUpload = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        handleShowDashboard();
      })
      .catch(err => {
        console.log(err);
      });
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
    </>
  );
};

export default UploadText;
