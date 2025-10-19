import type { Habit } from '@/types';

interface HabitItemProps {
  habit: Habit;
}

export function HabitItem({ habit }: HabitItemProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
      <div>
        <p className="font-semibold">{habit.name}</p>
        <p className="text-sm text-gray-500">
          {habit.frequency} - {habit.section}
        </p>
      </div>
      <div className="text-xs text-gray-400">Start: {habit.startDate}</div>
    </li>
  );
}
