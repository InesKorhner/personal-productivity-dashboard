import type { Task } from '@/types';

interface NotesAsideProps {
  selectedTask: Task | null;
  onSaveNotes: (taskId: string, notes: string) => void;
}

export function NotesAside({ selectedTask, onSaveNotes }: NotesAsideProps) {
  return (
    <aside className="col-span-1 col-start-3 h-full overflow-y-auto border-l p-4">
      <div className="mb-3 text-sm font-semibold">Notes</div>
      {selectedTask ? (
        <>
          <div className="mb-2 text-sm text-gray-500">
            Task: {selectedTask.text}
          </div>
          <textarea
            value={selectedTask.notes ?? ''}
            onChange={(e) => onSaveNotes(selectedTask.id, e.target.value)}
            className="h-90 w-full resize-none rounded border p-4 text-sm"
            placeholder="Write notes for the selected task"
          />

          <div className="mt-2 text-sm text-gray-500">
            {selectedTask.category} • {selectedTask.status.replace('_', ' ')}
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-500">
          Select a task to see / edit notes
        </div>
      )}
    </aside>
  );
}
