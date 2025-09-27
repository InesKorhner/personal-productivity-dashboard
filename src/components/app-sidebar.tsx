import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

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
} from '@/components/ui/sidebar';

const items = [
  {
    title: 'Tasks',
    url: '/tasks',
    icon: Home,
  },
  {
    title: 'Habit Tracker',
    url: '/habits',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Stats',
    url: '/stats',
    icon: Search,
  },
  {
    title: 'Search',
    url: '/search',
    icon: Search,
  },
  {
    title: 'Theme',
    url: '/theme',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className='relative flex items-center justify-between p-2'>
        <SidebarTrigger className='absolute top-1 right-2 z-50'/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
