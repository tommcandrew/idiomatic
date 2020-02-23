import React, { useState } from "react";
import axios from "axios";

const UploadText = ({ handleShowDashboard }) => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadedFile, setUploadedFile] = useState({});

  const handleUpload = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      const { fileName, fileContent, filePath } = res.data;
      setUploadedFile({ fileName, fileContent, filePath });
      handleShowDashboard();
    } catch (err) {
      if (err.response.status === 500) {
        console.log("There was a problem with the server!");
      } else {
        console.log(err.response.data.msg);
      }
    }
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
