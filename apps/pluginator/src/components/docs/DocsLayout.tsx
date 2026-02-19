import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, ExternalLink, RefreshCw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface DocsLayoutProps {
	children: React.ReactNode;
	title: string;
	description?: string;
	isLoading?: boolean;
	error?: Error | null;
	onRefresh?: () => void;
	githubPath?: string;
}

const docsNavigation = [
	{ name: "CLI Commands", href: "/docs/cli" },
	{ name: "Configuration", href: "/docs/config" },
	{ name: "User Files", href: "/docs/user-files" },
	{ name: "Themes", href: "/docs/themes" },
	{ name: "User Guide", href: "/docs/user-guide" },
	{ name: "Security", href: "/docs/security" },
	{ name: "Troubleshooting", href: "/docs/troubleshooting" },
];

export function DocsLayout({
	children,
	title,
	description,
	isLoading,
	error,
	onRefresh,
	githubPath,
}: DocsLayoutProps) {
	const location = useLocation();

	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4">
				{/* Back link */}
				<FadeIn className="mb-6">
					<Link
						to="/docs"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Documentation
					</Link>
				</FadeIn>

				<div className="grid lg:grid-cols-[250px_1fr] gap-8">
					{/* Sidebar */}
					<FadeIn className="hidden lg:block">
						<nav className="sticky top-24">
							<h3 className="font-semibold mb-4 flex items-center gap-2">
								<BookOpen className="h-4 w-4" />
								Documentation
							</h3>
							<ul className="space-y-1">
								{docsNavigation.map((item) => (
									<li key={item.href}>
										<Link
											to={item.href}
											className={cn(
												"block px-3 py-2 rounded-lg text-sm transition-colors",
												location.pathname === item.href
													? "bg-primary/10 text-primary font-medium"
													: "text-muted-foreground hover:bg-muted hover:text-foreground",
											)}
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>

							{/* Additional links */}
							<div className="mt-8 pt-6 border-t border-border">
								<h4 className="text-sm font-medium mb-3 text-muted-foreground">More</h4>
								<ul className="space-y-1">
									<li>
										<Link
											to="/changelog"
											className="block px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
										>
											Changelog
										</Link>
									</li>
									<li>
										<a
											href="https://github.com/NindroidA/pluginator"
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
										>
											GitHub
											<ExternalLink className="h-3 w-3" />
										</a>
									</li>
								</ul>
							</div>
						</nav>
					</FadeIn>

					{/* Main content */}
					<main className="min-w-0">
						{/* Header */}
						<FadeIn className="mb-8">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
								<div>
									<h1 className="text-3xl font-bold mb-2">{title}</h1>
									{description && <p className="text-muted-foreground">{description}</p>}
								</div>
								<div className="flex items-center gap-2">
									{onRefresh && (
										<Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
											<RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
											Refresh
										</Button>
									)}
									{githubPath && (
										<Button variant="outline" size="sm" asChild>
											<a
												href={`https://github.com/NindroidA/pluginator/blob/main${githubPath}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<ExternalLink className="h-4 w-4 mr-2" />
												View on GitHub
											</a>
										</Button>
									)}
								</div>
							</div>
						</FadeIn>

						{/* Content */}
						{isLoading ? (
							<div className="flex items-center justify-center py-20">
								<motion.div
									animate={{ rotate: 360 }}
									transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
								>
									<RefreshCw className="h-8 w-8 text-primary" />
								</motion.div>
							</div>
						) : error ? (
							<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
								<h2 className="text-lg font-semibold mb-2">Failed to load documentation</h2>
								<p className="text-muted-foreground mb-4">{error.message}</p>
								{onRefresh && (
									<Button variant="outline" onClick={onRefresh}>
										<RefreshCw className="h-4 w-4 mr-2" />
										Try Again
									</Button>
								)}
							</div>
						) : (
							<FadeIn>
								<div className="prose prose-neutral dark:prose-invert max-w-none">{children}</div>
							</FadeIn>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
