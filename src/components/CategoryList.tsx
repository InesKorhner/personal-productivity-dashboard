import { cn } from '@/lib/utils';

interface CategoryListProps {
  categories: string[];
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
      <div className="mb-4 text-sm font-semibold">Lists</div>
      <ul className="space-y-1">
        {categories.map((c) => (
          <li key={c}>
            <button
              type="button"
              onClick={() => { onSelectView('category'); onSelectCategory(c); }}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md hover:bg-gray-100',
                selectedView === 'category' && selectedCategory === c
                  ? 'bg-primary/10 font-medium'
                  : ''
              )}
            >
              {c}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-sm font-semibold">Sections</div>
      <ul className="mt-2 space-y-1">
        <li>
          <button
            type="button"
            onClick={() => onSelectView('completed')}
            className={cn('w-full text-left px-3 py-2 rounded-md hover:bg-gray-100',
              selectedView === 'completed' ? 'bg-primary/10 font-medium' : ''
            )}
          >
            ✅ Completed
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => onSelectView('deleted')}
            className={cn('w-full text-left px-3 py-2 rounded-md hover:bg-gray-100',
              selectedView === 'deleted' ? 'bg-primary/10 font-medium' : ''
            )}
          >
            🗑️ Trash
          </button>
        </li>
      </ul>
    </nav>
  );
}
