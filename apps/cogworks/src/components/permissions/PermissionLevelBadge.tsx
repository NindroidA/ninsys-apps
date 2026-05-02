import { PERMISSION_LEVEL_LABELS, type PermissionLevel } from "@/types/permissions";
import { cn } from "@ninsys/ui/lib";

interface PermissionLevelBadgeProps {
	level: PermissionLevel;
	size?: "sm" | "md";
	className?: string;
}

const LEVEL_CLASSES: Record<PermissionLevel, string> = {
	admin: "bg-green-500/15 text-green-500 border-green-500/30",
	manage: "bg-primary/15 text-primary border-primary/30",
	use: "bg-muted text-muted-foreground border-border",
};

export function PermissionLevelBadge({ level, size = "md", className }: PermissionLevelBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full border font-medium capitalize",
				LEVEL_CLASSES[level],
				size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs",
				className,
			)}
		>
			{PERMISSION_LEVEL_LABELS[level]}
		</span>
	);
}
