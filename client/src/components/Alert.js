import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

const Alert = ({ alertInfo, closeAlert }) => {
  let icon;
  if (alertInfo.type === "success") {
    icon = faCheckCircle;
  } else if (alertInfo.type === "failure") {
    icon = faTimesCircle;
  } else {
    icon = faExclamationCircle;
  }
  return (
    <div className={`alert alert--${alertInfo.type}`}>
      <span className="alert__icon-wrapper">
        <FontAwesomeIcon icon={icon} />
      </span>
      <p className="alert__text">{alertInfo.text}</p>
      {alertInfo.type === "info" && (
        <span className="alert__close" onClick={closeAlert}>
          &times;
        </span>
      )}
    </div>
  );
};

export default Alert;