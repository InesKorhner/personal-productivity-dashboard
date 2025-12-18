import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer, type View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import type { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfDay,
  isSameDay,
  endOfDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { type Task, type Habit, TaskStatus } from '@/types';
import { useUpdateTask } from '@/lib/useTasks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle2, ListTodo } from 'lucide-react';
import { useThemeStore } from '@/lib/useThemeStore';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { formatDateforServer, parseLocalDate } from '@/lib/dateUtils';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Properly type the DnDCalendar with our CalendarEvent type
const DnDCalendar = withDragAndDrop<CalendarEvent, CalendarEvent['resource']>(
  Calendar,
);

interface CalendarViewProps {
  tasks: Task[];
  habits: Habit[];
  isLoading: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Task | Habit;
  type: 'task' | 'habit';
  allDay?: boolean;
  isChecked?: boolean; // For habits: true = checked, false = unchecked
}

// Custom Event Component
function CustomEvent({ event }: { event: CalendarEvent }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (event.type === 'task') {
      // Navigate to tasks page - no edit dialog available
      navigate('/tasks');
    } else {
      // Navigate to habits page with habit ID in state to open edit dialog
      const habit = event.resource as Habit;
      navigate('/habits', {
        state: { editHabitId: habit.id },
      });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex h-full cursor-pointer items-center gap-1 px-1 text-xs"
      title={event.title}
    >
      {event.type === 'task' ? (
        <ListTodo className="h-3 w-3 shrink-0" />
      ) : (
        <CheckCircle2 className="h-3 w-3 shrink-0" />
      )}
      <span className="truncate">{event.title}</span>
    </div>
  );
}

export function CalendarView({ tasks, habits, isLoading }: CalendarViewProps) {
  const updateTask = useUpdateTask();
  const theme = useThemeStore((state) => state.theme);
  const [currentView, setCurrentView] = useState<View>('month');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Transform tasks to calendar events
  const taskEvents = useMemo<CalendarEvent[]>(() => {
    return tasks
      .filter((task) => task.date && !task.deleted)
      .map((task) => {
        // Parse as local date to avoid timezone issues
        const taskDate = parseLocalDate(task.date!);
        const start = startOfDay(taskDate);
        // Create end date without mutation
        const end = endOfDay(start);
        return {
          id: task.id,
          title: task.text,
          start,
          end,
          resource: task,
          type: 'task' as const,
          allDay: true,
        };
      });
  }, [tasks]);

  // Transform habits - show ONLY checked check-ins (green)
  const habitEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];
    habits.forEach((habit) => {
      habit.checkIns.forEach((checkIn) => {
        // Only show checked check-ins (green) - skip unchecked ones
        if (!checkIn.isChecked) return;

        // Parse as local date to avoid timezone issues
        const checkInDate = parseLocalDate(checkIn.date);
        const start = startOfDay(checkInDate);
        // Create end date without mutation
        const end = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          23,
          59,
          59,
          999,
        );
        events.push({
          id: `${habit.id}-${checkIn.id}`,
          title: habit.name,
          start,
          end,
          resource: habit,
          type: 'habit' as const,
          allDay: true,
          isChecked: true, // Always true since we filter unchecked ones
        });
      });
    });
    return events;
  }, [habits]);

  // Combine all events
  const events = useMemo(
    () => [...taskEvents, ...habitEvents],
    [taskEvents, habitEvents],
  );

  // Filter events for day view only
  const filteredEvents = useMemo(() => {
    if (currentView === 'day') {
      return events.filter((event) => isSameDay(event.start, currentDate));
    }
    return events;
  }, [events, currentView, currentDate]);

  // Handle drag and drop (only for tasks)
  const handleEventDrop: withDragAndDropProps<CalendarEvent>['onEventDrop'] = (
    args,
  ) => {
    const calendarEvent = args.event as CalendarEvent;

    // Only allow drag and drop for tasks
    if (calendarEvent.type !== 'task') {
      toast.error('Only tasks can be moved');
      return;
    }

    const startDate = args.start as Date;
    const task = calendarEvent.resource as Task;
    const newDate = formatDateforServer(startDate);

    updateTask.mutate(
      {
        id: task.id,
        date: newDate,
      },
      {
        onSuccess: () => {
          toast.success('Task date updated');
        },
        onError: () => {
          toast.error('Failed to update task date');
        },
      },
    );
  };

  // Event styling based on type and status
  const eventPropGetter = (event: CalendarEvent | object) => {
    const calendarEvent = event as CalendarEvent;
    const isDark = theme === 'dark';

    if (calendarEvent.type === 'task') {
      const task = calendarEvent.resource as Task;
      const isDone = task.status === TaskStatus.DONE;

      if (isDone) {
        return {
          className: 'opacity-60 line-through',
          style: {
            backgroundColor: isDark ? '#6b7280' : '#9ca3af',
            borderColor: isDark ? '#4b5563' : '#6b7280',
            color: '#ffffff',
          },
        };
      }

      return {
        className: '',
        style: {
          backgroundColor: isDark ? '#2563eb' : '#3b82f6',
          borderColor: isDark ? '#1d4ed8' : '#2563eb',
          color: '#ffffff',
        },
      };
    } else {
      // Habit events - always green (only checked check-ins are shown)
      return {
        className: '',
        style: {
          backgroundColor: isDark ? '#059669' : '#10b981',
          borderColor: isDark ? '#047857' : '#059669',
          color: '#ffffff',
          opacity: 1,
        },
      };
    }
  };

  // Custom formats to remove time display completely
  const formats = {
    dayFormat: (date: Date) => format(date, 'd'), // Day number in month view (1, 2, 3, etc.)
    dayHeaderFormat: (date: Date) => format(date, 'EEEE, MMMM d, yyyy'), // Day view: "Monday, January 15, 2024"
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
      // Week view: "December 15 - December 21, 2025"
      if (start.getFullYear() === end.getFullYear()) {
        if (start.getMonth() === end.getMonth()) {
          return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
        }
        return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
      }
      return `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`;
    },
    eventTimeRangeFormat: () => '', // No time display
    eventTimeRangeStartFormat: () => '',
    eventTimeRangeEndFormat: () => '',
    timeGutterFormat: () => '',
    monthHeaderFormat: 'MMMM yyyy', // Month view header: "January 2024"
    weekdayFormat: (date: Date) => format(date, 'EEEE'), // Full weekday names: "Monday", "Tuesday", etc.
    selectRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <DnDCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', minHeight: '600px' }}
        onEventDrop={handleEventDrop}
        onView={setCurrentView}
        onNavigate={setCurrentDate}
        view={currentView}
        date={currentDate}
        selectable={false}
        resizable={false}
        defaultView="month"
        views={['month', 'week', 'day']}
        eventPropGetter={eventPropGetter}
        formats={formats}
        components={{
          event: CustomEvent,
        }}
        popup
        showMultiDayTimes={false}
        step={60}
        timeslots={1}
        defaultDate={new Date()}
        scrollToTime={new Date(1970, 1, 1, 6)}
      />
    </div>
  );
}
