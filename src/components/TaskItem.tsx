import { TaskStatus, type Task } from '@/types';
import { Trash2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    onStatusChange(
      task.id,
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE,
    );
  };

  return task.deleted ? (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
      <div
        className="flex-1 cursor-pointer"
        onClick={() => onSelectTask(task.id)}
      >
        <p className="text-sm font-medium text-gray-600 line-through">
          {task.text}
        </p>
      </div>
      <div className="ml-3 flex items-center gap-2">
        <Button
          type="button"
          onClick={() => onUndo(task.id)}
          size="icon"
          className="h-8 w-8 cursor-pointer bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
          aria-label="Restore task"
          title="Restore task"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          type="button"
          onClick={() => onPermanentDelete(task.id)}
          size="icon"
          className="h-8 w-8 cursor-pointer bg-red-100 text-red-700 hover:bg-red-200"
          aria-label="Delete forever"
          title="Delete forever"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  ) : (
    <li className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5 transition-colors hover:bg-gray-50">
      <div className="flex flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={toggleDone}
          className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300 focus:ring-2 focus:ring-offset-0"
          aria-label="Mark completed"
        />
        <div
          className="flex-1 cursor-pointer"
          onClick={() => onSelectTask(task.id)}
        >
          <p
            className={`text-sm font-medium transition-all ${
              task.status === TaskStatus.DONE
                ? 'text-gray-400 line-through'
                : 'text-gray-800'
            }`}
          >
            {task.text}
          </p>
        </div>
      </div>

      <div className="ml-3 flex items-center">
        <Button
          type="button"
          onClick={() => onDelete(task.id)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 cursor-pointer text-red-600 hover:bg-red-100 hover:text-red-700"
          aria-label="Move to trash"
          title="Move to trash"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
