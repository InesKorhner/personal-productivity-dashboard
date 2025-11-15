import { AddTaskForm } from '@/components/AddTaskForm';
import type { TaskStatus, Task } from '@/types';
import { CATEGORIES } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { CategoryList } from '@/components/CategoryList';
import { TaskView } from '@/components/TaskView';
import { NotesAside } from '@/components/NotesAside';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function loadTasks() {
    const response = await fetch('http://localhost:3001/tasks');
    const data = await response.json();
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

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

  const handleAddTask = async (newTask: Task) => {
    const response = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    const data = await response.json();
    setTasks((prev) => [...prev, data]);
    setSelectedTaskId(data.id);
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const updatedTask = await response.json();
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? updatedTask : task)),
    );
  };

  const handleDelete = async (taskId: string) => {
    const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deleted: true,
        deletedAt: Date.now(),
      }),
    });

    const updatedTask = await response.json();

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? updatedTask : task)),
    );
  };

  const handleUndo = async (taskId: string) => {
    const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deleted: false,
        deletedAt: null,
      }),
    });

    const updatedTask = await response.json();

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? updatedTask : task)),
    );
  };

  const handlePermanentDelete = async (taskId: string) => {
    await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'DELETE',
    });

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (selectedTaskId === taskId) setSelectedTaskId(null);
  };

  const handleSelectTask = (taskId: string | null) => {
    setSelectedTaskId(taskId);
  };

  const handleSaveNotes = async (taskId: string, notes: string) => {
    const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });

    const updatedTask = await response.json();

    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
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
