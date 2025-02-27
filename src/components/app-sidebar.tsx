import { Dumbbell, Home, Scale, CalendarRange } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";

const routes = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Dashboard",
  },
  {
    href: "/weight",
    icon: Scale,
    label: "Weight",
  },
  {
    href: "/training",
    icon: Dumbbell,
    label: "Training",
  },
  {
    href: "/training/plan",
    icon: CalendarRange,
    label: "Training Plan",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-xl font-bold">Gym Diary</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => {
            const Icon = route.icon;

            return (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild>
                  <NavLink to={route.href}>
                    <Icon className="mr-2" />
                    <span>{route.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
