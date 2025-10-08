import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskList } from '@/components/TaskList';
import { TaskStatus, type Task } from '@/types';
import { useState } from 'react';
import { CategoryList } from '@/components/CategoryList';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

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

        <TaskList
          tasks={tasks.filter(
            (t) => !t.deleted && t.status !== TaskStatus.DONE,
          )}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onUndo={handleUndo}
          onPermanentDelete={handlePermanentDelete}
          onSelectTask={handleSelectTask}
          isCompletedView={false}
        />

        {tasks.some((t) => t.status === TaskStatus.DONE && !t.deleted) && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-500">
              Completed
            </h3>
            <TaskList
              tasks={tasks.filter(
                (t) => t.status === TaskStatus.DONE && !t.deleted,
              )}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onUndo={handleUndo}
              onPermanentDelete={handlePermanentDelete}
              onSelectTask={handleSelectTask}
              isCompletedView={true}
            />
          </div>
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
