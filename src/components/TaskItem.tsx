import { TaskStatus, type Task } from '@/types';
import { Trash2, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTaskDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

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
  const { label: dateLabel, variant: dateVariant } = formatTaskDate(task.date);

  const toggleDone = () => {
    onStatusChange(
      task.id,
      task.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE,
    );
  };

  return task.deleted ? (
    <li className="border-border bg-muted/50 flex items-center justify-between rounded-lg border px-3 py-2.5">
      <div
        className="flex-1 cursor-pointer"
        onClick={() => onSelectTask(task.id)}
      >
        <p className="text-muted-foreground text-sm font-medium line-through">
          {task.text}
        </p>
      </div>
      <div className="ml-3 flex items-center gap-2">
        <Button
          type="button"
          onClick={() => onUndo(task.id)}
          size="icon"
          className="h-8 w-8 cursor-pointer bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50"
          aria-label="Restore task"
          title="Restore task"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          type="button"
          onClick={() => onPermanentDelete(task.id)}
          size="icon"
          className="h-8 w-8 cursor-pointer bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          aria-label="Delete forever"
          title="Delete forever"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  ) : (
    <li className="border-border bg-card hover:bg-accent flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors">
      <div className="flex flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={toggleDone}
          className="text-primary focus:ring-primary border-border h-4 w-4 cursor-pointer rounded focus:ring-2 focus:ring-offset-0"
          aria-label="Mark completed"
        />
        <div
          className="flex-1 cursor-pointer"
          onClick={() => onSelectTask(task.id)}
        >
          <p
            className={cn('text-sm font-medium transition-all', {
              'text-muted-foreground line-through':
                task.status === TaskStatus.DONE,
              'text-foreground': task.status !== TaskStatus.DONE,
            })}
          >
            {task.text}
          </p>
        </div>
      </div>

      <div className="ml-3 flex items-center gap-2">
        {dateLabel && (
          <span
            className={cn('text-xs font-medium', {
              'text-muted-foreground': isDone,
              'text-blue-600 dark:text-blue-400':
                !isDone &&
                (dateVariant === 'today' || dateVariant === 'future'),
              'text-red-600 dark:text-red-400':
                !isDone && dateVariant === 'past',
            })}
          >
            {dateLabel}
          </span>
        )}
        <Button
          type="button"
          onClick={() => onDelete(task.id)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 cursor-pointer text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
          aria-label="Move to trash"
          title="Move to trash"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
