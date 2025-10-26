import type { Habit } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface HabitItemProps {
  habit: Habit;
  onToggleCheckIn: (habitId: string, date: string) => void;
}

export function HabitItem({ habit, onToggleCheckIn }: HabitItemProps) {
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
    <li className="flex items-center justify-between rounded-lg border p-1.5 shadow-sm">
      <div>
        <p className="text-sm">{habit.name}</p>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="mr-2 cursor-default text-xs text-gray-400">
              {totalCheckIns}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total Check-Ins</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-default text-xs text-gray-400">
              {currentStreak}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Current Streak</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-2 flex space-x-1">
        {lastDays.map((date) => {
          const check = habit.checkIns.find((c) => c.date === date);
          const done = check ? check.isChecked : false;

          const isDisabled =
            new Date(date).setHours(0, 0, 0, 0) > todayStart.getTime();

          return (
            <div
              key={date}
              onClick={() => {
                if (!isDisabled) onToggleCheckIn(habit.id, date);
              }}
              className={`h-4 w-4 rounded-full border ${done ? 'bg-green-500' : 'bg-gray-200'} ${
                isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              title={date}
            />
          );
        })}
      </div>
    </li>
  );
}
