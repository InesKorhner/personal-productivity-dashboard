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
  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  function getEuropeanDayIndex(jsDay: number) {
    return (jsDay + 6) % 7;
  }
  const today = new Date();

  const lastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i)); // 6-i tako da ide od ponedeljka do danas
    const jsDay = d.getDay(); // 0..6 (Sunday..Saturday)
    const europeanDayIndex = getEuropeanDayIndex(jsDay);
    return {
      label: daysOfWeek[europeanDayIndex],
      date: d.toISOString().slice(0, 10),
    };
  });

  const totalCheckIns = (habit.checkIns || []).filter(
    (c) => c.isChecked,
  ).length;
  const checkIns = habit.checkIns || [];
  let currentStreak = 0;
  for (let i = lastDays.length - 1; i >= 0; i--) {
    const dayCheckIn = checkIns.find((c) => c.date === lastDays[i].date);
    if (dayCheckIn?.isChecked) currentStreak++;
    else break;
  }
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return (
    <li className="flex max-w-[700px] items-center justify-between rounded-lg border px-2 py-1 text-sm">
      <div className="flex flex-col items-start text-left">
        <p className="text-base font-medium text-gray-800">{habit.name}</p>
        <div className="mt-1 flex space-x-4 text-xs text-gray-500">
          <span>Check-Ins: {totalCheckIns}</span>
          <span>Streak: {currentStreak}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        {lastDays.map(({ label, date }) => {
          const check = habit.checkIns.find((c) => c.date === date);
          const done = check ? check.isChecked : false;

          const isDisabled =
            new Date(date).setHours(0, 0, 0, 0) > todayStart.getTime();

          return (
            <div
              key={date}
              onClick={(e) => {
                if (!isDisabled) {
                  onToggleCheckIn(habit.id, date);
                  if (!done) triggerConfetti(e.clientX, e.clientY);
                }
              }}
              className={`flex h-[24px] w-[24px] items-center justify-center rounded-full border text-[12px] ${
                done ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              title={date}
            >
              {label}
            </div>
          );
        })}
        <div className="mx-3 h-4 border-l border-gray-300"></div>
        <button
          type="button"
          onClick={() => onEdit(habit)}
          aria-label="Edit habit"
        >
          <Edit2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(habit.id)}
          title="Delete Habit"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}
