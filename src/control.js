import { projectFactory } from './project';
import { todoFactory } from './todo';
import { noteFactory } from './note';

const control = (() => {
    const defaultProject = projectFactory('General', 'Default project');
    let projects = [defaultProject];
    let currentProject = false;
    let currentProjectIndex = null;

    const addProject = (name, description) => {
        const project = projectFactory(name, description);
        projects.push(project);
    };
    const getProjectsArray = () => {
        return projects;
    };
    const deleteProject = (index) => {
        projects.splice(index, 1);
    };
    const editProject = (index, name, description) => {
        currentProject = projects[index];
        currentProjectIndex = index;
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

    const addNote = (projectIndex, todoIndex, text) => {
        const note = noteFactory(text);
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
        addNote,
        deleteNote,
        editNote,
        resetNotes
    };
})();

export { control };