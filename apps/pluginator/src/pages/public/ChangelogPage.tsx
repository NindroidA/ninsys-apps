import { MarkdownRenderer } from "@/components/docs";
import { DOC_PATHS, useGitHubMarkdown } from "@/hooks/useGitHubMarkdown";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, History, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

export function ChangelogPage() {
	const { content, isLoading, error, refetch } = useGitHubMarkdown("changelog");

	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4 max-w-4xl">
				{/* Back link */}
				<FadeIn className="mb-6">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Home
					</Link>
				</FadeIn>

				{/* Header */}
				<FadeIn className="mb-8">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
								<History className="h-4 w-4 text-primary" />
								<span className="text-sm font-medium text-primary">Changelog</span>
							</div>
							<h1 className="text-3xl font-bold mb-2">What's New</h1>
							<p className="text-muted-foreground">
								All notable changes to Pluginator documented here.
							</p>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isLoading}>
								<RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
								Refresh
							</Button>
							<Button variant="outline" size="sm" asChild>
								<a
									href={`https://github.com/NindroidA/pluginator/blob/main${DOC_PATHS.changelog}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<ExternalLink className="h-4 w-4 mr-2" />
									GitHub
								</a>
							</Button>
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
						<h2 className="text-lg font-semibold mb-2">Failed to load changelog</h2>
						<p className="text-muted-foreground mb-4">{error.message}</p>
						<Button variant="outline" onClick={() => refetch()}>
							<RefreshCw className="h-4 w-4 mr-2" />
							Try Again
						</Button>
					</div>
				) : (
					<FadeIn>
						<div className="rounded-xl border border-border bg-card p-6 sm:p-8">
							{content && <MarkdownRenderer content={content} />}
						</div>
					</FadeIn>
				)}
			</div>
		</div>
	);
}
