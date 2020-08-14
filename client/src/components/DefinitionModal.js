import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const DefinitionModal = ({ definition, closeModal, selectedTargetWordObj }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    setAudioUrl(selectedTargetWordObj.audio);
  }, [selectedTargetWordObj]);

  const handlePlayAudio = () => {
    if (audioUrl !== null) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  let displayedWord;
  if (selectedTargetWordObj.singularForm) {
    displayedWord = selectedTargetWordObj.singularForm;
  } else if (selectedTargetWordObj.infinitiveForm) {
    displayedWord = selectedTargetWordObj.infinitiveForm;
  } else if (selectedTargetWordObj.positiveForm) {
    displayedWord = selectedTargetWordObj.positiveForm;
  } else {
    displayedWord = selectedTargetWordObj.word;
  }

  return (
    <div className="definitionModal__wrapper" onClick={closeModal}>
      <div className="definitionModal__content">
        <h3 className="definitionModal__word">{displayedWord.toLowerCase()}</h3>
        <p>{definition}</p>
        {audioUrl && (
          <FontAwesomeIcon
            icon={faPlay}
            onClick={handlePlayAudio}
            className="definitionModal__play-icon"
          />
        )}
        <button className="definitionModal__close" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DefinitionModal;
