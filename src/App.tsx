import Layout from './layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TasksPage from '@/pages/TasksPage';
import { HabitTrackerPage } from '@/pages/HabitTrackerPage';
import CalendarPage from '@/pages/CalendarPage';
import ThemePage from '@/pages/ThemePage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/habits" element={<HabitTrackerPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/theme" element={<ThemePage />} />
          </Routes>
        </Layout>
      </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
