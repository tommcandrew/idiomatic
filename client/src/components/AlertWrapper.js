import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faExclamationCircle,
  faLightbulb
} from "@fortawesome/free-solid-svg-icons";

const getIcon = message => {
  let icon;
  if (message.type === "success") {
    icon = faCheckCircle;
  } else if (message.type === "failure") {
    icon = faTimesCircle;
  } else if (message.type === "info") {
    icon = faLightbulb;
  } else {
    icon = faExclamationCircle;
  }
  return icon;
};

const AlertWrapper = ({ messages }) => {
  return (
    <div className="alerts__wrapper">
      {messages.map((message, index) => (
        <div className={`alert alert--${message.type}`} key={"alert" + index}>
          <span className="alert__icon-wrapper">
            <FontAwesomeIcon icon={getIcon(message)} />
          </span>
          <p className="alert__text">{message.text}</p>
        </div>
      ))}
    </div>
  );
};

export default AlertWrapper;
