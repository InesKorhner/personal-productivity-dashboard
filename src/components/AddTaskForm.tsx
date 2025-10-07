import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useState } from 'react';
import { TaskStatus, type Task } from '@/types';

interface AddTaskFormProps {
  onAddTask: (task: Task) => void;
      selectedCategory: string | null;

}

export function AddTaskForm({ onAddTask, selectedCategory }: AddTaskFormProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue) return;
 const newTaskCategory = selectedCategory || 'MyList'; 
    onAddTask({
      id: Date.now().toString(),
      text: inputValue,
      category: newTaskCategory,
      status: TaskStatus.TODO,
      deleted: false,
      deletedAt: null,
      notes: '',
    });
    setInputValue('');
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex w-full items-center gap-4 px-4"
    >
      <Input
        type="text"
        placeholder="Add Task"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="max-w-xl flex-1 px-4 py-2"
      />

      <Button type="submit">
        Submit
      </Button>
    </form>
  );
}
