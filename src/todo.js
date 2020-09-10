const todoControl = {
    setName(name) {
        this.name = name;
    },
    getName() {
        return this.name;
    },

    setDescription(description) {
        this.description = description;
    },
    getDescription() {
        return this.description;
    },

    setPriority(priority) {
        this.priority = priority;
    },
    getPriority() {
        return this.priority;
    },

    setDueDate(dueDate) {
        this.dueDate = dueDate;
    },
    getDueDate() {
        return this.dueDate;
    },

    addNote(note) {
        this.notes.push(note);
    },
    deleteNote(noteIndex) {
        this.notes.splice(noteIndex, 1);
    },
    resetNotes() {
        this.notes.splice(0, this.notes.length);
    },
    getNotes() {
        return this.notes;
    },
};

const todoFactory = (name, description, priority, dueDate) => {
    let todo = Object.create(todoControl);

    todo.name = name;
    todo.description = description;
    todo.priority = priority;
    todo.dueDate = dueDate;
    todo.notes = [];

    return todo;
};

export {
    todoControl,
    todoFactory
};