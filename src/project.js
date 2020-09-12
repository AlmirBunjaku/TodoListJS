const projectControl = {
    setName(name) {
        this.name = name;
    },
    getName() {
        return this.name;
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

const projectFactory = (name) => {
    let project = Object.create(projectControl);

    project.name = name;
    project.todos = [];

    return project;
};

export {
    projectControl,
    projectFactory
};