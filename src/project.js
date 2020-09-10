const projectControl = {
    setName(name) {
        this.name = name;
    },
    getName() {
        return this.name;
    },

    setDescription() {
        this.description = description;
    },
    getDescription() {
        return this.description;
    },

    addTodo(todo) {
        this.todos.push(todo);
    },
    deleteTodo(todoIndex) {
        this.todos.splice(todoIndex, 1);
    },
    getTodos() {
        return this.todos;
    }
};

const projectFactory = (name, description) => {
    let project = Object.create(projectControl);

    project.name = name;
    project.description = description;
    project.todos = [];

    return project;
};

export {
    projectControl,
    projectFactory
};