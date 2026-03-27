import { BotOfflineBanner } from "@/components/dashboard/BotOfflineBanner";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { DashboardErrorBoundary } from "@/components/dashboard/DashboardErrorBoundary";
import { useBotHealth } from "@/hooks/useBotHealth";
import { useSidebarStore } from "@/stores/sidebarStore";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();
  const { guildId } = useParams<{ guildId: string }>();
  const location = useLocation();

  // Health check — updates global offline banner
  useBotHealth(guildId);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, setMobileOpen]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content area */}
      <div className="flex-1 min-w-0">
        <DashboardHeader />
        <BotOfflineBanner />
        <main className="px-4 py-6 pb-24 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <DashboardErrorBoundary key={location.pathname}>
            {children}
          </DashboardErrorBoundary>
        </main>
      </div>
    </div>
  );
}
