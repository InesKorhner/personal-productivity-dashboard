import { cn } from '@/lib/utils';
import type { Categories } from '@/types';

interface CategoryListProps {
  categories: readonly Categories[];
  selectedCategory: string | null;
  selectedView: 'category';
  onSelectCategory: (category: string) => void;
  onSelectView: (view: 'category') => void;
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
      <div className="text-foreground mb-4 text-base font-semibold">
        Categories
      </div>
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
                'hover:bg-accent w-full rounded-md px-3 py-2 text-left transition-colors duration-200',
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
    </nav>
  );
}
