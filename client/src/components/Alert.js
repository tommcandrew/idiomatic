import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

const Alert = ({ alertInfo }) => {
  return (
    <div
      className={`alert ${
        alertInfo.success ? "alert--success" : "alert--failure"
      }`}
    >
      <span className="alert__icon-wrapper">
        <FontAwesomeIcon
          icon={alertInfo.success ? faCheckCircle : faTimesCircle}
        />
      </span>
      <p className="alert__text">{alertInfo.text}</p>
    </div>
  );
};

export default Alert;
