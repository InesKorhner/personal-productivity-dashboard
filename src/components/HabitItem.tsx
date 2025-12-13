import type { Habit } from '@/types';
import { triggerConfetti } from '@/lib/confetti';
import { Edit2 } from 'lucide-react';
import { DeleteHabitDialog } from './DeleteHabitDialog';
import { startOfWeek, endOfWeek, isWithinInterval, startOfDay } from 'date-fns';
import { formatDateforServer, parseLocalDate } from '@/lib/dateUtils';

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

  const today = new Date();

  // Calculate weekly progress (Monday to Sunday)
  // Get the current week boundaries: Monday 00:00:00 to Sunday 23:59:59.999
  const weekStart = startOfDay(startOfWeek(today, { weekStartsOn: 1 })); // Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday end of day

  // Generate current week days (Monday to Sunday)
  // These are the 7 check-in buttons that match the current week
  const lastDays = Array.from({ length: 7 }, (_, i) => {
    // Create new date immutably by adding days to weekStart (Monday)
    const d = new Date(
      weekStart.getFullYear(),
      weekStart.getMonth(),
      weekStart.getDate() + i,
    );
    return {
      label: daysOfWeek[i], // Mo, Tu, We, Th, Fr, Sa, Su
      date: formatDateforServer(d),
    };
  });

  const checkIns = habit.checkIns || [];

  // Calculate current streak (consecutive checked days from today backwards)
  let currentStreak = 0;
  for (let i = lastDays.length - 1; i >= 0; i--) {
    const dayCheckIn = checkIns.find((c) => c.date === lastDays[i].date);
    if (dayCheckIn?.isChecked) currentStreak++;
    else break;
  }

  // Count checked check-ins in current week (Monday to Sunday)
  const weeklyCheckedCount = checkIns.filter((checkIn) => {
    if (!checkIn.isChecked) return false;
    // Parse check-in date as local date to avoid timezone issues
    const checkInDate = startOfDay(parseLocalDate(checkIn.date));
    return isWithinInterval(checkInDate, { start: weekStart, end: weekEnd });
  }).length;

  // Get the goal (frequency: number of times per week)
  const goal =
    typeof habit.frequency === 'number' && habit.frequency > 0
      ? habit.frequency
      : 1;

  // Calculate percentage: (check-ins completed / goal) * 100
  // Can exceed 100% if user completes more than the goal
  const percentage =
    goal > 0 ? Math.round((weeklyCheckedCount / goal) * 100) : 0;

  return (
    <li className="flex max-w-[700px] items-center justify-between rounded-lg border px-2 py-1 text-sm">
      <div className="flex w-full flex-col items-start text-left">
        <p className="text-base font-medium text-gray-800">{habit.name}</p>
        <div className="mt-1 flex items-center gap-4 text-xs">
          <span className="text-gray-500">Streak: {currentStreak}</span>
          <span className="text-gray-500">
            Week: {weeklyCheckedCount}/{goal} ({percentage}%)
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-1.5 h-1.5 w-full max-w-[100px] overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex space-x-2">
        {lastDays.map(({ label, date }) => {
          const check = habit.checkIns.find((c) => c.date === date);
          const done = check ? check.isChecked : false;

          // Allow check-ins on any day of the current week (Monday to Sunday)
          // Only disable dates that are beyond the current week (after Sunday)
          const checkInDate = startOfDay(parseLocalDate(date));
          const isDisabled = checkInDate.getTime() > weekEnd.getTime();

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
        <div className="mx-3 h-6 border-l border-gray-300"></div>
        <button
          type="button"
          onClick={() => onEdit(habit)}
          aria-label="Edit habit"
          title="Edit Habit"
        >
          <Edit2 size={16} />
        </button>
        <DeleteHabitDialog
          habitName={habit.name}
          onConfirm={() => onDelete(habit.id)}
        />
      </div>
    </li>
  );
}
