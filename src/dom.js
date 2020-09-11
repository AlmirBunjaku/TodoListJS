import { control } from './control';
import { projectControl } from './project';
import { todoControl } from './todo';
import { noteControl } from './note';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

const DOMcontrol = (() => {
    const newProjectButton = document.querySelector('#new-project-button');
    newProjectButton.addEventListener('click', () => {
        displayProjectModal();
        addNewProject();
    })

    let newProjectNameInput = document.querySelector('#new-project-name-input');
    let newProjectDescriptionInput = document.querySelector('#new-project-description-input');
    let modal = document.querySelector('#new-project-modal');

    const displayProjectModal = () => {
        modal.style.display = 'block';

        let cancelButton = document.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
            newProjectNameInput.value = '';
            newProjectDescriptionInput.value = '';
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
            if (newProjectNameInput.value == '' || newProjectDescriptionInput.value == '') {
                alert('Please enter all necessary information.');
            } else {
                control.addProject(newProjectNameInput.value, newProjectDescriptionInput.value);
                control.changeCurrentProject(control.getProjectsArray().length - 1);
                console.log(control.getCurrentProject());
                console.log(control.getProjectsArray());
                modal.style.display = 'none';
                newProjectNameInput.value = '';
                newProjectDescriptionInput.value = '';
            }
            event.stopImmediatePropagation();
        })
    }
})();