import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <li className="flex items-center justify-between rounded border p-2">
      <span>
        {task.text} - {task.category}
      </span>
    </li>
  );
}
