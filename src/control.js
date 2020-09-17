import { projectControl, projectFactory } from './project';
import { todoFactory } from './todo';
import { noteFactory } from './note';

const control = (() => {
    const defaultProject = projectFactory('General');
    const testProject = projectFactory('Test');
    let projects = [defaultProject, testProject];

    // test data
    projects[0].todos.push(todoFactory('naslov', 'opis', 'high', '2020-08-09'));
    projects[0].todos.push(todoFactory('drugi', 'opis', 'low', '2020-08-09'));
    projects[0].todos[0].notes.push(noteFactory('1x1'));
    projects[0].todos[0].notes.push(noteFactory('1x2'));
    projects[0].todos[1].notes.push(noteFactory('2x1'));
    projects[0].todos[1].notes.push(noteFactory('2x2'));
    projects[1].todos.push(todoFactory('naslov', 'opis', 'low', '2020-08-09'));
    projects[1].todos.push(todoFactory('drugi', 'opis', 'high', '2020-08-09'));
    projects[1].todos[0].notes.push(noteFactory('1x1'));
    projects[1].todos[0].notes.push(noteFactory('1x2'));
    projects[1].todos[1].notes.push(noteFactory('2x1'));
    projects[1].todos[1].notes.push(noteFactory('2x2'));
    // test data

    let currentProject = false;
    let currentProjectIndex = null;
    let currentTodo = false;
    let currentTodoIndex = null;

    const addProject = (name) => {
        const project = projectFactory(name);
        projects.push(project);
    };
    const deleteProject = (index) => {
        projects.splice(index, 1);
    };
    const editProject = (index, name) => {
        currentProject = projects[index];
        currentProjectIndex = index;
        currentProject.name = name;
    };
    const getProjectsArray = () => {
        return projects;
    };
    const getCurrentProject = () => {
        return currentProject;
    };
    const getCurrentProjectIndex = () => {
        return currentProjectIndex;
    };
    const changeCurrentProject = (index) => {
        currentProject = projects[index];
        currentProjectIndex = index;
    };
    const resetCurrentProject = () => {
        currentProject = false;
        currentProjectIndex = null;
    };

    const addTodo = (projectIndex, name, description, priority, dueDate) => {
        const todo = todoFactory(name, description, priority, dueDate);
        projects[projectIndex].addTodo(todo);
    };
    const deleteTodo = (projectIndex, todoIndex) => {
        projects[projectIndex].deleteTodo(todoIndex);
    };
    const editTodo = (projectIndex, todoIndex, name, description, priority, dueDate) => {
        const todo = projects[projectIndex].getTodos()[todoIndex];
        todo.setName(name);
        todo.setDescription(description);
        todo.setPriority(priority);
        todo.setDueDate(dueDate);
    };
    const getCurrentTodo = () => {
        return currentTodo;
    };
    const getCurrentTodoIndex = () => {
        return currentTodoIndex;
    };
    const changeCurrentTodo = (index) => {
        currentTodoIndex = index;
    };

    const addNote = (projectIndex, todoIndex, text) => {
        const note = noteFactory(text);
        console.log('Primljeni podaci (' + projectIndex + ',' + todoIndex + ',' + 'text' + ')');
        projects[projectIndex].getTodos()[todoIndex].addNote(note);
    };
    const deleteNote = (projectIndex, todoIndex, noteIndex) => {
        projects[projectIndex].getTodos()[todoIndex].deleteNote(noteIndex);
    };
    const editNote = (projectIndex, todoIndex, noteIndex, text) => {
        const note = projects[projectIndex].getTodos()[todoIndex].getNotes()[noteIndex];
        note.setText(text);
    };
    const resetNotes = (projectIndex, todoIndex) => {
        projects[projectIndex].getTodos()[todoIndex].resetNotes();
    }

    return {
        addProject,
        deleteProject,
        editProject,
        getProjectsArray,
        getCurrentProject,
        getCurrentProjectIndex,
        changeCurrentProject,
        resetCurrentProject,
        addTodo,
        deleteTodo,
        editTodo,
        getCurrentTodo,
        getCurrentTodoIndex,
        changeCurrentTodo,
        addNote,
        deleteNote,
        editNote,
        resetNotes
    };
})();

export { control };