import type { Task } from '@/types';

interface NotesAsideProps {
  selectedTask: Task | null;
  onSaveNotes: (taskId: string, notes: string) => void;
}

export function NotesAside({ selectedTask, onSaveNotes }: NotesAsideProps) {
  return (
    <aside className="h-full overflow-y-auto border-l p-6">
      <div className="mb-4 text-lg font-semibold text-gray-800">Notes</div>
      {selectedTask ? (
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Task
            </div>
            <div className="text-sm font-medium text-gray-800">
              {selectedTask.text}
            </div>
          </div>
          
          <div>
            <div className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Notes
            </div>
            <textarea
              value={selectedTask.notes ?? ''}
              onChange={(e) => onSaveNotes(selectedTask.id, e.target.value)}
              className="min-h-[300px] w-full resize-none rounded-md border border-gray-300 p-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Write notes for this task..."
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <span className="text-xs font-medium text-gray-500">
              {selectedTask.category}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs text-gray-500 capitalize">
              {selectedTask.status.toLowerCase()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-sm font-medium text-gray-500">
              No task selected
            </div>
            <div className="text-xs text-gray-400">
              Select a task to view or edit notes
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
