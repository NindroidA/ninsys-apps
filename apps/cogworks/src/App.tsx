import { Layout } from "@/components/layout";
import { CommandsPage } from "@/pages/CommandsPage";
import { FeaturesPage } from "@/pages/FeaturesPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { StatusPage } from "@/pages/StatusPage";
import { PageTransition } from "@ninsys/ui/components/animations";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";

export default function App() {
	const location = useLocation();

	return (
		<Layout>
			<AnimatePresence mode="wait">
				<Routes location={location} key={location.pathname}>
					<Route
						path="/"
						element={
							<PageTransition>
								<HomePage />
							</PageTransition>
						}
					/>
					<Route
						path="/features"
						element={
							<PageTransition>
								<FeaturesPage />
							</PageTransition>
						}
					/>
					<Route
						path="/commands"
						element={
							<PageTransition>
								<CommandsPage />
							</PageTransition>
						}
					/>
					<Route
						path="/status"
						element={
							<PageTransition>
								<StatusPage />
							</PageTransition>
						}
					/>
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
