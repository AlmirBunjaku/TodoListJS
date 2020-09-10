const noteControl = {
    setText(text) {
        this.text = text;
    },
    getText() {
        return this.text;
    }
};

const noteFactory = (text) => {
    let note = Object.create(noteControl);

    note.text = text;

    return note;
};

export {
    noteControl,
    noteFactory
};