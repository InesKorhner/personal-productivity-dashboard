import type { Habit } from '@/types';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import React from 'react';

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
    const [checkIns, setCheckIns] = React.useState<Record<string, boolean>>({});

    const today = new Date();
    const lastDays = Array.from({length: 7}).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        return d.toDateString().slice(0, 10);
    }).reverse();
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
     <div className="flex space-x-1 mt-2">
  {lastDays.map((date) => {
    const done = checkIns[date] || false;
    const isDisabled = new Date(date) > today;
    return (
      <div
        key={date}
        onClick={() => {
          if (!isDisabled) {
            setCheckIns((prev) => ({ ...prev, [date]: !done }));
          }
        }}
        className={`w-4 h-4 rounded-full border ${
          done ? 'bg-green-500' : 'bg-gray-200'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={date}
      />
    );
  })}
</div>

    </li>
  );
}
