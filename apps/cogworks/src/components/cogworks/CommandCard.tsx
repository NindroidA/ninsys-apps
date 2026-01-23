import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Copy } from "lucide-react";
import { useState } from "react";

interface Subcommand {
	name: string;
	description: string;
	usage: string;
}

interface CommandCardProps {
	name: string;
	description: string;
	usage: string;
	permissions?: string[];
	examples?: string[];
	category?: string;
	subcommands?: Subcommand[];
	className?: string;
}

export function CommandCard({
	name,
	description,
	usage,
	permissions = [],
	examples = [],
	category,
	subcommands = [],
	className,
}: CommandCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [copied, setCopied] = useState(false);

	const copyCommand = async () => {
		await navigator.clipboard.writeText(`/${name}`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-card overflow-hidden transition-all",
				isExpanded && "ring-1 ring-primary/50",
				className,
			)}
		>
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors"
			>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<code className="text-primary font-mono font-semibold">/{name}</code>
						{category && (
							<span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
								{category}
							</span>
						)}
					</div>
					<p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
				</div>
				<ChevronDown
					className={cn(
						"h-5 w-5 text-muted-foreground shrink-0 transition-transform",
						isExpanded && "rotate-180",
					)}
				/>
			</button>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
							{/* Usage */}
							<div>
								<h4 className="text-sm font-medium mb-2">Usage</h4>
								<div className="flex items-center gap-2">
									<code className="flex-1 text-sm bg-muted/50 px-3 py-2 rounded-lg font-mono">
										{usage}
									</code>
									<button
										type="button"
										onClick={copyCommand}
										className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
										aria-label="Copy command"
									>
										{copied ? (
											<Check className="h-4 w-4 text-success" />
										) : (
											<Copy className="h-4 w-4 text-muted-foreground" />
										)}
									</button>
								</div>
							</div>

							{/* Subcommands */}
							{subcommands.length > 0 && (
								<div>
									<h4 className="text-sm font-medium mb-2">Subcommands</h4>
									<div className="space-y-2">
										{subcommands.map((sub) => (
											<div
												key={sub.name}
												className="bg-muted/30 rounded-lg p-3 border border-border/50"
											>
												<div className="flex items-center gap-2 mb-1">
													<code className="text-sm text-primary font-mono font-medium">
														{sub.usage}
													</code>
												</div>
												<p className="text-xs text-muted-foreground">{sub.description}</p>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Permissions */}
							{permissions.length > 0 && (
								<div>
									<h4 className="text-sm font-medium mb-2">Required Permissions</h4>
									<div className="flex flex-wrap gap-2">
										{permissions.map((perm) => (
											<span
												key={perm}
												className="text-xs px-2 py-1 rounded-md bg-warning/10 text-warning font-medium"
											>
												{perm}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Examples */}
							{examples.length > 0 && (
								<div>
									<h4 className="text-sm font-medium mb-2">Examples</h4>
									<div className="space-y-2">
										{examples.map((example) => (
											<code
												key={example}
												className="block text-sm bg-muted/50 px-3 py-2 rounded-lg font-mono text-muted-foreground"
											>
												{example}
											</code>
										))}
									</div>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
