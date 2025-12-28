import { Calendar, ListTodo, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'My Tasks',
    url: '/tasks',
    icon: ListTodo,
  },
  {
    title: 'Habit Tracker',
    url: '/habits',
    icon: CheckCircle2,
  },
  {
    title: 'Calendar View',
    url: '/calendar',
    icon: Calendar,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="relative flex flex-row items-center justify-start p-4">
        {state === 'expanded' && (
          <h1 className="text-sidebar-foreground text-lg font-semibold">
            Dashboard
          </h1>
        )}
        <SidebarTrigger className="absolute top-2 right-2 z-50 hidden md:flex" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
