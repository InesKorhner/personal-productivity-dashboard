export function formatTaskDate(dateInput?: string | Date) {
  if (!dateInput) return { label: null, variant: null };

  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return { label: null, variant: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(date);
  taskDate.setHours(0, 0, 0, 0);

  const diff = taskDate.getTime() - today.getTime();

  const formatter = { day: '2-digit', month: 'short' } as const;

  if (diff === 0) {
    return { label: 'Today', variant: 'today' };
  }

  if (diff < 0) {
    return {
      label: taskDate.toLocaleDateString('en-US', formatter),
      variant: 'past',
    };
  }

  return {
    label: taskDate.toLocaleDateString('en-US', formatter),
    variant: 'future',
  };
}


