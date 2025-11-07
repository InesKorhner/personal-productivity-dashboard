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

  export const FREQUENCIES = ['Daily', 'Weekly', '3x/week'] as const;
  export const SECTIONS = ['Morning', 'Afternoon', 'Evening', 'Other'] as const;
  
  export type Frequencies = typeof FREQUENCIES[number];
  export type Sections = typeof SECTIONS[number];

  export type Habit = {
  id: string;
  name: string;
  frequency: number;
  section: Sections;
  startDate: string; 
  checkIns: CheckIn[];
};

export type CheckIn = {
date: string;
isChecked: boolean;
}

