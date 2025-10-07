import { TaskStatus, type Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onUndo: (taskId: string) => void;
  onPermanentDelete: (taskId: string) => void;
  onSelectTask: (taskId: string | null) => void;
}

export function TaskItem({
  task,
  onStatusChange,
  onDelete,
  onUndo,
  onPermanentDelete,
  onSelectTask,
}: TaskItemProps) {
  const isDone = task.status === TaskStatus.DONE;

  const toggleDone = () => {
    onStatusChange(task.id, isDone ? TaskStatus.TODO : TaskStatus.DONE);
  };

  return task.deleted ? (
      <li className="flex items-center justify-between rounded border px-1 py-1 max-w-[250px]">
      <div className="flex-1 cursor-pointer" onClick={() => onSelectTask(task.id)}>
        <p className="font-medium text-gray-600">{task.text} <span className="text-xs italic text-gray-400">(deleted)</span></p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUndo(task.id)}
          className="rounded bg-yellow-200 px-2 py-1 text-sm text-yellow-800"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => onPermanentDelete(task.id)}
          className="rounded bg-red-100 px-2 py-1 text-sm text-red-700"
        >
          Delete permanently
        </button>
      </div>
    </li>
  ) : (
<li className="flex items-center justify-between rounded border px-2 py-1 max-w-[300px]">
     <div className="flex items-center gap-1">
  <input
    type="checkbox"
    checked={isDone}
    onChange={toggleDone}
    aria-label="Mark completed"
  />
  <div
    className="cursor-pointer"
    onClick={() => onSelectTask(task.id)}
  >
    <p className={`font-medium ${isDone ? 'line-through text-gray-400' : ''}`}>{task.text}</p>
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

