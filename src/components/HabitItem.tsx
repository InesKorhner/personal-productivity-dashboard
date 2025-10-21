import type { Habit } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface HabitItemProps {
  habit: Habit;
  totalCheckIns: number;
  currentStreak: number;
}

export function HabitItem({
  habit,
  totalCheckIns,
  currentStreak,
}: HabitItemProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
      <div>
        <p className="font-semibold">{habit.name}</p>

        <p className="text-sm text-gray-500">
          {habit.frequency} - {habit.section}
        </p>
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

      <div className="text-xs text-gray-400">Start: {habit.startDate}</div>
    </li>
  );
}
