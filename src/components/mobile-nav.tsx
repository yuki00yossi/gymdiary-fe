import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { Dumbbell, Home, Scale, CalendarRange } from "lucide-react";

const routes = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
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
    label: "Plan",
  },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
      <div className="flex items-center justify-around h-16">
        {routes.map((route) => {
          const Icon = route.icon;

          return (
            <NavLink
              key={route.href}
              to={route.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-1 text-xs font-medium transition-colors"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
