import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TooltipProvider } from './components/ui/tooltip';
import { Toaster } from './components/ui/sonner';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex min-h-dvh w-full">
          <AppSidebar />
          <div className="flex min-h-dvh flex-1 flex-col">
            <Header />
            <main className="mt-8 flex-1 overflow-auto">{children}</main>
            <Footer />
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </SidebarProvider>
  );
}
