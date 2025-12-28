import { useMemo, useState, useEffect } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { formatDateforServer, parseLocalDate } from '@/lib/dateUtils';
import { CalendarSkeleton } from '@/components/loading/CalendarSkeleton';

// Responsive breakpoint constants
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

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

// Factory function to create CustomEvent component with reactive state
function createCustomEvent(
  isMobile: boolean,
  navigate: ReturnType<typeof useNavigate>,
) {
  return function CustomEvent(props: { event: CalendarEvent }) {
    const { event } = props;

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

    // On mobile, show popover with full text; on desktop, use title attribute
    if (isMobile) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex h-full cursor-pointer items-center gap-0.5 px-0.5 text-[10px]">
              {event.type === 'task' ? (
                <ListTodo className="h-2.5 w-2.5 shrink-0" />
              ) : (
                <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
              )}
              <span className="truncate">{event.title}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3" side="top">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {event.type === 'task' ? (
                  <ListTodo className="h-4 w-4 shrink-0" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                )}
                <p className="font-semibold break-words">{event.title}</p>
              </div>
              <button
                type="button"
                onClick={handleClick}
                className="text-primary text-sm underline hover:no-underline"
              >
                {event.type === 'task' ? 'View Task' : 'View Habit'}
              </button>
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    // Desktop: current behavior with title attribute for hover tooltip
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
  };
}

export function CalendarView({ tasks, habits, isLoading }: CalendarViewProps) {
  const updateTask = useUpdateTask();
  const theme = useThemeStore((state) => state.theme);
  const navigate = useNavigate();

  // Responsive breakpoints: mobile (< 768px), tablet (768-1023px), desktop (≥ 1024px)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT;
    }
    return false;
  });

  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        window.innerWidth >= MOBILE_BREAKPOINT &&
        window.innerWidth < TABLET_BREAKPOINT
      );
    }
    return false;
  });

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      setIsTablet(
        window.innerWidth >= MOBILE_BREAKPOINT &&
          window.innerWidth < TABLET_BREAKPOINT,
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Default to month view on all screen sizes
  const [currentView, setCurrentView] = useState<View>('month');

  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Create CustomEvent component with reactive state
  const CustomEvent = useMemo(
    () => createCustomEvent(isMobile, navigate),
    [isMobile, navigate],
  );

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
          backgroundColor: 'var(--info)',
          borderColor: isDark ? 'oklch(0.5 0.15 250)' : 'oklch(0.6 0.15 250)',
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

  // Responsive formats - shorter on mobile
  const formats = useMemo(
    () => ({
      dayFormat: (date: Date) => format(date, 'd'), // Day number in month view (1, 2, 3, etc.)
      dayHeaderFormat: (date: Date) => {
        // Mobile: shorter format, Desktop: full format
        return isMobile
          ? format(date, 'EEE, MMM d')
          : format(date, 'EEEE, MMMM d, yyyy');
      },
      dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
        // Mobile: shorter format
        if (isMobile) {
          if (start.getFullYear() === end.getFullYear()) {
            if (start.getMonth() === end.getMonth()) {
              return `${format(start, 'MMM d')} - ${format(end, 'd, yyyy')}`;
            }
            return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
          }
          return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
        }
        // Desktop: full format
        if (start.getFullYear() === end.getFullYear()) {
          if (start.getMonth() === end.getMonth()) {
            // Same month: "December 15 - 21, 2024"
            return `${format(start, 'MMMM d')} - ${format(end, 'd, yyyy')}`;
          }
          // Different months, same year: "December 29 - January 4, 2025"
          return `${format(start, 'MMMM d')} - ${format(end, 'MMMM d, yyyy')}`;
        }
        // Different years: "December 29, 2024 - January 4, 2025"
        return `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`;
      },
      eventTimeRangeFormat: () => '', // No time display
      eventTimeRangeStartFormat: () => '',
      eventTimeRangeEndFormat: () => '',
      timeGutterFormat: () => '',
      monthHeaderFormat: isMobile ? 'MMM yyyy' : 'MMMM yyyy', // Mobile: "Jan 2024", Desktop: "January 2024"
      weekdayFormat: (date: Date) => {
        // Mobile & Tablet: abbreviated (Mon, Tue), Desktop: full (Monday, Tuesday)
        if (isMobile || isTablet) {
          return format(date, 'EEE'); // Mon, Tue, Wed
        }
        return format(date, 'EEEE'); // Monday, Tuesday
      },
      selectRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
        `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
    }),
    [isMobile, isTablet],
  );

  // Responsive views: all views available on all screen sizes
  // Must be before early return to follow React hooks rules
  const availableViews = useMemo<View[]>(() => ['month', 'week', 'day'], []);

  // Ensure currentView is valid for available views
  const validView = useMemo(() => {
    if (availableViews.includes(currentView)) {
      return currentView;
    }
    // Fallback to first available view if current view is not available
    return availableViews[0] || 'month';
  }, [currentView, availableViews]);

  if (isLoading) {
    return (
      <div className="bg-background flex h-full items-center justify-center">
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-background h-full w-full">
      <DnDCalendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: '100%',
          minHeight: isMobile ? '300px' : isTablet ? '500px' : '600px',
        }}
        className="rbc-calendar"
        onEventDrop={isMobile ? undefined : handleEventDrop} // Disable drag-drop on mobile
        onView={setCurrentView}
        onNavigate={setCurrentDate}
        view={validView}
        date={currentDate}
        selectable={false}
        resizable={false}
        defaultView="month"
        views={availableViews}
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
