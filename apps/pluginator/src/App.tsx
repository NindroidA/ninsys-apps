/**
 * Pluginator - Coming Soon Mode
 *
 * This file replaces App.tsx on the production branch.
 * Removes auth routes and protected routes.
 */

import { Layout } from "@/components/layout";
import { NotFoundPage } from "@/pages/NotFoundPage";
import {
	CLICommandsPage,
	ConfigPage,
	DocsIndexPage,
	SecurityPage,
	TroubleshootingPage,
	UserGuidePage,
} from "@/pages/docs";
import { PrivacyPage, TermsPage } from "@/pages/legal";
import {
	ChangelogPage,
	ContactPage,
	DownloadPage,
	HomePage,
	PricingPage,
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

					{/* 404 - Catch all including auth routes */}
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
