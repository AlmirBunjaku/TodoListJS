import { control } from './control';
import { format, parseISO, startOfToday } from 'date-fns';
import { projectControl } from './project';
import { todoControl } from './todo';

const DOMcontrol = (() => {

    const dateMinimum = () => {
        return format(startOfToday(), 'yyyy-MM-dd');
    }

    const renderProjects = () => {
        const projectsList = document.querySelector('#projects-list');
        const projects = control.getProjects();
        while (projectsList.firstChild) {
            projectsList.removeChild(projectsList.firstChild);
        }

        for (let i = 0; i < projects.length; i++) {

            if (control.isStored()) {
                Object.assign(projects[i], projectControl);
            }

            const projectName = document.createElement('h3');
            projectName.id = 'project-' + i;
            projectName.className = 'project-name';
            projectName.textContent = projects[i].name;

            const editButton = document.createElement('button');
            editButton.id = 'edit-' + i;
            editButton.className = 'edit-project';
            editButton.textContent = '⇃';

            const deleteButton = document.createElement('button');
            deleteButton.id = 'delete-' + i;
            deleteButton.className = 'delete-project';
            deleteButton.textContent = '×';

            const projectTab = document.createElement('div');
            projectTab.id = 'project-tab-' + i;
            projectTab.className = 'project-tab';
            projectTab.addEventListener('click', () => {
                control.changeCurrentProject(i);
                renderTodos();
            })

            projectTab.appendChild(projectName);
            projectTab.appendChild(editButton);
            if (i != 0) {
                projectTab.appendChild(deleteButton);
            }

            projectsList.appendChild(projectTab);
        }

        let deleteButtons = document.querySelectorAll('.delete-project');
        deleteButtons.forEach((deleteButton) => {
            deleteButton.addEventListener('click', (event) => {
                control.deleteProject(deleteButton.id.split('-')[1]);
                renderProjects();
                renderTodos();
            });
        })

        let editButtons = document.querySelectorAll('.edit-project');
        editButtons.forEach((editButton) => {
            editButton.addEventListener('click', (event) => {
                control.changeCurrentProject(editButton.id.split('-')[1]);
                displayEditProjectModal();
                confirmEditProject();
                event.stopImmediatePropagation();
            })
        })

    }

    const renderTodos = (index = control.getCurrentProjectIndex()) => {

        const projects = control.getProjects();

        const todoList = document.querySelector('#todo-list');

        if (index >= projects.length) {
            if (projects.length == 0) {
                while (todoList.firstChild) {
                    todoList.removeChild(todoList.firstChild);
                }
            } else {
                control.changeCurrentProject(0);
                Object.assign(control.getCurrentProject(), projectControl);
                renderTodos();
            }
        } else {
            if (projects.length == 0) {
                console.log('No projects available.');
                Object.assign(control.getCurrentProject(), projectControl);
                while (todoList.firstChild) {
                    todoList.removeChild(todoList.firstChild);
                }
            } else {
                while (todoList.firstChild) {
                    todoList.removeChild(todoList.firstChild);
                }
                Object.assign(control.getCurrentProject(), projectControl);

                let currentProjectTodos = control.getCurrentProject().getTodos();
                let currentProjectIndex = control.getCurrentProjectIndex();

                if (currentProjectTodos.length == 0) {
                    console.log('No todos in this project.'); // convert this to UI element
                } else {
                    for (let i = 0; i < currentProjectTodos.length; i++) {
                        Object.assign(currentProjectTodos[i], todoControl);

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
                        todoDueDate.textContent = format(parseISO(currentProjectTodos[i].dueDate), 'dd/MM/yyyy');

                        const todoBlock = document.createElement('div');
                        todoBlock.id = 'todo-block-' + i;
                        todoBlock.className = 'todo-block';
                        todoBlock.addEventListener('click', () => {
                            control.changeCurrentTodo(i);
                            displayEditTodoModal();
                            confirmEditTodo();
                        })

                        todoBlock.appendChild(todoName);
                        todoBlock.appendChild(todoDescription);
                        todoBlock.appendChild(todoDueDate);
                        todoBlock.appendChild(notesButton);
                        todoBlock.appendChild(deleteButton);

                        const todoPriority = currentProjectTodos[i].priority;
                        if (todoPriority == 'high') {
                            todoBlock.style.borderBottom = '7px solid hsl(0, 100%, 42%)';
                        } else if (todoPriority == 'medium') {
                            todoBlock.style.borderBottom = '7px solid hsl(36, 100%, 57%)';
                        } else {
                            todoBlock.style.borderBottom = '7px solid hsl(55, 100%, 50%)';
                        }

                        todoList.appendChild(todoBlock);

                    }
                }

                let deleteButtons = document.querySelectorAll('.delete-todo');
                deleteButtons.forEach((deleteButton) => {
                    deleteButton.addEventListener('click', (event) => {
                        control.deleteTodo(control.getCurrentProjectIndex(), deleteButton.id.split('-')[2]);
                        renderTodos();
                        event.stopImmediatePropagation();
                    });
                })

                let notesButtons = document.querySelectorAll('.notes-todo');
                notesButtons.forEach((button) => {
                    button.addEventListener('click', (event) => {
                        displayNotesModal();
                        renderNotes(button.id.split('-')[3]);
                        control.changeCurrentTodo(parseInt(button.id.split('-')[3]));

                        let addButton = document.querySelector('.modal-add-note-button');
                        addButton.addEventListener('click', (event) => {
                            addNewNote();
                            event.stopImmediatePropagation();
                        })

                        event.stopImmediatePropagation();
                    })
                })
            }
        }
    }

    let notesModal = document.querySelector('#todo-notes-modal');
    let newNoteInput = document.querySelector('#new-note-input');

    const displayNotesModal = () => {
        notesModal.style.display = 'block';
        newNoteInput.focus();

        let cancelButton = document.querySelector('.cancel-note-button');
        cancelButton.addEventListener('click', () => {
            notesModal.style.display = 'none';
            newNoteInput.value = '';
        })

        window.addEventListener('click', (event) => {
            if (event.target == notesModal) {
                notesModal.style.display = 'none';
            }
        })
    }

    const renderNotes = (currentTodo) => {
        let notesList = document.querySelector('#notes-list');
        let notesArray = control.getCurrentProject().getTodos()[currentTodo].notes;

        if (notesArray.length == 0) {
            console.log('No notes for this todo.');
            while (notesList.firstChild) {
                notesList.removeChild(notesList.firstChild);
            }
        } else {
            while (notesList.firstChild) {
                notesList.removeChild(notesList.firstChild);
            }

            for (let i = 0; i < notesArray.length; i++) {
                let note = document.createElement('p');
                note.id = 'note-' + control.getCurrentProjectIndex() + '-' + currentTodo + '-' + i;
                note.className = 'note-text';
                note.textContent = notesArray[i].text;

                notesList.appendChild(note);

                note.addEventListener('dblclick', () => {
                    control.deleteNote(control.getCurrentProjectIndex(), currentTodo, i);
                    renderNotes(currentTodo);
                })
            }
        }
    }

    const addNewNote = () => {
        if (newNoteInput.value == '') {
            alert('Please enter note text.');
        } else {
            control.addNote(control.getCurrentProjectIndex(), control.getCurrentTodoIndex(), newNoteInput.value);
            renderNotes(control.getCurrentTodoIndex());
            newNoteInput.value = '';
        }
    }

    const newProjectButton = document.querySelector('#new-project-button');
    newProjectButton.addEventListener('click', () => {
        displayNewProjectModal();
        addNewProject();
    })

    let newProjectNameInput = document.querySelector('#new-project-name-input');
    let newProjectModal = document.querySelector('#new-project-modal');

    const displayNewProjectModal = () => {
        newProjectModal.style.display = 'block';
        newProjectNameInput.focus();

        let cancelButton = document.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            newProjectModal.style.display = 'none';
            newProjectNameInput.value = '';
        })

        window.addEventListener('click', (event) => {
            if (event.target == newProjectModal) {
                newProjectModal.style.display = 'none';
            }
        });
    }

    const addNewProject = () => {
        const projects = control.getProjects();
        let addButton = document.querySelector('.modal-add-button');
        addButton.addEventListener('click', (event) => {
            if (newProjectNameInput.value == '') {
                alert('Please enter project title.');
            } else {
                control.addProject(newProjectNameInput.value);
                control.changeCurrentProject(projects.length - 1);
                newProjectModal.style.display = 'none';
                newProjectNameInput.value = '';
            }
            event.stopImmediatePropagation();
            renderProjects();
            renderTodos();
        })
    }

    let editProjectNameInput = document.querySelector('#edit-project-name-input');
    let editProjectModal = document.querySelector('#edit-project-modal');

    const displayEditProjectModal = () => {

        editProjectModal.style.display = 'block';
        editProjectNameInput.focus();
        editProjectNameInput.value = control.getCurrentProject().name;

        let cancelEditButton = document.querySelector('.cancel-edit-button');
        cancelEditButton.addEventListener('click', () => {
            editProjectModal.style.display = 'none';
            editProjectNameInput.value = '';
        })

        window.addEventListener('click', (event) => {
            if (event.target == editProjectModal) {
                editProjectModal.style.display = 'none';
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
                editProjectModal.style.display = 'none';
            }
            event.stopImmediatePropagation();
            renderProjects();
        })
    }

    const newTodoButton = document.querySelector('#new-todo-button');
    newTodoButton.addEventListener('click', () => {
        displayNewTodoModal();
        addNewTodo();
    })

    let newTodoNameInput = document.querySelector('#new-todo-name-input');
    let newTodoDescriptionInput = document.querySelector('#new-todo-description-input');
    let newTodoPriorityHigh = document.querySelector('#new-todo-priority-high');
    let newTodoPriorityMedium = document.querySelector('#new-todo-priority-medium');
    let newTodoPriorityLow = document.querySelector('#new-todo-priority-low');
    let newTodoDueDateInput = document.querySelector('#new-todo-date-input');
    newTodoDueDateInput.min = dateMinimum();
    let newTodoModal = document.querySelector('#new-todo-modal');

    const displayNewTodoModal = () => {
        newTodoModal.style.display = 'block';
        newTodoNameInput.focus();

        let cancelButton = document.querySelector('.cancel-new-todo-button');
        cancelButton.addEventListener('click', () => {
            newTodoModal.style.display = 'none';
            newTodoNameInput.value = '';
            newTodoNameInput.value = '';
            newTodoDescriptionInput.value = '';
            newTodoPriorityHigh.checked = 'false';
            newTodoPriorityMedium.checked = 'false';
            newTodoPriorityLow.checked = 'false';
            newTodoDueDateInput.value = '';
        })

        window.addEventListener('click', (event) => {
            if (event.target == newTodoModal) {
                newTodoModal.style.display = 'none';
            }
        });
    }

    const addNewTodo = () => {
        let addButton = document.querySelector('.modal-add-todo-button');
        addButton.addEventListener('click', (event) => {
            if (newTodoNameInput.value == '' || newTodoDescriptionInput.value == '' || (!newTodoPriorityHigh.checked && !newTodoPriorityMedium.checked && !newTodoPriorityLow.checked) || newTodoDueDateInput.value == '') {
                alert('Please enter all necessary info.');
            } else {
                if (newTodoPriorityHigh.checked) {
                    control.addTodo(control.getCurrentProjectIndex(), newTodoNameInput.value, newTodoDescriptionInput.value, newTodoPriorityHigh.value, newTodoDueDateInput.value);
                } else if (newTodoPriorityMedium.checked) {
                    control.addTodo(control.getCurrentProjectIndex(), newTodoNameInput.value, newTodoDescriptionInput.value, newTodoPriorityMedium.value, newTodoDueDateInput.value);
                } else {
                    control.addTodo(control.getCurrentProjectIndex(), newTodoNameInput.value, newTodoDescriptionInput.value, newTodoPriorityLow.value, newTodoDueDateInput.value);
                }
                newTodoModal.style.display = 'none';
                newTodoNameInput.value = '';
                newTodoDescriptionInput.value = '';
                newTodoPriorityHigh.checked = 'false';
                newTodoPriorityMedium.checked = 'false';
                newTodoPriorityLow.checked = 'false';
                newTodoDueDateInput.value = '';
            }
            event.stopImmediatePropagation();
            renderProjects();
            renderTodos();
        })
    }

    let editTodoNameInput = document.querySelector('#edit-todo-name-input');
    let editTodoDescriptionInput = document.querySelector('#edit-todo-description-input');
    let editTodoPriorityHigh = document.querySelector('#edit-todo-priority-high');
    let editTodoPriorityMedium = document.querySelector('#edit-todo-priority-medium');
    let editTodoPriorityLow = document.querySelector('#edit-todo-priority-low');
    let editTodoDueDateInput = document.querySelector('#edit-todo-date-input');
    editTodoDueDateInput.min = dateMinimum();
    let editTodoModal = document.querySelector('#edit-todo-modal');

    const displayEditTodoModal = () => {

        editTodoModal.style.display = 'block';
        editTodoNameInput.focus();
        editTodoNameInput.value = control.getCurrentTodo().getName();
        editTodoDescriptionInput.value = control.getCurrentTodo().getDescription();
        editTodoDueDateInput.value = control.getCurrentTodo().getDueDate();
        if (control.getCurrentTodo().getPriority() == 'high') {
            editTodoPriorityHigh.checked = 'true';
        } else if (control.getCurrentTodo().getPriority() == 'medium') {
            editTodoPriorityMedium.checked = 'true';
        } else {
            editTodoPriorityLow.checked = 'true';
        }

        let cancelEditButton = document.querySelector('.cancel-edit-todo-button');
        cancelEditButton.addEventListener('click', () => {
            editTodoModal.style.display = 'none';
        })

        window.addEventListener('click', (event) => {
            if (event.target == editTodoModal) {
                editTodoModal.style.display = 'none';
            }
        });
    }

    const confirmEditTodo = () => {

        let confirmButton = document.querySelector('.modal-confirm-edit-todo-button');
        confirmButton.addEventListener('click', (event) => {
            if (editTodoNameInput.value == '' || editTodoDescriptionInput.value == '' || (!editTodoPriorityHigh.checked && !editTodoPriorityMedium.checked && !editTodoPriorityLow.checked) || editTodoDueDateInput.value == '') {
                alert('Please enter new to-do information or cancel.');
            } else {
                if (editTodoPriorityHigh.checked) {
                    control.editTodo(control.getCurrentProjectIndex(), control.getCurrentTodoIndex(), editTodoNameInput.value, editTodoDescriptionInput.value, editTodoPriorityHigh.value, editTodoDueDateInput.value);
                } else if (editTodoPriorityMedium.checked) {
                    control.editTodo(control.getCurrentProjectIndex(), control.getCurrentTodoIndex(), editTodoNameInput.value, editTodoDescriptionInput.value, editTodoPriorityMedium.value, editTodoDueDateInput.value);
                } else {
                    control.editTodo(control.getCurrentProjectIndex(), control.getCurrentTodoIndex(), editTodoNameInput.value, editTodoDescriptionInput.value, editTodoPriorityLow.value, editTodoDueDateInput.value);
                }
                editTodoModal.style.display = 'none';
                renderTodos();
            }
            event.stopImmediatePropagation();
        })
    }

    return {
        renderProjects,
        renderTodos
    }

})();

export { DOMcontrol };