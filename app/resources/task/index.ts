import getTask from './get-task';
import createTask from './create-task';
import { IResourceRoute } from '@app/helpers';

const resourceRoutes: IResourceRoute[] = [getTask, createTask];

export default resourceRoutes;
