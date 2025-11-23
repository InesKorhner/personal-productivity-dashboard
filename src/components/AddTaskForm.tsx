import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

import { useState } from 'react';

interface AddTaskFormProps {
  onAddTask: (taskData: { text: string; category: string }) => Promise<void>;
  selectedCategory: string | null;
}

export function AddTaskForm({ onAddTask, selectedCategory }: AddTaskFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSubmitting) return;

    const newTaskCategory = selectedCategory || 'MyList';

    setIsSubmitting(true);
    try {
      await onAddTask({
        text: inputValue.trim(),
        category: newTaskCategory,
      });
      setInputValue('');
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
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
        disabled={isSubmitting}
      />

      <Button type="submit" className="shrink-0" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add'
        )}
      </Button>
    </form>
  );
}
