import { cn } from "@ninsys/ui/lib";
import {
  Activity,
  BarChart3,
  ChevronLeft,
  LayoutDashboard,
  Server,
  Settings,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
}

const ADMIN_NAV: NavItem[] = [
  { to: "", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "servers", label: "Servers", icon: Server },
  { to: "analytics", label: "Analytics", icon: BarChart3 },
  { to: "health", label: "System Health", icon: Activity },
  { to: "tools", label: "Admin Tools", icon: Settings },
];

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex flex-col border-r border-border bg-card/80 backdrop-blur-xl w-60 h-screen sticky top-0">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 h-14 border-b border-border flex-shrink-0 hover:bg-muted/50 transition-colors"
          title="Back to Cogworks site"
        >
          <img
            src="/cogworks-bot-icon.png"
            alt="Cogworks"
            className="h-8 w-8 rounded-lg flex-shrink-0"
          />
          <span className="font-semibold text-sm">Cogworks</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">
            Admin
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to ? `/admin/${item.to}` : "/admin"}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-border p-2 flex-shrink-0">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 flex-shrink-0" />
            <span>Back to Dashboard</span>
          </NavLink>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
