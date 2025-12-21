import { useThemeStore } from '@/lib/useThemeStore';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="relative flex h-14 items-center px-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-foreground absolute left-1/2 -translate-x-1/2 text-xl font-bold">
          Productivity Dashboard
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="fixed right-4 z-50 h-9 w-9"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
