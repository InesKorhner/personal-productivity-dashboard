import { createContext, use } from 'react';

// Context for sharing TasksPage state with AppSidebar
type TasksPageContextType = {
  selectedView: 'category';
  onSelectView: (view: 'category') => void;
};

export const TasksPageContext = createContext<TasksPageContextType | null>(
  null,
);

export function useTasksPageContext() {
  const context = use(TasksPageContext);
  if (!context) {
    throw new Error(
      'useTasksPageContext must be used within TasksPageContext.Provider',
    );
  }
  return context;
}
