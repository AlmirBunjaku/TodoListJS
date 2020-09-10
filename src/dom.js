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
        addNewProject(); // ovaj dio prebaciti u display
    })

    const displayProjectModal = () => {
        let modal = document.querySelector('#new-project-modal');
        modal.style.display = 'block';

        let cancelButton = document.querySelector('.cancel-button');
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        })

        window.addEventListener('click', (event) => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

    const addNewProject = () => {
        let newProjectNameInput = document.querySelector('#new-project-name-input');
        let newProjectDescriptionInput = document.querySelector('#new-project-description-input');
        let modal = document.querySelector('#new-project-modal');

        let addButton = document.querySelector('.modal-add-button');
        addButton.addEventListener('click', () => {
            if (newProjectNameInput.value == '' || newProjectDescriptionInput.value == '') {
                alert('Please enter all necessary information.');
            } else {
                control.addProject(newProjectNameInput.value, newProjectDescriptionInput.value);
                control.changeCurrentProject(control.getProjectsArray().length - 1);
                modal.style.display = 'none';
                newProjectNameInput.value = '';
                newProjectDescriptionInput.value = '';
            }
        })
    }
})();