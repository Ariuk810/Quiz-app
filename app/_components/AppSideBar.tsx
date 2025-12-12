import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Home",
    // url: "#",
  },
  {
    title: "Inbox",
    // url: "#",
  },
  {
    title: "Calendar",
    // url: "#",
  },
  {
    title: "Search",
    // url: "#",
  },
  {
    title: "Settings",
    url: "#",
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl">History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-5 mt-5  ">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="text-[18px]">
                    <a href={item.url}>
                      {/* <item.icon /> */}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarTrigger className="absolute left-[260px] top-3" />
      </SidebarContent>
    </Sidebar>
  );
}
