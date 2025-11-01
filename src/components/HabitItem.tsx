import type { Habit } from '@/types';
import { triggerConfetti } from '@/lib/confetti';
import { Edit2, Trash2 } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
  onToggleCheckIn: (habitId: string, date: string) => void;
  onDelete: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
}

export function HabitItem({
  habit,
  onToggleCheckIn,
  onDelete,
  onEdit,
}: HabitItemProps) {
  const today = new Date();
  const lastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

  const totalCheckIns = (habit.checkIns || []).filter(
    (c) => c.isChecked,
  ).length;
  const checkIns = habit.checkIns || [];
  let currentStreak = 0;
  for (let i = lastDays.length - 1; i >= 0; i--) {
    const dayCheckIn = checkIns.find((c) => c.date === lastDays[i]);
    if (dayCheckIn?.isChecked) currentStreak++;
    else break;
  }
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return (
    <li className="flex w-150 items-center justify-between rounded-lg border px-2 py-1 text-sm">
      <div className="flex flex-col items-start text-left">
        <p className="text-base font-medium text-gray-800">{habit.name}</p>
        <div className="mt-1 flex space-x-4 text-xs text-gray-500">
          <span>Check-Ins: {totalCheckIns}</span>
          <span>Streak: {currentStreak}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        {lastDays.map((date) => {
          const check = habit.checkIns.find((c) => c.date === date);
          const done = check ? check.isChecked : false;

          const isDisabled =
            new Date(date).setHours(0, 0, 0, 0) > todayStart.getTime();

          return (
            <div
              key={date}
              onClick={() => {
                if (!isDisabled) {
                  onToggleCheckIn(habit.id, date);
                  if (!done) triggerConfetti();
                }
              }}
              className={`h-4 w-4 rounded-full border ${done ? 'bg-blue-500' : 'bg-gray-200'} ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              title={date}
            />
          );
        })}
        <div className="mx-3 h-4 border-l border-gray-300"></div>
        <button type="button" onClick={() => onEdit(habit)}>
          <Edit2 size={16} />
        </button>
        <button type="button" onClick={() => onDelete(habit.id)}>
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
