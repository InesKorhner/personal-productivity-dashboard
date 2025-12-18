import type { Task } from '@/types';

interface NotesAsideProps {
  selectedTask: Task | null;
  onSaveNotes: (taskId: string, notes: string) => void;
}

export function NotesAside({ selectedTask, onSaveNotes }: NotesAsideProps) {
  return (
    <aside className="h-full overflow-y-auto border-l p-6">
      <div className="mb-4 text-lg font-semibold text-foreground">Notes</div>
      {selectedTask ? (
        <div className="space-y-4">
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Task
            </div>
            <div className="text-sm font-medium text-foreground">
              {selectedTask.text}
            </div>
          </div>
          
          <div>
            <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Notes
            </div>
            <textarea
              value={selectedTask.notes ?? ''}
              onChange={(e) => onSaveNotes(selectedTask.id, e.target.value)}
              className="min-h-[300px] w-full resize-none rounded-md border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Write notes for this task..."
            />
          </div>

          <div className="flex items-center gap-2 border-t pt-2">
            <span className="text-xs font-medium text-muted-foreground">
              {selectedTask.category}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground capitalize">
              {selectedTask.status.toLowerCase()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-sm text-muted-foreground">
              No task selected
            </div>
            <div className="text-sm text-muted-foreground">
              Select a task to view or edit notes
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
