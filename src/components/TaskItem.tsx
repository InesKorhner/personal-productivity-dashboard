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
          className="h-8 w-8 cursor-pointer bg-warning/10 text-warning hover:bg-warning/20 transition-colors duration-200"
          aria-label="Restore task"
          title="Restore task"
        >
          <Undo2 size={16} />
        </Button>
        <Button
          type="button"
          onClick={() => onPermanentDelete(task.id)}
          size="icon"
          className="h-8 w-8 cursor-pointer bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors duration-200"
          aria-label="Delete forever"
          title="Delete forever"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  ) : (
    <li className="border-border bg-card hover:bg-accent flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors duration-200">
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
            className={cn('text-sm font-medium transition-colors duration-200', {
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
            className={cn('text-xs font-medium transition-colors duration-200', {
              'text-muted-foreground': isDone,
              'text-info':
                !isDone &&
                (dateVariant === 'today' || dateVariant === 'future'),
              'text-destructive':
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
          className="h-8 w-8 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
          aria-label="Move to trash"
          title="Move to trash"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </li>
  );
}
