import { cn } from '@/lib/utils';
import { Trash2, CheckCircle2 } from 'lucide-react';
import type { Categories } from '@/types';

interface CategoryListProps {
  categories: readonly Categories[];
  selectedCategory: string | null;
  selectedView: 'category' | 'completed' | 'deleted';
  onSelectCategory: (category: string) => void;
  onSelectView: (view: 'category' | 'completed' | 'deleted') => void;
}

export function CategoryList({
  categories,
  selectedCategory,
  selectedView,
  onSelectCategory,
  onSelectView,
}: CategoryListProps) {
  return (
    <nav className="p-4">
      <div className="text-foreground mb-4 text-sm font-semibold">Lists</div>
      <ul className="space-y-1">
        {categories.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => {
                onSelectView('category');
                onSelectCategory(c);
              }}
              className={cn(
                'hover:bg-accent w-full rounded-md px-3 py-2 text-left',
                selectedView === 'category' && selectedCategory === c
                  ? 'bg-primary/10 font-medium'
                  : '',
              )}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>

      <div className="text-foreground mt-6 text-sm font-semibold">Sections</div>
      <ul className="mt-2 space-y-1">
        <li>
          <button
            type="button"
            onClick={() => onSelectView('completed')}
            className={cn(
              'hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors',
              selectedView === 'completed' ? 'bg-primary/10 font-medium' : '',
            )}
          >
            <CheckCircle2 size={16} />
            <span>Completed</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onSelectView('deleted')}
            className={cn(
              'hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors',
              selectedView === 'deleted' ? 'bg-primary/10 font-medium' : '',
            )}
          >
            <Trash2 size={16} />
            <span>Trash</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
