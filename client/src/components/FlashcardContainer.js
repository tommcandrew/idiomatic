import React, { useState } from 'react';
import FlashcardStart from './FlashcardStart'
import FlashcardTest from './FlashcardTest'

const FlashcardContainer = ({ studiedWords, setCurrentComponent }) => {
    const [component, setComponent] = useState("FlashcardStart")
    const [mode, setMode] = useState(null)
    const [numberCards, setNumberCards] = useState(null)

    const handleStart = (mode, numberCards) => {
        setComponent("FlashcardTest")
        setNumberCards(numberCards)
        setMode(mode)
    }

    return (
        <div className="flashcardContainer__wrapper">
            {component === "FlashcardStart" && <FlashcardStart handleStart={handleStart} />}
            {component === "FlashcardTest" && <FlashcardTest mode={mode} numberCards={numberCards} studiedWords={studiedWords} setCurrentComponent={setCurrentComponent} />}

        </div>
    )
}

export default FlashcardContainer
