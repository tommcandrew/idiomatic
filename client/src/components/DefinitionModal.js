import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const DefinitionModal = ({ definition, closeModal, selectedTargetWordObj }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    setAudioUrl(selectedTargetWordObj.audio);
  }, []);
  const handlePlayAudio = () => {
    if (audioUrl !== null) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  let displayedWord;
  if (selectedTargetWordObj.isPlural) {
    displayedWord = selectedTargetWordObj.singularForm;
  } else if (selectedTargetWordObj.wordType === "verb") {
    displayedWord = selectedTargetWordObj.infinitiveForm;
  } else {
    displayedWord = selectedTargetWordObj.word;
  }

  return (
    <div className="definitionModal__wrapper" onClick={closeModal}>
      <div className="definitionModal__content">
        <h3>{displayedWord}</h3>
        <p>{definition}</p>
        {audioUrl && (
          <FontAwesomeIcon
            icon={faPlay}
            onClick={handlePlayAudio}
            className="definitionModal__play-icon"
          />
        )}
        <p className="definitionModal__close" onClick={closeModal}>
          Close
        </p>
      </div>
    </div>
  );
};

export default DefinitionModal;
