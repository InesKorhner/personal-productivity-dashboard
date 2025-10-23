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
  const lastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - i);
    return d.toISOString().slice(0, 10);
  }).reverse();

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
          const done = checkIns[date] || false;
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          const isDisabled =
            new Date(date).setHours(0, 0, 0, 0) > todayStart.getTime();

          return (
            <div
              key={date}
              onClick={() => {
                if (!isDisabled) {
                  setCheckIns((prev) => ({ ...prev, [date]: !done }));
                }
              }}
              className={`h-4 w-4 rounded-full border ${
                done ? 'bg-green-500' : 'bg-gray-200'
              } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              title={date}
            />
          );
        })}
      </div>
    </li>
  );
}
