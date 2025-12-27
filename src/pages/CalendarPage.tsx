import { CalendarView } from '@/components/CalendarView';
import { useTasks } from '@/lib/useTasks';
import { useHabits } from '@/lib/useHabits';

export default function CalendarPage() {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: habits = [], isLoading: habitsLoading } = useHabits();

  const isLoading = tasksLoading || habitsLoading;

  return (
    <div className="bg-background h-full w-full p-4 md:p-6">
      <CalendarView tasks={tasks} habits={habits} isLoading={isLoading} />
    </div>
  );
}
