import { ProtectedRoute } from "@/components/auth";
import { Layout } from "@/components/layout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AccountPage } from "@/pages/account";
import { AuthCallbackPage, AuthErrorPage } from "@/pages/auth";
import { DashboardPage } from "@/pages/dashboard";
import {
	CLICommandsPage,
	ConfigPage,
	DocsIndexPage,
	SecurityPage,
	TroubleshootingPage,
	UserGuidePage,
} from "@/pages/docs";
import { PrivacyPage, TermsPage } from "@/pages/legal";
import { CheckoutPage, PaymentCancelPage, PaymentSuccessPage } from "@/pages/payment";
import {
	ChangelogPage,
	ContactPage,
	DownloadPage,
	HomePage,
	LoginPage,
	PricingPage,
	SignupPage,
} from "@/pages/public";
import { PageTransition } from "@ninsys/ui/components/animations";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";

export default function App() {
	const location = useLocation();

	return (
		<Layout>
			<AnimatePresence mode="wait">
				<Routes location={location} key={location.pathname}>
					{/* Public Routes */}
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
		</Layout>
	);
}
