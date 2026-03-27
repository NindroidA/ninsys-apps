import { Layout } from "@/components/layout";
import { CommandsPage } from "@/pages/CommandsPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { StatusPage } from "@/pages/StatusPage";
import { PageTransition } from "@ninsys/ui/components/animations";
import { Suspense, lazy, useEffect } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

// Lazy-loaded dashboard pages
const LoginPage = lazy(() =>
  import("@/pages/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const GuildSelectorPage = lazy(() =>
  import("@/pages/dashboard/GuildSelectorPage").then((m) => ({
    default: m.GuildSelectorPage,
  }))
);
const OverviewPage = lazy(() =>
  import("@/pages/dashboard/OverviewPage").then((m) => ({
    default: m.OverviewPage,
  }))
);
const ConfigPage = lazy(() =>
  import("@/pages/dashboard/ConfigPage").then((m) => ({
    default: m.ConfigPage,
  }))
);
const TicketsPage = lazy(() =>
  import("@/pages/dashboard/TicketsPage").then((m) => ({
    default: m.TicketsPage,
  }))
);
const ApplicationsPage = lazy(() =>
  import("@/pages/dashboard/ApplicationsPage").then((m) => ({
    default: m.ApplicationsPage,
  }))
);
const AnnouncementsPage = lazy(() =>
  import("@/pages/dashboard/AnnouncementsPage").then((m) => ({
    default: m.AnnouncementsPage,
  }))
);
const MemoryPage = lazy(() =>
  import("@/pages/dashboard/MemoryPage").then((m) => ({
    default: m.MemoryPage,
  }))
);
const RulesPage = lazy(() =>
  import("@/pages/dashboard/RulesPage").then((m) => ({
    default: m.RulesPage,
  }))
);
const ReactionRolesPage = lazy(() =>
  import("@/pages/dashboard/ReactionRolesPage").then((m) => ({
    default: m.ReactionRolesPage,
  }))
);
const BaitChannelPage = lazy(() =>
  import("@/pages/dashboard/BaitChannelPage").then((m) => ({
    default: m.BaitChannelPage,
  }))
);
const RolesPage = lazy(() =>
  import("@/pages/dashboard/RolesPage").then((m) => ({
    default: m.RolesPage,
  }))
);
const DashboardStatusPage = lazy(() =>
  import("@/pages/dashboard/StatusPage").then((m) => ({
    default: m.DashboardStatusPage,
  }))
);
const DataExportPage = lazy(() =>
  import("@/pages/dashboard/DataExportPage").then((m) => ({
    default: m.DataExportPage,
  }))
);
const XpPage = lazy(() =>
  import("@/pages/dashboard/XpPage").then((m) => ({ default: m.XpPage }))
);
const StarboardPage = lazy(() =>
  import("@/pages/dashboard/StarboardPage").then((m) => ({
    default: m.StarboardPage,
  }))
);
const EventsPage = lazy(() =>
  import("@/pages/dashboard/EventsPage").then((m) => ({
    default: m.EventsPage,
  }))
);
const ServerAnalyticsPage = lazy(() =>
  import("@/pages/dashboard/ServerAnalyticsPage").then((m) => ({
    default: m.ServerAnalyticsPage,
  }))
);
const OnboardingPage = lazy(() =>
  import("@/pages/dashboard/OnboardingPage").then((m) => ({
    default: m.OnboardingPage,
  }))
);
const SlaPage = lazy(() =>
  import("@/pages/dashboard/SlaPage").then((m) => ({ default: m.SlaPage }))
);
const RoutingPage = lazy(() =>
  import("@/pages/dashboard/RoutingPage").then((m) => ({
    default: m.RoutingPage,
  }))
);
const IncidentsPage = lazy(() =>
  import("@/pages/dashboard/IncidentsPage").then((m) => ({
    default: m.IncidentsPage,
  }))
);
const SystemSettingsPage = lazy(() =>
  import("@/pages/dashboard/SystemSettingsPage").then((m) => ({
    default: m.SystemSettingsPage,
  }))
);
const ApplicationWorkflowPage = lazy(() =>
  import("@/pages/dashboard/ApplicationWorkflowPage").then((m) => ({
    default: m.ApplicationWorkflowPage,
  }))
);

// Lazy-loaded doc pages
const DocsIndexPage = lazy(() =>
  import("@/pages/docs/DocsIndexPage").then((m) => ({
    default: m.DocsIndexPage,
  }))
);
const PrivacyPage = lazy(() =>
  import("@/pages/docs/PrivacyPage").then((m) => ({
    default: m.PrivacyPage,
  }))
);
const TermsPage = lazy(() =>
  import("@/pages/docs/TermsPage").then((m) => ({ default: m.TermsPage }))
);
const AdminGuidePage = lazy(() =>
  import("@/pages/docs/AdminGuidePage").then((m) => ({
    default: m.AdminGuidePage,
  }))
);
const CommandsDocPage = lazy(() =>
  import("@/pages/docs/CommandsDocPage").then((m) => ({
    default: m.CommandsDocPage,
  }))
);
const ChangelogPage = lazy(() =>
  import("@/pages/docs/ChangelogPage").then((m) => ({
    default: m.ChangelogPage,
  }))
);

const ArchiveViewerPage = lazy(() =>
  import("@/pages/ArchiveViewerPage").then((m) => ({
    default: m.ArchiveViewerPage,
  }))
);

// Lazy-loaded admin pages
const AdminDashboardPage = lazy(() =>
  import("@/pages/admin/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  }))
);
const AdminServersPage = lazy(() =>
  import("@/pages/admin/AdminServersPage").then((m) => ({
    default: m.AdminServersPage,
  }))
);
const AdminAnalyticsPage = lazy(() =>
  import("@/pages/admin/AdminAnalyticsPage").then((m) => ({
    default: m.AdminAnalyticsPage,
  }))
);
const AdminHealthPage = lazy(() =>
  import("@/pages/admin/AdminHealthPage").then((m) => ({
    default: m.AdminHealthPage,
  }))
);
const AdminToolsPage = lazy(() =>
  import("@/pages/admin/AdminToolsPage").then((m) => ({
    default: m.AdminToolsPage,
  }))
);

// Layout wrappers and auth guards
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SuperAdminRoute } from "@/components/admin/SuperAdminRoute";
import { GuildRoute } from "@/components/auth/GuildRoute";
import { OwnerRoute } from "@/components/auth/OwnerRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Landing pages — eagerly loaded with layout */}
          <Route
            element={
              <Layout>
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </Layout>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/commands" element={<CommandsPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/archive-viewer" element={<ArchiveViewerPage />} />
          </Route>

          {/* Doc pages — lazy loaded with layout */}
          <Route
            element={
              <Layout>
                <PageTransition>
                  <Outlet />
                </PageTransition>
              </Layout>
            }
          >
            <Route path="/docs" element={<DocsIndexPage />} />
            <Route path="/docs/privacy" element={<PrivacyPage />} />
            <Route path="/docs/terms" element={<TermsPage />} />
            <Route path="/docs/admin-guide" element={<AdminGuidePage />} />
            <Route path="/docs/commands" element={<CommandsDocPage />} />
            <Route path="/docs/changelog" element={<ChangelogPage />} />
          </Route>

          {/* Auth pages */}
          <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />

          {/* Dashboard pages — lazy loaded, protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route index element={<GuildSelectorPage />} />
            <Route path="incidents" element={<IncidentsPage />} />

            <Route
              path=":guildId"
              element={
                <GuildRoute>
                  <DashboardLayout>
                    <Outlet />
                  </DashboardLayout>
                </GuildRoute>
              }
            >
              <Route index element={<OverviewPage />} />
              <Route path="config" element={<ConfigPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="memory" element={<MemoryPage />} />
              <Route path="rules" element={<RulesPage />} />
              <Route path="reaction-roles" element={<ReactionRolesPage />} />
              <Route path="bait-channel" element={<BaitChannelPage />} />
              <Route path="roles" element={<RolesPage />} />
              <Route path="systems" element={<SystemSettingsPage />} />
              <Route
                path="status"
                element={
                  <OwnerRoute>
                    <DashboardStatusPage />
                  </OwnerRoute>
                }
              />
              <Route path="data" element={<DataExportPage />} />
              <Route path="xp" element={<XpPage />} />
              <Route path="starboard" element={<StarboardPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route
                path="server-analytics"
                element={<ServerAnalyticsPage />}
              />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="sla" element={<SlaPage />} />
              <Route path="routing" element={<RoutingPage />} />
              <Route
                path="app-workflow"
                element={<ApplicationWorkflowPage />}
              />
              <Route path="*" element={<Navigate to="." replace />} />
            </Route>
          </Route>

          {/* Super Admin — owner + TOTP protected */}
          <Route
            path="/admin"
            element={
              <SuperAdminRoute>
                <AdminLayout />
              </SuperAdminRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="servers" element={<AdminServersPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="health" element={<AdminHealthPage />} />
            <Route path="tools" element={<AdminToolsPage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Catch-all */}
          <Route
            path="*"
            element={
              <Layout>
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}
