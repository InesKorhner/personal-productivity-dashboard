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
