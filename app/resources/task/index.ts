import getTask from './get-task';
import createTask from './create-task';
import updateTask from './update-task';
import deleteTask from './delete-task';
import getAllTasks from './get-all-tasks';
import { IResourceRoute } from '@app/helpers';

const resourceRoutes: IResourceRoute[] = [getAllTasks, getTask, createTask, updateTask, deleteTask];

export default resourceRoutes;
