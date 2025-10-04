import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import type { TaskStatus, Task } from '@/types';
import { useState } from 'react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              deleted: !task.deleted,
              deletedAt: !task.deleted ? Date.now() : null,
            }
          : task,
      ),
    );
  };

    const handleUndo = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, deleted: false, deletedAt: null } : task
    ));
  };
  return (
    <div>
      <AddTaskForm onAddTask={(newTask) => setTasks([...tasks, newTask])} />
      <TaskList
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onUndo={handleUndo}
      />
    </div>
  );
}
