import { Card } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { motion } from "framer-motion";
import { BookOpen, History, Scale, Shield, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const docsSections = [
	{
		title: "Admin Guide",
		description: "Complete setup guide for server administrators using Cogworks",
		href: "/docs/admin-guide",
		icon: BookOpen,
	},
	{
		title: "Commands",
		description: "Full reference for all bot commands with usage and examples",
		href: "/docs/commands",
		icon: Terminal,
	},
	{
		title: "Changelog",
		description: "See what's new in each release of Cogworks",
		href: "/docs/changelog",
		icon: History,
	},
];

const legalDocs = [
	{
		title: "Privacy Policy",
		description: "How we collect, use, and protect your data",
		href: "/docs/privacy",
		icon: Shield,
	},
	{
		title: "Terms of Service",
		description: "Terms and conditions for using Cogworks",
		href: "/docs/terms",
		icon: Scale,
	},
];

export function DocsIndexPage() {
	return (
		<div className="min-h-screen py-20">
			<div className="container mx-auto px-4">
				{/* Header */}
				<FadeIn className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
						<BookOpen className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">Documentation</span>
					</div>
					<h1 className="text-4xl sm:text-5xl font-bold mb-4">Cogworks Docs</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Everything you need to set up, configure, and manage Cogworks in your Discord server.
					</p>
				</FadeIn>

				{/* Main docs grid */}
				<StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					{docsSections.map((section) => {
						const Icon = section.icon;
						return (
							<motion.div
								key={section.href}
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { opacity: 1, y: 0 },
								}}
							>
								<Link to={section.href} className="block h-full">
									<Card className="h-full p-6 hover:border-primary/50 hover:shadow-lg transition-all group">
										<div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
											<Icon className="h-6 w-6 text-primary" />
										</div>
										<h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
											{section.title}
										</h3>
										<p className="text-sm text-muted-foreground">{section.description}</p>
									</Card>
								</Link>
							</motion.div>
						);
					})}
				</StaggerContainer>

				{/* Legal section */}
				<FadeIn className="max-w-2xl mx-auto">
					<h2 className="text-xl font-semibold mb-4 text-center">Legal</h2>
					<div className="grid sm:grid-cols-2 gap-4">
						{legalDocs.map((doc) => {
							const Icon = doc.icon;
							return (
								<Link
									key={doc.href}
									to={doc.href}
									className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
								>
									<div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
										<Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
									</div>
									<div>
										<h3 className="font-medium group-hover:text-primary transition-colors">
											{doc.title}
										</h3>
										<p className="text-sm text-muted-foreground">{doc.description}</p>
									</div>
								</Link>
							);
						})}
					</div>
				</FadeIn>

				{/* Help CTA */}
				<FadeIn className="text-center mt-16">
					<p className="text-muted-foreground mb-4">Can't find what you're looking for?</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a
							href="https://discord.gg/nkwMUaVSYH"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							Join our Discord
						</a>
						<span className="text-border">|</span>
						<a
							href="https://github.com/NindroidA/cogworks-bot/issues"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary hover:underline"
						>
							Report an issue
						</a>
					</div>
				</FadeIn>
			</div>
		</div>
	);
}
