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
    if (!inputValue.trim()) return;
    
    // Default to 'MyList' if no category selected (shouldn't happen, but safe fallback)
    const newTaskCategory = selectedCategory || 'MyList';
    
    onAddTask({
      id: Date.now().toString(),
      text: inputValue.trim(),
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
      className="mb-4 flex w-full items-center gap-3"
    >
      <Input
        type="text"
        placeholder="Add a new task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1 px-4 py-2"
      />

      <Button type="submit" className="shrink-0">
        Add
      </Button>
    </form>
  );
}
