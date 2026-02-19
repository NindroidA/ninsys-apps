/**
 * Marketplace Landing Page
 *
 * Theme gallery and marketplace hub
 */

import { ThemeCard, ThemeCardSkeleton } from "@/components/marketplace";
import { useFeaturedThemes } from "@/hooks/useThemes";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { motion } from "framer-motion";
import { ArrowRight, Download, Moon, Palette, Sparkles, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export function MarketplacePage() {
	const { data: featuredThemes, isLoading: themesLoading } = useFeaturedThemes(9);

	// Count theme types
	const darkThemes = featuredThemes?.filter((t) => t.type === "dark").length || 0;
	const lightThemes = featuredThemes?.filter((t) => t.type === "light").length || 0;

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative overflow-hidden py-16 sm:py-24">
				{/* Background */}
				<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

				{/* Floating elements */}
				<motion.div
					animate={{ y: [-10, 10, -10] }}
					transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
					className="absolute top-20 left-[10%] w-3 h-3 rounded-full bg-primary/30"
				/>
				<motion.div
					animate={{ y: [8, -8, 8] }}
					transition={{
						duration: 5,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 1,
					}}
					className="absolute top-40 right-[15%] w-2 h-2 rounded-full bg-accent/40"
				/>

				<div className="container relative mx-auto px-4">
					<FadeIn className="text-center max-w-3xl mx-auto">
						{/* Badge */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6"
						>
							<Palette className="h-4 w-4" />
							Theme Marketplace
						</motion.div>

						{/* Title */}
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
						>
							Customize Your{" "}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
								CLI Experience
							</span>
						</motion.h1>

						{/* Subtitle */}
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3 }}
							className="text-lg text-muted-foreground mb-8"
						>
							Browse beautiful themes to personalize Pluginator. From dark mode classics to vibrant
							color schemes.
						</motion.p>

						{/* Quick links */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="flex items-center justify-center gap-4 mb-8"
						>
							<Link to="/marketplace/themes?type=dark">
								<Button variant="outline" size="sm">
									<Moon className="h-4 w-4 mr-2" />
									Dark Themes
								</Button>
							</Link>
							<Link to="/marketplace/themes?type=light">
								<Button variant="outline" size="sm">
									<Sun className="h-4 w-4 mr-2" />
									Light Themes
								</Button>
							</Link>
						</motion.div>

						{/* Stats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 md:gap-10 text-sm text-muted-foreground"
						>
							<div className="flex items-center gap-2">
								<Moon className="h-4 w-4 text-primary" />
								<span>
									<strong className="text-foreground">{darkThemes}+</strong> Dark Themes
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Sun className="h-4 w-4 text-primary" />
								<span>
									<strong className="text-foreground">{lightThemes}+</strong> Light Themes
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Sparkles className="h-4 w-4 text-primary" />
								<span>
									<strong className="text-foreground">Free</strong> & Premium
								</span>
							</div>
						</motion.div>
					</FadeIn>
				</div>
			</section>

			{/* Featured Themes */}
			<section className="container mx-auto px-4 py-12">
				<FadeIn delay={0.2}>
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-primary" />
							<h2 className="text-xl font-semibold">Featured Themes</h2>
						</div>
						<Link
							to="/marketplace/themes"
							className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
						>
							View all themes
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>

					{themesLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 9 }).map((_, i) => (
								<ThemeCardSkeleton key={i} />
							))}
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredThemes?.map((theme) => (
								<ThemeCard key={theme.id} theme={theme} />
							))}
						</div>
					)}
				</FadeIn>
			</section>

			{/* CTA */}
			<section className="container mx-auto px-4 py-16">
				<FadeIn delay={0.3}>
					<div className="text-center rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 p-8 sm:p-12">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to customize your CLI?</h2>
						<p className="text-muted-foreground mb-6 max-w-lg mx-auto">
							Download the Pluginator CLI to apply themes and manage your Minecraft server plugins
							from the terminal.
						</p>
						<a
							href="/download"
							className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
						>
							<Download className="h-5 w-5" />
							Download CLI
						</a>
					</div>
				</FadeIn>
			</section>
		</div>
	);
}
