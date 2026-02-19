/**
 * Pluginator - Beta
 *
 * Full app with auth, payment, and protected routes.
 * Non-critical routes are lazy-loaded for smaller initial bundle.
 */

import { ProtectedRoute } from "@/components/auth";
import { Layout } from "@/components/layout";
import { PageTransition } from "@ninsys/ui/components/animations";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// Eagerly loaded: acquisition funnel pages (Home, Pricing, Download, Login, Signup)
import { HomePage } from "@/pages/public/HomePage";
import { PricingPage } from "@/pages/public/PricingPage";
import { DownloadPage } from "@/pages/public/DownloadPage";
import { LoginPage } from "@/pages/public/LoginPage";
import { SignupPage } from "@/pages/public/SignupPage";

// Lazy-loaded: everything else
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const AccountPage = lazy(() => import("@/pages/account").then((m) => ({ default: m.AccountPage })));
const AuthCallbackPage = lazy(() => import("@/pages/auth").then((m) => ({ default: m.AuthCallbackPage })));
const AuthErrorPage = lazy(() => import("@/pages/auth").then((m) => ({ default: m.AuthErrorPage })));
const DashboardPage = lazy(() => import("@/pages/dashboard").then((m) => ({ default: m.DashboardPage })));
const CLICommandsPage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.CLICommandsPage })));
const ConfigPage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.ConfigPage })));
const DocsIndexPage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.DocsIndexPage })));
const SecurityPage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.SecurityPage })));
const ThemesPage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.ThemesPage })));
const TroubleshootingPage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.TroubleshootingPage })));
const UserFilesPage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.UserFilesPage })));
const UserGuidePage = lazy(() => import("@/pages/docs").then((m) => ({ default: m.UserGuidePage })));
const PrivacyPage = lazy(() => import("@/pages/legal").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("@/pages/legal").then((m) => ({ default: m.TermsPage })));
const MarketplacePage = lazy(() => import("@/pages/marketplace").then((m) => ({ default: m.MarketplacePage })));
const PluginCategoryPage = lazy(() => import("@/pages/marketplace").then((m) => ({ default: m.PluginCategoryPage })));
const PluginDetailPage = lazy(() => import("@/pages/marketplace").then((m) => ({ default: m.PluginDetailPage })));
const PluginListPage = lazy(() => import("@/pages/marketplace").then((m) => ({ default: m.PluginListPage })));
const ThemeCategoryPage = lazy(() => import("@/pages/marketplace").then((m) => ({ default: m.ThemeCategoryPage })));
const ThemeDetailPage = lazy(() => import("@/pages/marketplace").then((m) => ({ default: m.ThemeDetailPage })));
const ThemeGalleryPage = lazy(() => import("@/pages/marketplace").then((m) => ({ default: m.ThemeGalleryPage })));
const CheckoutPage = lazy(() => import("@/pages/payment/CheckoutPage").then((m) => ({ default: m.CheckoutPage })));
const PaymentCancelPage = lazy(() => import("@/pages/payment/PaymentCancelPage").then((m) => ({ default: m.PaymentCancelPage })));
const PaymentSuccessPage = lazy(() => import("@/pages/payment/PaymentSuccessPage").then((m) => ({ default: m.PaymentSuccessPage })));
const ChangelogPage = lazy(() => import("@/pages/public/ChangelogPage").then((m) => ({ default: m.ChangelogPage })));
const ContactPage = lazy(() => import("@/pages/public/ContactPage").then((m) => ({ default: m.ContactPage })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes (eagerly loaded) */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/pricing"
              element={
                <PageTransition>
                  <PricingPage />
                </PageTransition>
              }
            />
            <Route
              path="/download"
              element={
                <PageTransition>
                  <DownloadPage />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/signup"
              element={
                <PageTransition>
                  <SignupPage />
                </PageTransition>
              }
            />

            {/* Public Routes (lazy-loaded) */}
            <Route
              path="/changelog"
              element={
                <PageTransition>
                  <ChangelogPage />
                </PageTransition>
              }
            />
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <ContactPage />
                </PageTransition>
              }
            />

            {/* Auth Routes */}
            <Route
              path="/auth/callback"
              element={
                <PageTransition>
                  <AuthCallbackPage />
                </PageTransition>
              }
            />
            <Route
              path="/auth/error"
              element={
                <PageTransition>
                  <AuthErrorPage />
                </PageTransition>
              }
            />

            {/* Payment Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <CheckoutPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <PaymentSuccessPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/cancel"
              element={
                <PageTransition>
                  <PaymentCancelPage />
                </PageTransition>
              }
            />

            {/* Marketplace Routes */}
            <Route
              path="/marketplace"
              element={
                <PageTransition>
                  <MarketplacePage />
                </PageTransition>
              }
            />
            <Route
              path="/marketplace/themes"
              element={
                <PageTransition>
                  <ThemeGalleryPage />
                </PageTransition>
              }
            />
            <Route
              path="/marketplace/themes/category/:category"
              element={
                <PageTransition>
                  <ThemeCategoryPage />
                </PageTransition>
              }
            />
            <Route
              path="/marketplace/themes/:id"
              element={
                <PageTransition>
                  <ThemeDetailPage />
                </PageTransition>
              }
            />

            {/* Plugin Registry Routes */}
            <Route
              path="/plugins"
              element={
                <PageTransition>
                  <PluginListPage />
                </PageTransition>
              }
            />
            <Route
              path="/plugins/category/:category"
              element={
                <PageTransition>
                  <PluginCategoryPage />
                </PageTransition>
              }
            />
            <Route
              path="/plugins/:id"
              element={
                <PageTransition>
                  <PluginDetailPage />
                </PageTransition>
              }
            />

            {/* Documentation Routes */}
            <Route
              path="/docs"
              element={
                <PageTransition>
                  <DocsIndexPage />
                </PageTransition>
              }
            />
            <Route
              path="/docs/cli"
              element={
                <PageTransition>
                  <CLICommandsPage />
                </PageTransition>
              }
            />
            <Route
              path="/docs/config"
              element={
                <PageTransition>
                  <ConfigPage />
                </PageTransition>
              }
            />
            <Route
              path="/docs/user-guide"
              element={
                <PageTransition>
                  <UserGuidePage />
                </PageTransition>
              }
            />
            <Route
              path="/docs/troubleshooting"
              element={
                <PageTransition>
                  <TroubleshootingPage />
                </PageTransition>
              }
            />
            <Route
              path="/docs/security"
              element={
                <PageTransition>
                  <SecurityPage />
                </PageTransition>
              }
            />
            <Route
              path="/docs/user-files"
              element={
                <PageTransition>
                  <UserFilesPage />
                </PageTransition>
              }
            />
            <Route
              path="/docs/themes"
              element={
                <PageTransition>
                  <ThemesPage />
                </PageTransition>
              }
            />

            {/* Legal Routes */}
            <Route
              path="/privacy"
              element={
                <PageTransition>
                  <PrivacyPage />
                </PageTransition>
              }
            />
            <Route
              path="/terms"
              element={
                <PageTransition>
                  <TermsPage />
                </PageTransition>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <DashboardPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <AccountPage />
                  </PageTransition>
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
}
