import { type Task, TaskStatus } from '@/types';
import { TaskList } from './TaskList';
import { useMemo } from 'react';

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
  const { todoTasks, completedTasks, deletedTasks } = useMemo(() => {
    const lists = {
      todoTasks: [] as Task[],
      completedTasks: [] as Task[],
      deletedTasks: [] as Task[],
    };

    for (const task of tasks) {
      if (task.deleted) {
        lists.deletedTasks.push(task);
      } else if (task.status === TaskStatus.DONE) {
        lists.completedTasks.push(task);
      } else if (task.status === TaskStatus.TODO) {
        lists.todoTasks.push(task);
      }
    }

    return lists;
  }, [tasks]);

  return (
    <div className="space-y-6">
      {showToDo && (
        <>
          {todoTasks.length > 0 ? (
            <>
              <h3 className="mb-3 text-lg font-semibold text-foreground">To Do</h3>
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
            <div className="py-8 text-center text-sm text-muted-foreground">
              No tasks to do
            </div>
          )}
        </>
      )}

      {showCompleted && (
        <>
          {completedTasks.length > 0 ? (
            <>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Completed</h3>
              <TaskList
                tasks={completedTasks}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onUndo={onUndo}
                onPermanentDelete={onPermanentDelete}
                onSelectTask={onSelectTask}
              />
            </>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No completed tasks
            </div>
          )}
        </>
      )}

      {showDeleted && (
        <>
          {deletedTasks.length > 0 ? (
            <>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Deleted</h3>
              <TaskList
                tasks={deletedTasks}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onUndo={onUndo}
                onPermanentDelete={onPermanentDelete}
                onSelectTask={onSelectTask}
              />
            </>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Trash is empty
            </div>
          )}
        </>
      )}
    </div>
  );
}
