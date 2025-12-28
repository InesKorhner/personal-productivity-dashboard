# Loading States System - Design Tokens

## Standardizovani Loading States Sistem

### Skeleton Komponenta
- **Base**: `bg-accent animate-pulse rounded-md`
- **Animation**: `transition-opacity duration-200`
- Koristi se za sve loading states

### Loading Komponente

#### TaskListSkeleton
- **Visine**: `h-12` (form), `h-16` (task items)
- **Spacing**: `gap-4`
- **Koristi se za**: TasksPage loading state

#### HabitListSkeleton
- **Visine**: `h-16` (habit items)
- **Spacing**: `gap-4`
- **Koristi se za**: HabitTrackerPage loading state

#### CalendarSkeleton
- **Visine**: `h-12` (toolbar), `h-96` (calendar)
- **Spacing**: `gap-4`
- **Koristi se za**: CalendarPage loading state

### Form Loading States
- **Spinner**: `Loader2` sa `animate-spin`
- **Koristi se za**: Form submissions (AddTaskForm, AddHabitDialog, etc.)

### Best Practices
- Uvek koristiti skeleton komponente umesto teksta "Loading..."
- Konzistentne visine za isti tip sadržaja
- Smooth fade-in animacije za loading states

