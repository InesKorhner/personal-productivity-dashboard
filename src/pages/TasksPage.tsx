import { AddTaskForm } from '@/components/AddTaskForm';
import type { TaskStatus, Task } from '@/types';
import { useState, useEffect, useMemo } from 'react';
import { CategoryList } from '@/components/CategoryList';
import { TaskView } from '@/components/TaskView';

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

  const categories = ['MyList', 'Work', 'Exercise', 'Study', 'Other'];

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
        categories={categories}
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

      <aside className="col-span-1 col-start-3 h-full overflow-y-auto border-l p-4">
        <div className="mb-3 text-sm font-semibold">Notes</div>
        {selectedTask ? (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Task: {selectedTask.text}
            </div>
            <textarea
              value={selectedTask.notes ?? ''}
              onChange={(e) => handleSaveNotes(selectedTask.id, e.target.value)}
              className="h-90 w-full resize-none rounded border p-4 text-sm"
              placeholder="Write notes for the selected task"
            />
            <div className="mt-2 text-sm text-gray-500">
              {selectedTask.category} • {selectedTask.status.replace('_', ' ')}
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500">
            Select a task to see / edit notes
          </div>
        )}
      </aside>
    </div>
  );
}
