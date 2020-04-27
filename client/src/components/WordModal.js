import React from 'react'

const WordModal = ({ wordObj, handleSubmit, handleDictionaryClick, handleDelete, wordIsSaved, handleCloseWordModal }) => {

    return (
        <div className="wordModal__wrapper">
            <div className="wordModal__content">
                <form className="wordModal__form" onSubmit={handleSubmit}>
                    <h2 className="wordModal__word">{wordObj.word}</h2>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Word Type: </span>
                        <input type="text" defaultValue={wordObj.wordType} name="wordType" />
                    </div>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Singular Form: </span>
                        <input type="text" defaultValue={wordObj.singularForm} name="singularForm" />
                    </div>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Infinitive Form: </span>
                        <input type="text" defaultValue={wordObj.infinitiveForm} name="infinitiveForm" />
                    </div>
                    <div className="wordModal__field">
                        <span className="wordModal__label">Main Adj: </span>
                        <input type="text" defaultValue={wordObj.positiveForm} name="positiveForm" />
                    </div>
                    <div className="wordModal__field wordModal__field--definition">
                        <span className="wordModal__label">Definition: </span>
                        <textarea type="text" defaultValue={wordObj.definition} name="definition" rows="5" />
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
