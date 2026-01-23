import { cn } from "@ninsys/ui/lib";

type BotStatus = "online" | "idle" | "dnd" | "offline";

interface BotStatusBadgeProps {
	status: BotStatus;
	showLabel?: boolean;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const statusConfig: Record<BotStatus, { label: string; color: string; pulse: boolean }> = {
	online: {
		label: "Online",
		color: "bg-success",
		pulse: true,
	},
	idle: {
		label: "Idle",
		color: "bg-warning",
		pulse: false,
	},
	dnd: {
		label: "Do Not Disturb",
		color: "bg-error",
		pulse: false,
	},
	offline: {
		label: "Offline",
		color: "bg-muted-foreground",
		pulse: false,
	},
};

const sizeClasses = {
	sm: "h-2 w-2",
	md: "h-3 w-3",
	lg: "h-4 w-4",
};

export function BotStatusBadge({
	status,
	showLabel = false,
	size = "md",
	className,
}: BotStatusBadgeProps) {
	const config = statusConfig[status];

	return (
		<div className={cn("inline-flex items-center gap-2", className)}>
			<span className="relative flex">
				<span
					className={cn(
						"rounded-full",
						sizeClasses[size],
						config.color,
						config.pulse && "animate-pulse",
					)}
				/>
				{config.pulse && (
					<span
						className={cn("absolute inset-0 rounded-full opacity-75", config.color, "animate-ping")}
					/>
				)}
			</span>
			{showLabel && (
				<span className="text-sm font-medium text-muted-foreground">{config.label}</span>
			)}
		</div>
	);
}
