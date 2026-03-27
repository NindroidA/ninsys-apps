import { useSidebarStore } from "@/stores/sidebarStore";
import { Menu } from "lucide-react";
import { GuildSelector } from "./GuildSelector";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export function DashboardHeader() {
  const toggleMobile = useSidebarStore((s) => s.toggleMobile);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 border-b border-border bg-card/60 backdrop-blur-lg">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMobile}
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="hidden sm:inline text-xs text-muted-foreground">
          Dashboard is in beta — the bot is fully stable
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <GuildSelector />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
