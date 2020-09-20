import { control } from './control';

const storage = (() => {

    const storeProjects = () => {
        localStorage.setItem('projects', JSON.stringify(control.getProjectsArray()));
    }

    const retrieveProjects = () => {
        if (localStorage.getItem('projects') === null) {
            return control.getProjectsArray();
        } else {
            return JSON.parse(localStorage.getItem('projects'));
        }
    }

    const getStored = () => {
        if (localStorage.getItem('projects') != null) {
            return true;
        } else {
            return false;
        }
    }

    return {
        storeProjects,
        retrieveProjects,
        getStored
    }

})();

export { storage };