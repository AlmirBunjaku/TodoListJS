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

    renderProjects();

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