import type { Task , TaskStatus} from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
    onUndo: (taskId: string) => void;
}

export function TaskList({ tasks, onStatusChange, onDelete, onUndo }: TaskListProps) {
  return (
    <ul className="mt-14 ml-8 w-full max-w-3xl space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} onUndo={onUndo}/>
      ))}
    </ul>
  );
}
