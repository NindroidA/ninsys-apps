/**
 * Theme Preview Component
 *
 * Terminal mockup that renders fake CLI output using theme colors.
 * Shows exactly what the theme will look like in the CLI.
 */

import type { RegistryTheme } from "@/types/theme";
import { cn } from "@ninsys/ui/lib";

interface ThemePreviewProps {
	theme: RegistryTheme;
	size?: "sm" | "md" | "lg";
	className?: string;
}

export function ThemePreview({
	theme,
	size = "md",
	className,
}: ThemePreviewProps) {
	const { colors } = theme;

	// Size configurations
	const sizeConfig = {
		sm: {
			container: "w-[220px]",
			titleBar: "px-2 py-1",
			content: "px-2 py-2 text-[10px]",
			dot: "w-1.5 h-1.5",
			gap: "gap-1",
			lineHeight: "leading-4",
		},
		md: {
			container: "w-[360px]",
			titleBar: "px-3 py-1.5",
			content: "px-3 py-3 text-xs",
			dot: "w-2 h-2",
			gap: "gap-1.5",
			lineHeight: "leading-5",
		},
		lg: {
			container: "w-full max-w-[500px]",
			titleBar: "px-4 py-2",
			content: "px-4 py-4 text-sm",
			dot: "w-2.5 h-2.5",
			gap: "gap-2",
			lineHeight: "leading-6",
		},
	};

	const config = sizeConfig[size];

	return (
		<div
			className={cn(
				"rounded-lg overflow-hidden shadow-lg",
				config.container,
				className,
			)}
			style={{
				backgroundColor: colors.bg.primary,
				border: `1px solid ${colors.border.default}`,
			}}
		>
			{/* Title bar */}
			<div
				className={cn("flex items-center justify-between", config.titleBar)}
				style={{ backgroundColor: colors.bg.elevated }}
			>
				{/* Window controls */}
				<div className={cn("flex items-center", config.gap)}>
					<div
						className={cn("rounded-full", config.dot)}
						style={{ backgroundColor: colors.status.error }}
					/>
					<div
						className={cn("rounded-full", config.dot)}
						style={{ backgroundColor: colors.status.warning }}
					/>
					<div
						className={cn("rounded-full", config.dot)}
						style={{ backgroundColor: colors.status.success }}
					/>
				</div>
				{/* Title */}
				<span
					className="text-[10px] font-medium"
					style={{ color: colors.fg.secondary }}
				>
					Pluginator
				</span>
				{/* Spacer to balance */}
				<div className={cn("flex items-center", config.gap)}>
					<div className={cn("rounded-full opacity-0", config.dot)} />
					<div className={cn("rounded-full opacity-0", config.dot)} />
					<div className={cn("rounded-full opacity-0", config.dot)} />
				</div>
			</div>

			{/* Terminal content */}
			<div
				className={cn("font-mono", config.content, config.lineHeight)}
				style={{ backgroundColor: colors.bg.primary }}
			>
				{/* Command line */}
				<div className="flex items-center gap-1">
					<span style={{ color: colors.accent.primary }}>$</span>
					<span style={{ color: colors.fg.primary }}>pluginator check</span>
				</div>

				{/* Empty line */}
				<div className="h-2" />

				{/* Status message */}
				<div style={{ color: colors.fg.secondary }}>
					<span style={{ color: colors.status.success }}>✓</span> Checking 5
					plugins...
				</div>

				{/* Empty line */}
				<div className="h-1" />

				{/* Plugin statuses */}
				<div className="space-y-0.5">
					{/* Success */}
					<div className="flex items-center gap-2">
						<span style={{ color: colors.status.success }}>✓</span>
						<span style={{ color: colors.fg.primary }}>EssentialsX</span>
						<span style={{ color: colors.fg.tertiary }}>Up to date (2.20.1)</span>
					</div>

					{/* Warning */}
					<div className="flex items-center gap-2">
						<span style={{ color: colors.status.warning }}>⚠</span>
						<span style={{ color: colors.fg.primary }}>LuckPerms</span>
						<span style={{ color: colors.status.warning }}>Update available</span>
					</div>

					{/* Error */}
					<div className="flex items-center gap-2">
						<span style={{ color: colors.status.error }}>✗</span>
						<span style={{ color: colors.fg.primary }}>Vault</span>
						<span style={{ color: colors.status.error }}>Connection failed</span>
					</div>
				</div>

				{/* Empty line */}
				<div className="h-2" />

				{/* Progress bar */}
				<div className="flex items-center gap-2">
					<div
						className="flex-1 h-1.5 rounded-full overflow-hidden"
						style={{ backgroundColor: colors.bg.tertiary }}
					>
						<div
							className="h-full rounded-full"
							style={{
								width: "60%",
								backgroundColor: colors.accent.primary,
							}}
						/>
					</div>
					<span style={{ color: colors.fg.tertiary }}>60%</span>
				</div>
			</div>
		</div>
	);
}

/**
 * Skeleton loader for theme preview
 */
export function ThemePreviewSkeleton({
	size = "md",
	className,
}: {
	size?: "sm" | "md" | "lg";
	className?: string;
}) {
	const sizeConfig = {
		sm: "w-[220px] h-[140px]",
		md: "w-[360px] h-[200px]",
		lg: "w-full max-w-[500px] h-[240px]",
	};

	return (
		<div
			className={cn(
				"rounded-lg bg-muted animate-pulse",
				sizeConfig[size],
				className,
			)}
		/>
	);
}
