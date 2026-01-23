import { cn } from "@ninsys/ui/lib";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: LucideIcon;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	className?: string;
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg",
				className,
			)}
		>
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">{label}</p>
					<p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
					{trend && (
						<p
							className={cn(
								"mt-2 text-sm font-medium",
								trend.isPositive ? "text-success" : "text-error",
							)}
						>
							{trend.isPositive ? "+" : ""}
							{trend.value}% from last month
						</p>
					)}
				</div>
				<div className="rounded-lg bg-primary/10 p-3">
					<Icon className="h-6 w-6 text-primary" />
				</div>
			</div>
		</div>
	);
}
