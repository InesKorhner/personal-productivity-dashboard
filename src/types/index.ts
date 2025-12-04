export type Task = {
  id: string;
  text: string;
  category: string;
  status: TaskStatus;
  deleted: boolean;
  deletedAt: number | null;
  notes?: string;
  date?: string;
};

export interface TaskListProps {
  tasks: Task[];
}

export enum TaskStatus {
  TODO = 'TODO',
  DONE = 'DONE',
}

export const FREQUENCIES = ['Daily', 'Weekly', '3x/week'] as const;
export const SECTIONS = ['Morning', 'Afternoon', 'Evening', 'Others'] as const;
export const CATEGORIES = ['MyList', 'Work', 'Exercise', 'Study'] as const;

export type Frequencies = (typeof FREQUENCIES)[number];
export type Sections = (typeof SECTIONS)[number];
export type Categories = (typeof CATEGORIES)[number];

export type Habit = {
  id: string;
  name: string;
  frequency: number;
  section: Sections;
  startDate: string;
  checkIns: CheckIn[];
};

export type CheckIn = {
  id: string;
  date: string;
  isChecked: boolean;
};
