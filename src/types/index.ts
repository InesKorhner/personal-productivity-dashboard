export type Task = {
  id: string
  text: string
  category: string
  completed: boolean
}

export interface TaskListProps {
  tasks: Task[];  }