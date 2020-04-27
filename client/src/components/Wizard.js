import React, { useState } from 'react'
import data from '../assets/wizardData'

const Wizard = ({ setIsNewUser }) => {

    const [slideNum, setSlideNum] = useState(0)

    return (
        <div className="wizard__wrapper">
            <div className="wizard__content">
                <span className="wizard__close" onClick={() => setIsNewUser(false)}>&times;</span>
                <div className="wizard__slide">
                    <p className="wizard__text">{data.text[0][slideNum]}</p>
                    <img className="wizard__gif" src={data.gifs[0][slideNum]} alt="gif" />
                    <div className="wizard__buttons">
                        {slideNum > 0 && <button onClick={() => setSlideNum(slideNum - 1)}>Previous</button>}
                        {slideNum < 8 && <button onClick={() => setSlideNum(slideNum + 1)}>Next</button>}
                        {slideNum === 8 && <button onClick={() => setIsNewUser(false)}>Close</button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wizard
