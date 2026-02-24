/**
 * Admin layout with sidebar navigation
 */

import { cn } from "@ninsys/ui/lib";
import {
  ArrowLeft,
  ClipboardList,
  History,
  LayoutDashboard,
  Monitor,
  Users,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const sidebarItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/sessions", label: "Sessions", icon: Monitor },
  { to: "/admin/tier-history", label: "Tier History", icon: History },
  { to: "/admin/audit-log", label: "Audit Log", icon: ClipboardList },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm shrink-0 hidden lg:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1" aria-label="Admin navigation">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-border">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </NavLink>
        </div>
      </aside>

      {/* Mobile sidebar (horizontal tabs) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm">
        <nav className="flex overflow-x-auto" aria-label="Admin navigation">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium whitespace-nowrap min-w-[72px] transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
