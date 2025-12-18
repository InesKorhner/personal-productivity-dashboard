import { useMemo } from 'react';
import type { Habit, Sections } from '@/types';
import { SECTIONS } from '@/types';
import { HabitItem } from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  onToggleCheckIn: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}

export function HabitList({
  habits,
  onToggleCheckIn,
  onDelete,
  onEdit,
}: HabitListProps) {
 
  const groupedBySection = useMemo(() => {
    const grouped: Partial<Record<Sections, Habit[]>> = {};

    habits.forEach((habit) => {
      if (!grouped[habit.section]) {
        grouped[habit.section] = [];
      }
      grouped[habit.section]!.push(habit);
    });

    return grouped;
  }, [habits]);

 
  const sectionOrder = useMemo(() => SECTIONS, []);

  if (habits.length === 0) {
    return (
      <div className="mt-4 text-center text-muted-foreground">
        No habits yet — add your first one!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sectionOrder.map((section) => {
        const sectionHabits = groupedBySection[section];

        if (!sectionHabits || sectionHabits.length === 0) {
          return null;
        }

        return (
          <div key={section}>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              {section}
            </h2>
            <ul className="space-y-2">
              {sectionHabits.map((habit) => (
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
        );
      })}
    </div>
  );
}
