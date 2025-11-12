import { AddTaskForm } from '@/components/AddTaskForm';
import type { TaskStatus, Task } from '@/types';
import { CATEGORIES } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { CategoryList } from '@/components/CategoryList';
import { TaskView } from '@/components/TaskView';
import { NotesAside } from '@/components/NotesAside';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTask = localStorage.getItem('tasks');
      return savedTask ? JSON.parse(savedTask) : [];
    } catch (error) {
      console.error('Failed to parse tasks from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      const savedCategory = localStorage.getItem('selectedCategory');
      return savedCategory || 'MyList';
    },
  );

  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory ?? '');
  }, [selectedCategory]);

  const [selectedView, setSelectedView] = useState<
    'category' | 'completed' | 'deleted'
  >('category');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
    setSelectedTaskId(newTask.id);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, deleted: true, deletedAt: Date.now() }
          : task,
      ),
    );
  };

  const handleUndo = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, deleted: false, deletedAt: null }
          : task,
      ),
    );
  };

  const handlePermanentDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskId === taskId) setSelectedTaskId(null);
  };

  const handleSelectTask = (taskId: string | null) => {
    setSelectedTaskId(taskId);
  };

  const handleSaveNotes = (taskId: string, notes: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, notes } : t)),
    );
  };

  const selectedTask: Task | null =
    tasks.find(
      (t) => t.id === selectedTaskId && t.category === selectedCategory,
    ) ?? null;

  const taskListProps = {
    onStatusChange: handleStatusChange,
    onDelete: handleDelete,
    onUndo: handleUndo,
    onPermanentDelete: handlePermanentDelete,
    onSelectTask: handleSelectTask,
  };

  const categoryTasks = useMemo(
    () => tasks.filter((t) => t.category === selectedCategory),
    [tasks, selectedCategory],
  );

  return (
    <div className="grid h-screen grid-cols-[250px_1fr_400px] gap-6 p-6">
      <CategoryList
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        selectedView={selectedView}
        onSelectCategory={setSelectedCategory}
        onSelectView={setSelectedView}
      />

      <div className="flex flex-col gap-4">
        <AddTaskForm
          onAddTask={handleAddTask}
          selectedCategory={selectedCategory}
        />

        {selectedView === 'category' && (
          <TaskView
            {...taskListProps}
            tasks={categoryTasks}
            showToDo
            showCompleted
          />
        )}

        {selectedView === 'completed' && (
          <TaskView {...taskListProps} tasks={tasks} showCompleted />
        )}

        {selectedView === 'deleted' && (
          <TaskView {...taskListProps} tasks={tasks} showDeleted />
        )}
      </div>
      <NotesAside selectedTask={selectedTask} onSaveNotes={handleSaveNotes} />
    </div>
  );
}
