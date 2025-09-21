import Layout from './layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TasksPage from '@/pages/TasksPage';
import HabitTrackerPage from '@/pages/HabitTrackerPage';
import CalendarPage from '@/pages/CalendarPage';
import StatsPage from '@/pages/StatsPage';
import SearchPage from '@/pages/SearchPage';
import ThemePage from '@/pages/ThemePage';

export const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/habits" element={<HabitTrackerPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/theme" element={<ThemePage />} />
        </Routes>
      </Layout>
    </Router>
  );
};
