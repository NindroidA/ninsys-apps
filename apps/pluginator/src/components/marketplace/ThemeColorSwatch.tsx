/**
 * Theme Color Swatch Component
 *
 * Displays a theme's color palette organized by semantic groups.
 */

import type { SemanticColors } from "@/types/theme";
import { cn } from "@ninsys/ui/lib";

interface ThemeColorSwatchProps {
	colors: SemanticColors;
	compact?: boolean;
	className?: string;
}

interface ColorGroup {
	name: string;
	colors: { name: string; value: string }[];
}

export function ThemeColorSwatch({
	colors,
	compact = false,
	className,
}: ThemeColorSwatchProps) {
	const groups: ColorGroup[] = [
		{
			name: "Background",
			colors: [
				{ name: "Primary", value: colors.bg.primary },
				{ name: "Secondary", value: colors.bg.secondary },
				{ name: "Tertiary", value: colors.bg.tertiary },
				{ name: "Elevated", value: colors.bg.elevated },
			],
		},
		{
			name: "Foreground",
			colors: [
				{ name: "Primary", value: colors.fg.primary },
				{ name: "Secondary", value: colors.fg.secondary },
				{ name: "Tertiary", value: colors.fg.tertiary },
			],
		},
		{
			name: "Accent",
			colors: [
				{ name: "Primary", value: colors.accent.primary },
				{ name: "Secondary", value: colors.accent.secondary },
				{ name: "Muted", value: colors.accent.muted },
			],
		},
		{
			name: "Status",
			colors: [
				{ name: "Success", value: colors.status.success },
				{ name: "Warning", value: colors.status.warning },
				{ name: "Error", value: colors.status.error },
				{ name: "Info", value: colors.status.info },
			],
		},
		{
			name: "Border",
			colors: [
				{ name: "Default", value: colors.border.default },
				{ name: "Subtle", value: colors.border.subtle },
				{ name: "Strong", value: colors.border.strong },
			],
		},
	];

	if (compact) {
		// Compact view: show key colors in a grid for sidebar
		const keyColors = [
			{ name: "Background", value: colors.bg.primary },
			{ name: "Surface", value: colors.bg.secondary },
			{ name: "Accent", value: colors.accent.primary },
			{ name: "Accent 2", value: colors.accent.secondary },
			{ name: "Text", value: colors.fg.primary },
			{ name: "Muted", value: colors.fg.secondary },
			{ name: "Success", value: colors.status.success },
			{ name: "Warning", value: colors.status.warning },
			{ name: "Error", value: colors.status.error },
		];

		return (
			<div className={cn("grid grid-cols-3 gap-2", className)}>
				{keyColors.map((color) => (
					<div key={color.name} className="flex flex-col items-center gap-1">
						<div
							className="w-full h-6 rounded-md border border-border/50"
							style={{ backgroundColor: color.value }}
							title={`${color.name}: ${color.value}`}
						/>
						<span className="text-[10px] text-muted-foreground truncate w-full text-center">
							{color.name}
						</span>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={cn("space-y-4", className)}>
			{groups.map((group) => (
				<div key={group.name}>
					<h4 className="text-sm font-medium text-muted-foreground mb-2">
						{group.name}
					</h4>
					<div className="flex flex-wrap gap-2">
						{group.colors.map((color) => (
							<div key={color.name} className="flex flex-col items-center gap-1">
								<div
									className="w-10 h-10 rounded-lg border border-border/50 shadow-sm"
									style={{ backgroundColor: color.value }}
									title={`${color.name}: ${color.value}`}
								/>
								<span className="text-[10px] text-muted-foreground">
									{color.name}
								</span>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}

/**
 * Mini color strip for card displays
 */
export function ThemeColorStrip({
	colors,
	className,
}: {
	colors: SemanticColors;
	className?: string;
}) {
	const stripColors = [
		colors.bg.primary,
		colors.bg.secondary,
		colors.accent.primary,
		colors.status.success,
		colors.status.warning,
		colors.status.error,
	];

	return (
		<div className={cn("flex h-1.5 rounded-full overflow-hidden", className)}>
			{stripColors.map((color, idx) => (
				<div
					key={idx}
					className="flex-1"
					style={{ backgroundColor: color }}
				/>
			))}
		</div>
	);
}
