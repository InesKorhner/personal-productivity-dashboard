import { TaskStatus, type Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onUndo: (taskId: string) => void;
}

export function TaskItem({
  task,
  onStatusChange,
  onDelete,
  onUndo,
}: TaskItemProps) {
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-200 text-gray-700';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-200 text-blue-800';
      case TaskStatus.DONE:
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  const getNextStatus = (status: TaskStatus): TaskStatus => {
    switch (status) {
      case TaskStatus.TODO:
        return TaskStatus.IN_PROGRESS;
      case TaskStatus.IN_PROGRESS:
        return TaskStatus.DONE;
      case TaskStatus.DONE:
        return TaskStatus.TODO;
      default:
        return TaskStatus.TODO;
    }
  };

  if (task.deleted) {
    return (
      <li className="flex items-center justify-between rounded border bg-gray-100 p-2">
        <span className="text-gray-500 italic">{task.text} (deleted)</span>
        <button
          type="button"
          onClick={() => onUndo(task.id)}
          className="rounded bg-yellow-200 px-2 py-1 text-sm text-yellow-800"
        >
          Undo
        </button>
      </li>
    );
  }
   return (
    <li className="flex items-center justify-between rounded border p-2">
      <div>
        <p className="font-medium">{task.text}</p>
        <p className="text-sm text-gray-500">{task.category}</p>
      </div>

      {!task.deleted ? (
        <div className="flex items-center gap-2">
          <span className={`rounded px-2 py-1 text-xs font-semibold ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>

          <button
            type="button"
            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700"
            onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
          >
            Next
          </button>

          <button
            type="button"
            className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="rounded bg-green-100 px-2 py-1 text-xs text-green-700"
          onClick={() => onUndo(task.id)}
        >
          Undo
        </button>
      )}
    </li>
  );
}
