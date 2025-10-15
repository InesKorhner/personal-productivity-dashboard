export type Task = {
  id: string;
  text: string;
  category: string;
  status: TaskStatus;
  deleted: boolean;
  deletedAt: number | null;
  notes?: string;
}

export interface TaskListProps {
  tasks: Task[];  }

  export enum TaskStatus {
    TODO= 'TODO',
    DONE= 'DONE',
  } 

  export type Habit = {
  name: string;
  frequency: 'Daily' | 'Weekly' | '3x/week';
  section: 'Morning' | 'Afternoon' | 'Evening' | 'Other';
  startDate: string; // YYYY-MM-DD
};