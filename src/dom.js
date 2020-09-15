import { control } from './control';
import { projectControl } from './project';
import { todoControl } from './todo';
import { noteControl } from './note';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

const DOMcontrol = (() => {

    const renderProjects = () => {
        const projectsList = document.querySelector('#projects-list');
        while (projectsList.firstChild) {
            projectsList.removeChild(projectsList.firstChild);
        }

        for (let i = 0; i < control.getProjectsArray().length; i++) {

            const projectName = document.createElement('h3');
            projectName.id = 'project-' + i;
            projectName.className = 'project-name';
            projectName.textContent = control.getProjectsArray()[i].name;

            const editButton = document.createElement('button');
            editButton.id = 'edit-' + i;
            editButton.className = 'edit-project';
            editButton.textContent = '/';

            const deleteButton = document.createElement('button');
            deleteButton.id = 'delete-' + i;
            deleteButton.className = 'delete-project';
            deleteButton.textContent = 'X';

            const projectTab = document.createElement('div');
            projectTab.id = 'project-tab-' + i;
            projectTab.className = 'project-tab';
            projectTab.addEventListener('click', () => {
                control.changeCurrentProject(i);
                renderTodos();
            })

            projectTab.appendChild(projectName);
            projectTab.appendChild(editButton);
            projectTab.appendChild(deleteButton);

            projectsList.appendChild(projectTab);
        }

        let deleteButtons = document.querySelectorAll('.delete-project');
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener('click', () => {
                control.deleteProject(deleteButton.id.split('-')[1]);
                renderProjects();
            });
        })

        let editButtons = document.querySelectorAll('.edit-project');
        editButtons.forEach((editButton) => {
            editButton.addEventListener('click', () => {
                displayEditProjectModal();
                control.changeCurrentProject(editButton.id.split('-')[1]);
                confirmEditProject();
                renderProjects();
            })
        })

    }

    const renderTodos = (index = control.getCurrentProjectIndex()) => {
        const todoList = document.querySelector('#todo-list');

        if (control.getProjectsArray().length == 0) {
            console.log('No projects available.');
            while (todoList.firstChild) {
                todoList.removeChild(todoList.firstChild);
            }
        } else {
            while (todoList.firstChild) {
                todoList.removeChild(todoList.firstChild);
            }

            let currentProjectTodos = control.getCurrentProject().getTodos();
            let currentProjectIndex = control.getCurrentProjectIndex();

            if (currentProjectTodos.length == 0) {
                console.log('No todos in this project.'); // convert this to UI element
            } else {
                for (let i = 0; i < currentProjectTodos.length; i++) {

                    const todoName = document.createElement('h4');
                    todoName.id = 'todo-' + currentProjectIndex + '-' + i;
                    todoName.className = 'todo-name';
                    todoName.textContent = currentProjectTodos[i].name;

                    const todoDescription = document.createElement('p');
                    todoDescription.id = 'todo-desc-' + currentProjectIndex + '-' + i;
                    todoDescription.className = 'todo-description';
                    todoDescription.textContent = currentProjectTodos[i].description;

                    const notesButton = document.createElement('button');
                    notesButton.id = 'notes-todo-' + currentProjectIndex + '-' + i;
                    notesButton.className = 'notes-todo';
                    notesButton.textContent = 'Notes';

                    const deleteButton = document.createElement('button');
                    deleteButton.id = 'delete-todo-' + i;
                    deleteButton.className = 'delete-todo';
                    deleteButton.textContent = 'X';

                    const todoDueDate = document.createElement('p');
                    todoDueDate.id = 'todo-due-date-' + currentProjectIndex + '-' + i;
                    todoDueDate.className = 'todo-due-date';
                    todoDueDate.textContent = currentProjectTodos[i].dueDate;

                    const todoBlock = document.createElement('div');
                    todoBlock.id = 'todo-block-' + i;
                    todoBlock.className = 'todo-block';
                    // event listener koji otvara prozor za edit todo

                    todoBlock.appendChild(todoName);
                    todoBlock.appendChild(todoDescription);
                    todoBlock.appendChild(todoDueDate);
                    todoBlock.appendChild(notesButton);
                    todoBlock.appendChild(deleteButton);

                    const todoPriority = currentProjectTodos[i].priority;
                    if (todoPriority == 'high') {
                        todoBlock.style.backgroundColor = 'red';
                    } else if (todoPriority == 'medium') {
                        todoBlock.style.backgroundColor = 'orange';
                    } else {
                        todoBlock.style.backgroundColor = 'yellow';
                    }

                    todoList.appendChild(todoBlock);
                }
            }

            let deleteButtons = document.querySelectorAll('.delete-todo');
            deleteButtons.forEach((deleteButton) => {
                deleteButton.addEventListener('click', () => {
                    control.deleteTodo(control.getCurrentProjectIndex(), deleteButton.id.split('-')[2]);
                    renderProjects();
                    renderTodos();
                });
            })

            let editButtons = document.querySelectorAll('.edit-project');
            editButtons.forEach((editButton) => {
                editButton.addEventListener('click', () => {
                    displayEditProjectModal();
                    control.changeCurrentProject(editButton.id.split('-')[1]);
                    confirmEditProject();
                    renderProjects();
                    renderTodos();
                })
            })
        }



    }


    // ONLOAD FUNCTIONS
    renderProjects();
    control.changeCurrentProject(0);
    renderTodos();
    // ONLOAD FUNCTIONS

    const newProjectButton = document.querySelector('#new-project-button');
    newProjectButton.addEventListener('click', () => {
        displayNewProjectModal();
        addNewProject();
    })

    let newProjectNameInput = document.querySelector('#new-project-name-input');
    let modal = document.querySelector('#new-project-modal');

    const displayNewProjectModal = () => {
        modal.style.display = 'block';
        newProjectNameInput.focus();

        let cancelButton = document.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
            newProjectNameInput.value = '';
        })

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    const addNewProject = () => {
        let addButton = document.querySelector('.modal-add-button');
        addButton.addEventListener('click', (event) => {
            if (newProjectNameInput.value == '') {
                alert('Please enter project title.');
            } else {
                control.addProject(newProjectNameInput.value);
                control.changeCurrentProject(control.getProjectsArray().length - 1);
                modal.style.display = 'none';
                newProjectNameInput.value = '';
            }
            event.stopImmediatePropagation();
            renderProjects();
            renderTodos();
        })
    }

    let editProjectNameInput = document.querySelector('#edit-project-name-input');
    let editModal = document.querySelector('#edit-project-modal');

    const displayEditProjectModal = () => {

        editModal.style.display = 'block';
        editProjectNameInput.focus();

        let cancelEditButton = document.querySelector('.cancel-edit-button');
        cancelEditButton.addEventListener('click', () => {
            console.log('radi'); // ne radi
            editModal.style.display = 'none';
            editProjectNameInput.value = '';
        })

        window.addEventListener('click', (event) => {
            if (event.target == editModal) {
                editModal.style.display = 'none';
            }
        });
    }

    const confirmEditProject = () => {

        let confirmButton = document.querySelector('.modal-confirm-button');
        confirmButton.addEventListener('click', (event) => {
            if (editProjectNameInput.value == '') {
                alert('Please enter new project title or cancel.');
            } else {
                control.editProject(control.getCurrentProjectIndex(), editProjectNameInput.value);
                editModal.style.display = 'none';
                editProjectNameInput.value = '';
            }
            event.stopImmediatePropagation();
            renderProjects();
        })
    }

})();

export { DOMcontrol };