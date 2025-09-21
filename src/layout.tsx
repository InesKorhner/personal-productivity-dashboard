import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='flex flex-col w-full min-h-screen'>

      <Header  />
      <main className='flex-1'>
        <SidebarTrigger />
        {children}
      </main>
      <Footer />
      </div>
    </SidebarProvider>
  );
}
