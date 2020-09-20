import { control } from './control';
import { DOMcontrol } from './dom';
import './style.css';

DOMcontrol.renderProjects();
control.changeCurrentProject(0);
DOMcontrol.renderTodos();