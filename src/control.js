import { projectControl, projectFactory } from './project';
import { todoControl, todoFactory } from './todo';
import { noteFactory } from './note';
import { storage } from './storage';

const control = (() => {
    const defaultProject = projectFactory('General');
    let projects = [defaultProject];

    let currentProject = false;
    let currentProjectIndex = null;
    let currentTodo = false;
    let currentTodoIndex = null;

    const addProject = (name) => {
        projects = storage.retrieveProjects();
        const project = projectFactory(name);
        projects.push(project);
        storage.storeProjects();
    };
    const deleteProject = (index) => {
        projects = storage.retrieveProjects();
        projects.splice(index, 1);
        storage.storeProjects();
    };
    const editProject = (index, name) => {
        currentProject = projects[index];
        currentProjectIndex = index;
        currentProject.name = name;
        storage.storeProjects();
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
        projects = storage.retrieveProjects();
        currentProject = projects[index];
        currentProjectIndex = index;
    };
    const resetCurrentProject = () => {
        currentProject = false;
        currentProjectIndex = null;
    };
    const isStored = () => {
        return storage.getStored();
    }
    const getProjects = () => {
        return storage.retrieveProjects();
    }

    const addTodo = (projectIndex, name, description, priority, dueDate) => {
        const todo = todoFactory(name, description, priority, dueDate);
        Object.assign(projects[projectIndex], projectControl);
        projects[projectIndex].addTodo(todo);
        storage.storeProjects();
    };
    const deleteTodo = (projectIndex, todoIndex) => {
        Object.assign(projects[projectIndex], projectControl);
        projects[projectIndex].deleteTodo(todoIndex);
        storage.storeProjects();
    };
    const editTodo = (projectIndex, todoIndex, name, description, priority, dueDate) => {
        Object.assign(projects[projectIndex], projectControl);
        const todo = projects[projectIndex].getTodos()[todoIndex];
        Object.assign(todo, todoControl);
        todo.setName(name);
        todo.setDescription(description);
        todo.setPriority(priority);
        todo.setDueDate(dueDate);
        storage.storeProjects();
    };
    const getCurrentTodo = () => {
        return currentTodo;
    };
    const getCurrentTodoIndex = () => {
        return currentTodoIndex;
    };
    const changeCurrentTodo = (todoIndex) => {
        currentTodo = projects[getCurrentProjectIndex()].getTodos()[todoIndex];
        currentTodoIndex = todoIndex;
    };
    const changeTodoStatus = (projectIndex, todoIndex) => {
        Object.assign(projects[projectIndex], projectControl);
        projects[projectIndex].getTodos()[todoIndex].changeStatus();
        storage.storeProjects();
    };
    const getTodoStatus = () => {
        return currentTodo.status;
    };

    const addNote = (projectIndex, todoIndex, text) => {
        const note = noteFactory(text);
        projects[projectIndex].getTodos()[todoIndex].addNote(note);
        storage.storeProjects();
    };
    const deleteNote = (projectIndex, todoIndex, noteIndex) => {
        projects[projectIndex].getTodos()[todoIndex].deleteNote(noteIndex);
        storage.storeProjects();
    }
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
        isStored,
        getProjects,
        addTodo,
        deleteTodo,
        editTodo,
        getCurrentTodo,
        getCurrentTodoIndex,
        changeCurrentTodo,
        changeTodoStatus,
        getTodoStatus,
        addNote,
        deleteNote,
        resetNotes
    };
})();

export { control };