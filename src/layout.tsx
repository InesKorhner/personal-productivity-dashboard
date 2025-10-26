import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TooltipProvider } from './components/ui/tooltip';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col h-screen">
          <Header />
          <main className="mt-8 flex-1 overflow-auto">{children}</main>

          <Footer />
        </div>
      </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
