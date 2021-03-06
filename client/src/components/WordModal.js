import React from 'react'

const WordModal = ({ selectedWordObj, handleSubmit, handleDictionaryClick, handleDelete, wordIsSaved, handleCloseWordModal }) => {

    return (
        <div className="wordModal__wrapper">
            <div className="wordModal__content">
                <form className="wordModal__form" onSubmit={handleSubmit}>
                    <h2 className="wordModal__word">{selectedWordObj.word}</h2>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Word Type: </span>
                        <input type="text" defaultValue={selectedWordObj.wordType} name="wordType" />
                    </div>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Singular Form: </span>
                        <input type="text" defaultValue={selectedWordObj.singularForm} name="singularForm" />
                    </div>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Infinitive Form: </span>
                        <input type="text" defaultValue={selectedWordObj.infinitiveForm} name="infinitiveForm" />
                    </div>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Main Adj: </span>
                        <input type="text" defaultValue={selectedWordObj.positiveForm} name="positiveForm" />
                    </div>
                    <div className="wordModal__field wordModal__field--definition">
                        <span className="wordModal__label">Definition: </span>
                        <textarea type="text" defaultValue={selectedWordObj.definition} name="definition" rows="5" />
                    </div>
                    <div className="wordModal__buttons">
                        <button type="button" onClick={handleDictionaryClick}>Get dictionary data</button>
                        <div className="wordModal__main-buttons">
                            <button type="button" onClick={handleCloseWordModal}>Cancel</button>
                            {wordIsSaved && <button type="button" onClick={handleDelete}>Delete</button>}
                            <button type="submit">Save</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default WordModal
