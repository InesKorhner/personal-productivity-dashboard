import {
  format,
  startOfDay,
  isToday,
  isPast,
  isFuture,
  parseISO,
} from 'date-fns';

export function formatTaskDate(dateInput?: string | Date) {
  if (!dateInput) return { label: null, variant: null };

  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    date = dateInput.includes('T') ? new Date(dateInput) : parseISO(dateInput);
  } else {
    return { label: null, variant: null };
  }

  if (isNaN(date.getTime())) return { label: null, variant: null };

  const normalizedDate = startOfDay(date);

  if (isToday(normalizedDate)) {
    return { label: 'Today', variant: 'today' };
  }

  if (isPast(normalizedDate)) {
    return {
      label: format(normalizedDate, 'd MMM'),
      variant: 'past',
    };
  }

  if (isFuture(normalizedDate)) {
    return {
      label: format(normalizedDate, 'd MMM'),
      variant: 'future',
    };
  }

  return {
    label: format(normalizedDate, 'd MMM'),
    variant: 'future',
  };
}

export function formatDateforServer(date: Date) {
  return format(startOfDay(date), 'yyyy-MM-dd');
}

export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function normalizeDateString(dateString: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  const date = new Date(dateString);
  return formatDateforServer(date);
}
