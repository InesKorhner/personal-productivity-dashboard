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
    <div>
      {showToDo && todoTasks.length > 0 && (
        <>
          <h3>To Do</h3>
          <TaskList
            tasks={todoTasks}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onUndo={onUndo}
            onPermanentDelete={onPermanentDelete}
            onSelectTask={onSelectTask}
          />
        </>
      )}

      {showCompleted && completedTasks.length > 0 && (
        <>
          <h3>Completed</h3>
          <TaskList
            tasks={completedTasks}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onUndo={onUndo}
            onPermanentDelete={onPermanentDelete}
            onSelectTask={onSelectTask}
          />
        </>
      )}

      {showDeleted && deletedTasks.length > 0 && (
        <>
          <h3>Deleted</h3>
          <TaskList
            tasks={deletedTasks}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onUndo={onUndo}
            onPermanentDelete={onPermanentDelete}
            onSelectTask={onSelectTask}
          />
        </>
      )}
    </div>
  );
}
