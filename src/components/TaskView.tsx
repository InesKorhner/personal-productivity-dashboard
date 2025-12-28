import { type Task, TaskStatus } from '@/types';
import { TaskList } from './TaskList';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskViewProps {
  tasks: Task[];
  showToDo?: boolean;
  showCompleted?: boolean;
  showDeleted?: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onUndo: (taskId: string) => void;
  onPermanentDelete: (taskId: string) => void;
  onSelectTask: (taskId: string | null) => void;
}

export function TaskView({
  tasks,
  showToDo = false,
  showCompleted = false,
  showDeleted = false,
  onStatusChange,
  onDelete,
  onUndo,
  onPermanentDelete,
  onSelectTask,
}: TaskViewProps) {
  const [isCompletedOpen, setIsCompletedOpen] = useState(true);
  const [isDeletedOpen, setIsDeletedOpen] = useState(true);

  const { todoTasks, completedTasks, deletedTasks } = useMemo(() => {
    const lists = {
      todoTasks: [] as Task[],
      completedTasks: [] as Task[],
      deletedTasks: [] as Task[],
    };

    for (const task of tasks) {
      // Deleted tasks go to trash regardless of status
      if (task.deleted) {
        lists.deletedTasks.push(task);
      }
      // Non-deleted completed tasks
      else if (task.status === TaskStatus.DONE) {
        lists.completedTasks.push(task);
      }
      // Non-deleted todo tasks
      else if (task.status === TaskStatus.TODO) {
        lists.todoTasks.push(task);
      }
    }

    return lists;
  }, [tasks]);

  return (
    <div className="space-y-4">
      {showToDo && (
        <div className="lg:max-w-3xl">
          {todoTasks.length > 0 ? (
            <>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                To Do
              </h3>
              <TaskList
                tasks={todoTasks}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onUndo={onUndo}
                onPermanentDelete={onPermanentDelete}
                onSelectTask={onSelectTask}
              />
            </>
          ) : (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No tasks to do
            </div>
          )}
        </div>
      )}

      {showCompleted && completedTasks.length > 0 && (
        <div className="lg:max-w-3xl">
          <Button
            variant="ghost"
            className="text-foreground mb-4 flex h-auto w-full items-center justify-between p-0 text-lg font-semibold hover:bg-transparent"
            onClick={() => setIsCompletedOpen(!isCompletedOpen)}
          >
            <span>Completed</span>
            {isCompletedOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
          {isCompletedOpen && (
            <TaskList
              tasks={completedTasks}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onUndo={onUndo}
              onPermanentDelete={onPermanentDelete}
              onSelectTask={onSelectTask}
            />
          )}
        </div>
      )}

      {showDeleted && deletedTasks.length > 0 && (
        <div className="lg:max-w-3xl">
          <Button
            variant="ghost"
            className="text-foreground mb-4 flex h-auto w-full items-center justify-between p-0 text-lg font-semibold hover:bg-transparent"
            onClick={() => setIsDeletedOpen(!isDeletedOpen)}
          >
            <span>Trash</span>
            {isDeletedOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
          {isDeletedOpen && (
            <TaskList
              tasks={deletedTasks}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onUndo={onUndo}
              onPermanentDelete={onPermanentDelete}
              onSelectTask={onSelectTask}
            />
          )}
        </div>
      )}
    </div>
  );
}
