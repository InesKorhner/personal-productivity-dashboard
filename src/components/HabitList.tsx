import type { Habit } from '@/types';
import { HabitItem } from './HabitItem';

interface HabitListProps {
  habits: Habit[];
}

export function HabitList({ habits }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="mt-4 text-center text-gray-500">
        No habits yet- add your first one!
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} totalCheckIns={0} currentStreak={0} />
      ))}
    </ul>
  );
}
