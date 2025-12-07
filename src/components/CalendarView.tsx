import { useMemo, useState } from 'react';
import { Calendar, momentLocalizer, type View } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, startOfDay, isSameDay } from 'date-fns';
import { type Task, type Habit, TaskStatus } from '@/types';
import { useUpdateTask } from '@/lib/useTasks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle2, ListTodo } from 'lucide-react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

// Helper function to parse date-only strings as local dates (not UTC)
// This prevents timezone shifts when parsing YYYY-MM-DD strings
function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Local date, not UTC
}

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
        const end = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate(),
          23,
          59,
          59,
          999,
        );
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
  // Week and month views: let react-big-calendar handle filtering automatically
  const dayViewEvents = useMemo(() => {
    if (currentView !== 'day') return events;
    return events.filter((event) => isSameDay(event.start, currentDate));
  }, [events, currentView, currentDate]);

  // Handle drag and drop (only for tasks)
  const handleEventDrop = (args: {
    event: CalendarEvent | object;
    start: Date | string;
  }) => {
    const calendarEvent = args.event as CalendarEvent;

    // Only allow drag and drop for tasks
    if (calendarEvent.type !== 'task') {
      toast.error('Only tasks can be moved');
      return;
    }

    const startDate =
      args.start instanceof Date ? args.start : new Date(args.start);
    const task = calendarEvent.resource as Task;
    const newDate = format(startOfDay(startDate), 'yyyy-MM-dd');

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

    if (calendarEvent.type === 'task') {
      const task = calendarEvent.resource as Task;
      const isDone = task.status === TaskStatus.DONE;

      return {
        className: isDone ? 'opacity-60 line-through' : '',
        style: {
          backgroundColor: isDone ? '#9ca3af' : '#3b82f6',
          borderColor: isDone ? '#6b7280' : '#2563eb',
          color: '#ffffff',
        },
      };
    } else {
      // Habit events - always green (only checked check-ins are shown)
      return {
        className: '',
        style: {
          backgroundColor: '#10b981', // Green for checked
          borderColor: '#059669',
          color: '#ffffff',
          opacity: 1,
        },
      };
    }
  };

  // Custom formats to remove time display completely
  const formats = {
    dayFormat: 'ddd D',
    dayHeaderFormat: 'ddd M/D',
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
    eventTimeRangeFormat: () => '', // No time display
    eventTimeRangeStartFormat: () => '',
    eventTimeRangeEndFormat: () => '',
    timeGutterFormat: () => '',
    monthHeaderFormat: 'MMMM YYYY',
    weekdayFormat: 'ddd',
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
      {/* @ts-expect-error - react-big-calendar types are complex, but this works at runtime */}
      <DnDCalendar
        localizer={localizer}
        events={currentView === 'day' ? dayViewEvents : events}
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
