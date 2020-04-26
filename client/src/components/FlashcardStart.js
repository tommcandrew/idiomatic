import React, { useState } from 'react'

const FlashcardStart = ({ handleStart, studiedWords }) => {
    const [mode, setMode] = useState(null)
    const [numberCards, setNumberCards] = useState(null)

    const handleNumberChange = e => {
        let selectedNum = e.target.value
        if (e.target.value === "all") {
            selectedNum = studiedWords.length
        }
        setNumberCards(selectedNum)
    }

    const handleModeChange = e => {
        const input = e.target.value
        setMode(input)
    }

    const handleSubmit = () => {
        handleStart(mode, numberCards)
    }

    return (
        <div className="flashcardStart__wrapper">
            <div className="flashcardStart__content">
                <div className="flashcardStart__field">
                    <label>Number of cards:</label>
                    <select onChange={handleNumberChange} >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                        <option value="30">30</option>
                        <option value="35">35</option>
                        <option value="40">40</option>
                        <option value="45">45</option>
                        <option value="50">50</option>
                        <option value="all">All</option>
                    </select>
                </div>
                <div className="flashcardStart__field">
                    <label>Mode:</label>
                    <select onChange={handleModeChange} defaultValue="Definition - Word">
                        <option value="Definition - Word">Definition - Word</option>
                        <option value="Word - Definition">Word - Definition</option>
                    </select>
                </div>
                <button onClick={handleSubmit}>Go</button>
            </div>
        </div>
    )
}

export default FlashcardStart
