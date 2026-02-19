/**
 * Plugin Detail Page
 *
 * Full details for a single plugin
 */

import { CategoryIcon, PluginSourceBadge } from "@/components/marketplace";
import { useRegistryPlugin } from "@/hooks/useRegistry";
import { CATEGORY_INFO } from "@/types/registry";
import { Badge, Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import {
	AlertTriangle,
	ArrowLeft,
	BadgeCheck,
	Copy,
	Crown,
	Download,
	ExternalLink,
	GitFork,
	Globe,
	Info,
	Package,
	Star,
	Terminal,
	Users,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export function PluginDetailPage() {
	const { id } = useParams<{ id: string }>();
	const { data: plugin, isLoading, error } = useRegistryPlugin(id || "");
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		if (plugin) {
			navigator.clipboard.writeText(`pluginator install ${plugin.id}`);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	if (isLoading) {
		return <PluginDetailSkeleton />;
	}

	if (error || !plugin) {
		return (
			<div className="min-h-screen py-16">
				<div className="container mx-auto px-4 text-center">
					<Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
					<h1 className="text-2xl font-bold mb-2">Plugin Not Found</h1>
					<p className="text-muted-foreground mb-6">
						The plugin you're looking for doesn't exist or has been removed.
					</p>
					<Link to="/plugins">
						<Button variant="outline">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Plugins
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const categoryInfo = CATEGORY_INFO[plugin.category];

	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4 max-w-6xl">
				{/* Back link */}
				<FadeIn>
					<Link
						to="/plugins"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Plugins
					</Link>
				</FadeIn>

				{/* Header */}
				<FadeIn delay={0.1}>
					<div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
						<div className="flex-1">
							{/* Name and badges */}
							<div className="flex items-center gap-3 flex-wrap mb-2">
								<h1 className="text-3xl sm:text-4xl font-bold">{plugin.name}</h1>
								{plugin.verified && (
									<Badge variant="primary" className="bg-primary">
										<BadgeCheck className="h-3 w-3 mr-1" />
										Verified
									</Badge>
								)}
								{plugin.premium && (
									<Badge
										variant="secondary"
										className="bg-amber-500/10 text-amber-500 border-amber-500/20"
									>
										<Crown className="h-3 w-3 mr-1" />
										Premium
									</Badge>
								)}
								{plugin.popular && <Badge variant="secondary">Popular</Badge>}
							</div>

							{/* Authors */}
							<div className="flex items-center gap-2 text-muted-foreground mb-4">
								<Users className="h-4 w-4" />
								<span>by {plugin.authors.join(", ")}</span>
							</div>

							{/* Category and tags */}
							<div className="flex items-center gap-2 flex-wrap">
								<Badge variant="outline" className="flex items-center gap-1.5">
									<CategoryIcon iconKey={categoryInfo.iconKey} className="h-3.5 w-3.5" />
									{categoryInfo.name}
								</Badge>
								{plugin.tags.slice(0, 5).map((tag) => (
									<Badge key={tag} variant="secondary" className="text-xs">
										{tag}
									</Badge>
								))}
							</div>
						</div>

						{/* Website link */}
						{plugin.website && (
							<a
								href={plugin.website}
								target="_blank"
								rel="noopener noreferrer"
								className="shrink-0"
							>
								<Button variant="outline" size="sm">
									<Globe className="h-4 w-4 mr-2" />
									Website
									<ExternalLink className="h-3 w-3 ml-2 opacity-50" />
								</Button>
							</a>
						)}
					</div>
				</FadeIn>

				{/* Main content grid - wider layout */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Left column - Main info (3 cols) */}
					<div className="lg:col-span-3 space-y-6">
						{/* Quick Install - Full width in main content */}
						<FadeIn delay={0.2}>
							<div className="rounded-xl bg-gradient-to-br from-violet-500/25 via-purple-500/25 to-fuchsia-500/25 backdrop-blur-sm border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
								<section className="rounded-xl p-6">
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
										<div>
											<h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
												<Terminal className="h-5 w-5 text-primary" />
												Quick Install
											</h2>
											<p className="text-sm text-muted-foreground">
												Install this plugin with the Pluginator CLI:
											</p>
										</div>

										<div className="flex items-center gap-3">
											<div className="flex-1 sm:flex-none bg-background rounded-lg px-4 py-3 font-mono text-sm flex items-center gap-3 min-w-0 overflow-x-auto">
												<code className="whitespace-nowrap">pluginator install {plugin.id}</code>
												<button
													type="button"
													onClick={handleCopy}
													className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors"
													title="Copy to clipboard"
												>
													{copied ? (
														<BadgeCheck className="h-4 w-4 text-green-500" />
													) : (
														<Copy className="h-4 w-4 text-muted-foreground" />
													)}
												</button>
											</div>
										</div>
									</div>
								</section>
							</div>
						</FadeIn>

						{/* Description */}
						<FadeIn delay={0.25}>
							<section className="rounded-xl border border-border bg-card p-6">
								<h2 className="text-lg font-semibold mb-3">About</h2>
								<p className="text-muted-foreground leading-relaxed">{plugin.description}</p>
							</section>
						</FadeIn>

						{/* Download Sources */}
						<FadeIn delay={0.3}>
							<section className="rounded-xl border border-border bg-card p-6">
								<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
									<Download className="h-5 w-5 text-primary" />
									Download Sources
								</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
									{plugin.sources.map((source, idx) => (
										<PluginSourceBadge
											key={`${source.type}-${idx}`}
											source={source}
											size="lg"
											asLink
										/>
									))}
								</div>
							</section>
						</FadeIn>

						{/* Dependencies */}
						{plugin.dependencies && plugin.dependencies.length > 0 && (
							<FadeIn delay={0.4}>
								<section className="rounded-xl border border-border bg-card p-6">
									<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
										<GitFork className="h-5 w-5 text-primary" />
										Required Plugins
									</h2>
									<div className="flex flex-wrap gap-2">
										{plugin.dependencies.map((dep) => (
											<Link
												key={dep}
												to={`/plugins/${dep}`}
												className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
											>
												<Package className="h-4 w-4 text-muted-foreground" />
												<span className="font-medium">{dep}</span>
											</Link>
										))}
									</div>
								</section>
							</FadeIn>
						)}

						{/* Conflicts */}
						{plugin.conflicts && plugin.conflicts.length > 0 && (
							<FadeIn delay={0.5}>
								<div className="rounded-xl bg-gradient-to-br from-red-500/25 via-rose-500/25 to-orange-500/25 backdrop-blur-sm border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
									<section className="rounded-xl p-6">
										<h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
											<AlertTriangle className="h-5 w-5" />
											Known Conflicts
										</h2>
										<p className="text-sm text-muted-foreground mb-3">
											This plugin may have compatibility issues with:
										</p>
										<div className="flex flex-wrap gap-2">
											{plugin.conflicts.map((conflict) => (
												<Link
													key={conflict}
													to={`/plugins/${conflict}`}
													className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-destructive/30 bg-background hover:bg-destructive/10 transition-colors"
												>
													<AlertTriangle className="h-4 w-4 text-destructive" />
													<span>{conflict}</span>
												</Link>
											))}
										</div>
									</section>
								</div>
							</FadeIn>
						)}

						{/* Notes */}
						{plugin.notes && (
							<FadeIn delay={0.6}>
								<div className="rounded-xl bg-gradient-to-br from-blue-400/25 via-blue-500/25 to-indigo-500/25 backdrop-blur-sm border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
									<section className="rounded-xl p-6">
										<h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-500">
											<Info className="h-5 w-5" />
											Notes
										</h2>
										<p className="text-muted-foreground">{plugin.notes}</p>
									</section>
								</div>
							</FadeIn>
						)}
					</div>

					{/* Right column - Sidebar (1 col) */}
					<div className="space-y-6">
						{/* Info card */}
						<FadeIn delay={0.3}>
							<section className="rounded-xl border border-border bg-card p-6">
								<h2 className="text-lg font-semibold mb-4">Plugin Info</h2>
								<dl className="space-y-3 text-sm">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Minecraft</dt>
										<dd className="font-medium text-right">
											{plugin.minecraftVersions.min} - {plugin.minecraftVersions.max}
										</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Category</dt>
										<dd className="font-medium">{categoryInfo.name}</dd>
									</div>
									{plugin.version && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Version</dt>
											<dd className="font-medium">{plugin.version}</dd>
										</div>
									)}
									{plugin.downloads && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Downloads</dt>
											<dd className="font-medium">{plugin.downloads.toLocaleString()}</dd>
										</div>
									)}
									{plugin.rating && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Rating</dt>
											<dd className="font-medium flex items-center gap-1">
												<Star className="h-3 w-3 text-amber-500 fill-amber-500" />
												{plugin.rating}/5
											</dd>
										</div>
									)}
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Sources</dt>
										<dd className="font-medium">{plugin.sources.length}</dd>
									</div>
								</dl>
							</section>
						</FadeIn>

						{/* Get CLI card */}
						<FadeIn delay={0.4}>
							<section className="rounded-xl border border-border bg-card p-6">
								<h2 className="text-lg font-semibold mb-3">Get the CLI</h2>
								<p className="text-sm text-muted-foreground mb-4">
									Download Pluginator to install and manage plugins easily.
								</p>
								<a href="/download" className="block">
									<Button variant="primary" className="w-full">
										<Download className="h-4 w-4 mr-2" />
										Download CLI
									</Button>
								</a>
							</section>
						</FadeIn>
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Loading skeleton for plugin detail
 */
function PluginDetailSkeleton() {
	return (
		<div className="min-h-screen py-8">
			<div className="container mx-auto px-4 max-w-6xl animate-pulse">
				{/* Back link */}
				<div className="h-4 w-32 bg-muted rounded mb-6" />

				{/* Header */}
				<div className="flex flex-col sm:flex-row gap-4 mb-8">
					<div className="flex-1">
						<div className="h-10 w-64 bg-muted rounded mb-2" />
						<div className="h-4 w-40 bg-muted rounded mb-4" />
						<div className="flex gap-2">
							<div className="h-6 w-24 bg-muted rounded" />
							<div className="h-6 w-16 bg-muted rounded" />
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					<div className="lg:col-span-3 space-y-6">
						<div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
							<div className="h-6 w-32 bg-muted rounded mb-4" />
							<div className="h-12 bg-muted rounded" />
						</div>
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="h-6 w-24 bg-muted rounded mb-4" />
							<div className="space-y-2">
								<div className="h-4 bg-muted rounded w-full" />
								<div className="h-4 bg-muted rounded w-3/4" />
							</div>
						</div>
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="h-6 w-40 bg-muted rounded mb-4" />
							<div className="grid grid-cols-2 gap-3">
								<div className="h-12 bg-muted rounded" />
								<div className="h-12 bg-muted rounded" />
							</div>
						</div>
					</div>
					<div className="space-y-6">
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="h-6 w-32 bg-muted rounded mb-4" />
							<div className="space-y-3">
								<div className="h-4 bg-muted rounded" />
								<div className="h-4 bg-muted rounded" />
								<div className="h-4 bg-muted rounded" />
							</div>
						</div>
						<div className="rounded-xl border border-border bg-card p-6">
							<div className="h-6 w-28 bg-muted rounded mb-4" />
							<div className="h-10 bg-muted rounded" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
