import type { Task } from '@/types';


interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="m-8 space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between border p-2 rounded">
          <span>
            {task.text} - {task.category}
          </span>
        </li>
      ))}
    </ul>
  );
}
