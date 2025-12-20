import { createContext, useContext } from 'react';

// Context for sharing TasksPage state with AppSidebar
type TasksPageContextType = {
  selectedView: 'category';
  onSelectView: (view: 'category') => void;
};

export const TasksPageContext = createContext<TasksPageContextType | null>(null);

export function useTasksPageContext() {
  return useContext(TasksPageContext);
}

