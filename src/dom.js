import { control } from './control';

const projects = control.getProjectsArray();

const projectsList = document.querySelector('#projects-list');
projects.forEach((item) => {
    const name = document.createElement('p');
    name.textContent = item.name;
    name.className = 'project-name';

    const description = document.createElement('p');
    description.textContent = item.description;
    description.className = 'project-description';

    let projectContainer = document.createElement('div');
    projectContainer.className = 'project-class';

    projectContainer.appendChild(name);
    projectContainer.appendChild(description);
    projectsList.appendChild(projectContainer);
})