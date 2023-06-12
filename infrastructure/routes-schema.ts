import * as taskRoutes from '../app/resources/task';

const routesSchema = [
  {
    path: 'GET /task/{id}',
    name: 'get-task',
    target: taskRoutes.getTask,
  },
  {
    path: 'GET /task',
    name: 'list-tasks',
    target: taskRoutes.getAllTasks,
  },
  {
    path: 'POST /task',
    name: 'create-task',
    target: taskRoutes.createTask,
  },
  {
    path: 'PUT /task/{id}',
    name: 'update-task',
    target: taskRoutes.updateTask,
  },
  {
    path: 'DELETE /task/{id}',
    name: 'delete-task',
    target: taskRoutes.deleteTask,
  },
];

export { routesSchema };
