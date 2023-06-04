export class Task {
  id: string;
  title: string = 'Task';
  description: string = '';
  completed: boolean = false;

  constructor(id: string) {
    this.id = id;
  }
}
