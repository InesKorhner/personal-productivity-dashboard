import { Plus } from 'lucide-react';
import { Button } from './ui/button';

type AddHabitButtonProps = {
  onClick: () => void;
  noHabitsText?: string;
};

export function AddHabitButton({
  onClick,
  noHabitsText,
}: AddHabitButtonProps) {
  return (
    <div className="mb-4 text-center">
      <Button onClick={onClick} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Habit
      </Button>

      {noHabitsText && (
        <h3 className="mt-2 text-sm text-gray-500">{noHabitsText}</h3>
      )}
    </div>
  );
}
