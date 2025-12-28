import type { Habit } from '@/types';
import { triggerConfetti } from '@/lib/confetti';
import { Edit2 } from 'lucide-react';
import { DeleteHabitDialog } from './DeleteHabitDialog';
import { isWithinInterval, startOfDay, isAfter, subDays } from 'date-fns';
import { formatDateforServer, parseLocalDate } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

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

  const today = startOfDay(new Date());
  const habitStartDate = startOfDay(parseLocalDate(habit.startDate));

  // Last allowed check-in date is the earlier of: creation date or today
  const lastAllowedDate = today < habitStartDate ? today : habitStartDate;

  // Generate rolling 7-day window going backwards from last allowed date
  // Show the last 7 days: [6 days ago, 5 days ago, ..., yesterday, lastAllowedDate]
  const lastDays = Array.from({ length: 7 }, (_, i) => {
    const daysBack = 6 - i; // 6, 5, 4, 3, 2, 1, 0
    const d = subDays(lastAllowedDate, daysBack);
    return {
      label: daysOfWeek[d.getDay() === 0 ? 6 : d.getDay() - 1], // Convert to Mon-Sun (0=Sun -> 6, 1=Mon -> 0)
      date: formatDateforServer(d),
    };
  });

  const checkIns = habit.checkIns || [];

  // Calculate current streak (consecutive checked days from last allowed date backwards)
  let currentStreak = 0;
  for (let i = lastDays.length - 1; i >= 0; i--) {
    const dayCheckIn = checkIns.find((c) => c.date === lastDays[i].date);
    if (dayCheckIn?.isChecked) currentStreak++;
    else break;
  }

  // Count checked check-ins in the displayed 7-day window (not calendar week)
  const windowStart = startOfDay(parseLocalDate(lastDays[0].date)); // First day in window (6 days ago)
  const windowEnd = startOfDay(parseLocalDate(lastDays[6].date)); // Last day in window (lastAllowedDate)

  const weeklyCheckedCount = checkIns.filter((checkIn) => {
    if (!checkIn.isChecked) return false;
    const checkInDate = startOfDay(parseLocalDate(checkIn.date));
    return isWithinInterval(checkInDate, {
      start: windowStart,
      end: windowEnd,
    });
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
    <li className="border-border bg-card hover:bg-accent flex w-full max-w-2xl flex-col gap-2 rounded-lg border px-2 py-1 text-sm transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between sm:rounded-lg sm:px-3 sm:py-2">
      <div className="flex min-w-0 flex-col items-start text-left sm:flex-1">
        <p className="text-foreground text-sm font-medium">{habit.name}</p>
        <div className="mt-1 flex items-center gap-2 text-xs sm:gap-4">
          <span className="text-muted-foreground">Streak: {currentStreak}</span>
          <span className="text-muted-foreground">
            Week: {weeklyCheckedCount}/{goal} ({percentage}%)
          </span>
        </div>
        {/* Progress bar */}
        <div className="bg-muted mt-1.5 h-1.5 w-full max-w-[100px] overflow-hidden rounded-full">
          <div
            className="bg-habit-checkin h-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-start sm:gap-2">
        {lastDays.map(({ label, date }) => {
          const check = habit.checkIns.find((c) => c.date === date);
          const done = check ? check.isChecked : false;

          const checkInDate = startOfDay(parseLocalDate(date));

          // Disable if date is in the future (after last allowed date)
          const isFuture = isAfter(checkInDate, lastAllowedDate);
          const isDisabled = isFuture;

          return (
            <div
              key={date}
              onClick={(e) => {
                if (!isDisabled) {
                  onToggleCheckIn(habit.id, date);
                  if (!done) triggerConfetti(e.clientX, e.clientY);
                }
              }}
              className={cn(
                'flex h-[24px] w-[24px] items-center justify-center rounded-full border text-[12px] transition-all duration-200',
                {
                  'bg-habit-checkin text-habit-checkin-foreground': done,
                  'bg-muted text-muted-foreground': !done,
                  'cursor-not-allowed opacity-50': isDisabled,
                  'cursor-pointer hover:scale-105': !isDisabled && !done,
                  'hover:opacity-90': !isDisabled && done,
                },
              )}
              title={date}
            >
              {label}
            </div>
          );
        })}
        <div className="border-border mx-1 h-6 border-l sm:mx-3"></div>
        <button
          type="button"
          onClick={() => onEdit(habit)}
          aria-label="Edit habit"
          title="Edit Habit"
          className="text-muted-foreground hover:text-foreground transition-colors duration-200"
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
