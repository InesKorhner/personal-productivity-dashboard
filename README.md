# Personal Productivity Dashboard

A React productivity app for managing daily tasks, tracking habits, and visualizing schedules through an interactive calendar.

**[Live Demo](https://soft-chaja-5b3c54.netlify.app/)** | **[Video Walkthrough](YOUR_LOOM_LINK_HERE)**

## Features

**Task Management**
- Create, edit, and delete tasks across categories (Work, Exercise, Study, My List)
- Mark tasks as complete with soft-delete and trash/restore support
- Add notes to individual tasks
- Filter tasks by category

**Habit Tracker**
- Set habits with weekly frequency goals (1-7 days/week)
- 7-day rolling check-in window with streak tracking
- Visual progress bars and weekly completion stats
- Organized by time of day (Morning, Afternoon, Evening)

**Calendar View**
- Month, week, and day views with drag-and-drop rescheduling
- Tasks and habit check-ins displayed as color-coded events
- Click events to navigate to task/habit details

**General**
- Fully responsive design (mobile, tablet, desktop)
- Dark/light theme with system preference detection
- Skeleton loading states and toast notifications
- Optimistic updates with error recovery

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, Radix UI, Lucide Icons |
| State Management | TanStack React Query, Zustand |
| Routing | React Router v7 |
| REST API | JSON Server |

## Deployment

- **Frontend** hosted on [Netlify](https://www.netlify.com/)
- **REST API** (JSON Server) hosted on [Vercel](https://vercel.com/)

## Local Setup

```bash
pnpm install
pnpm json-server   # starts API on http://localhost:3001
pnpm dev            # starts app on http://localhost:5173
```

Run both commands in separate terminals.
