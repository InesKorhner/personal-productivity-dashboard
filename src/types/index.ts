export type Task = {
  id: string;
  text: string;
  category: string;
  status: TaskStatus;
  deleted: boolean;
  deletedAt: number | null;
}

export interface TaskListProps {
  tasks: Task[];  }

  export const TaskStatus = {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
  } as const;
  export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];
