import type { Habit } from '@/types';
import { HabitItem } from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  onToggleCheckIn: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}

export function HabitList({ habits, onToggleCheckIn, onDelete, onEdit}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="mt-4 text-center text-gray-500">
        No habits yet- add your first one!
      </div>
    );
  }
  const groupedHabits = {
    Morning: habits.filter(h => h.section === 'Morning'),
    Afternoon: habits.filter(h => h.section === 'Afternoon'),
    Evening: habits.filter(h => h.section === 'Evening'),
    Others: habits.filter(h => h.section === 'Other'),
  };
  return (
    <div className="space-y-6">
      {Object.entries(groupedHabits).map(([section, sectionHabits]) => (
        sectionHabits.length > 0 && (
          <div key={section}>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">{section}</h2>
            <ul className="space-y-2">
              {sectionHabits.map(habit => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggleCheckIn={onToggleCheckIn}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
            </ul>
          </div>
        )
      ))}
    </div>
  );
}
