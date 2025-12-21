import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface NotesAsideProps {
  selectedTask: Task | null;
  onSaveNotes: (taskId: string, notes: string) => void;
  scrollable?: boolean;
}

export function NotesAside({
  selectedTask,
  onSaveNotes,
  scrollable = true,
}: NotesAsideProps) {
  return (
    <aside className={cn('h-full p-6', scrollable && 'overflow-y-auto')}>
      <div className="text-foreground mb-4 text-lg font-semibold">Notes</div>
      {selectedTask ? (
        <div className="space-y-4">
          <div>
            <div className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              Task
            </div>
            <div className="text-foreground text-sm font-medium">
              {selectedTask.text}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
              Notes
            </div>
            <textarea
              value={selectedTask.notes ?? ''}
              onChange={(e) => onSaveNotes(selectedTask.id, e.target.value)}
              className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary min-h-[300px] w-full resize-none rounded-md border p-4 text-sm focus:ring-1 focus:outline-none"
              placeholder="Write notes for this task..."
            />
          </div>

          <div className="flex items-center gap-2 border-t pt-2">
            <span className="text-muted-foreground text-xs font-medium">
              {selectedTask.category}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground text-xs capitalize">
              {selectedTask.status.toLowerCase()}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground mb-2 text-sm">
              No task selected
            </div>
            <div className="text-muted-foreground text-sm">
              Select a task to view or edit notes
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
