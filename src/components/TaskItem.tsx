import { TaskStatus, type Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onUndo: (taskId: string) => void;
  onPermanentDelete: (taskId: string) => void;
  onSelectTask: (taskId: string | null) => void;
  isCompletedView: boolean;
}

export function TaskItem({
  task,
  onStatusChange,
  onDelete,
  onUndo,
  onPermanentDelete,
  onSelectTask,
  isCompletedView = false,
}: TaskItemProps) {
  const isDone = task.status === TaskStatus.DONE;

  const toggleDone = () => {
    onStatusChange(
      task.id,
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE
    );
  };

  return task.deleted ? (
    <li className="flex max-w-[250px] items-center justify-between rounded border px-1 py-1">
      <div
        className="flex-1 cursor-pointer"
        onClick={() => onSelectTask(task.id)}
      >
        <p className="font-medium text-gray-600">
          {task.text}{' '}
          <span className="text-xs text-gray-400 italic">(deleted)</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUndo(task.id)}
          className="rounded bg-yellow-200 px-2 py-1 text-sm text-yellow-800"
        >
          Restore
        </button>
        <button
          type="button"
          onClick={() => onPermanentDelete(task.id)}
          className="rounded bg-red-100 px-2 py-1 text-sm text-red-700"
        >
          Delete forever
        </button>
      </div>
    </li>
  ) : (
    <li className="flex max-w-[300px] items-center justify-between rounded border px-2 py-1">
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          checked={isDone}
          onChange={toggleDone}
          aria-label="Mark completed"
        />
        <div
          className="cursor-pointer"
          onClick={() => {
            onSelectTask(task.id);
          }}
        >
          <p
            className={`cursor-pointer font-medium transition-all ${
              isCompletedView ? 'opacity-50' : 'opacity-100'
            }`}
          >
            {task.text}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded bg-red-100 px-2 py-1 text-xs text-red-700"
          aria-label="Move to trash"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
