import type { Habit } from '@/types';
import { HabitItem } from './HabitItem';

interface HabitListProps {
  habits: Habit[];
}

export function HabitList({ habits }: HabitListProps) {
  return (
    <ul className="space-y-2">
        
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </ul>
  );
}
