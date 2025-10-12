import type { Task, TaskStatus } from '@/types';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onUndo: (taskId: string) => void;
  onPermanentDelete: (taskId: string) => void;
  onSelectTask: (taskId: string | null) => void;
}

export function TaskList({
  tasks,
  onStatusChange,
  onDelete,
  onUndo,
  onPermanentDelete,
  onSelectTask,
}: TaskListProps) {
  return (
    <ul className="space-y-2 px-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          onUndo={onUndo}
          onPermanentDelete={onPermanentDelete}
          onSelectTask={onSelectTask}
        />
      ))}
    </ul>
  );
}
