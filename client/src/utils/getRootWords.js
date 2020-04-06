const getRootWords = arr => {
    const words = arr.map(obj => {
        if (obj.wordType === "verb") {
            return obj.infinitiveForm;
        } else if (obj.singularForm) {
            return obj.singularForm;
        } else if (obj.positiveForm) {
            return obj.positiveForm;
        } else {
            return obj.word;
        }
    });
    return words
}

export default getRootWords