import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import DatePickerButton from '@/components/DatePickerButton';
import { formatDateforServer } from '@/lib/dateUtils';

interface AddTaskFormProps {
  onAddTask: (taskData: {
    text: string;
    category: string;
    date?: string;
  }) => Promise<void>;
  selectedCategory: string | null;
}

export function AddTaskForm({ onAddTask, selectedCategory }: AddTaskFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
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
        date: selectedDate ? formatDateforServer(selectedDate) : undefined,
      });
      setInputValue('');
      setSelectedDate(undefined);
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex w-full flex-col gap-4 lg:flex-row lg:items-center"
    >
      {/* Input group with date picker */}
      <div className="focus-within:ring-ring flex flex-1 items-center overflow-hidden rounded-md border focus-within:ring-2 focus-within:ring-offset-2">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 border-0 px-4 py-2 text-base focus-visible:ring-0 focus-visible:ring-offset-0 lg:px-6 lg:py-3 lg:text-base"
          disabled={isSubmitting}
        />

        <div className="flex items-center border-l">
          <DatePickerButton
            value={selectedDate}
            onChange={setSelectedDate}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-10 w-full shrink-0 px-4 text-sm lg:h-8 lg:w-auto lg:px-3"
        size="sm"
        disabled={isSubmitting}
      >
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
