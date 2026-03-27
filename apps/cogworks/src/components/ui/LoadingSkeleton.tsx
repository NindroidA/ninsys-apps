import { cn } from "@ninsys/ui/lib";

interface LoadingSkeletonProps {
	className?: string;
}

export function Skeleton({ className }: LoadingSkeletonProps) {
	return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

export function SkeletonCard({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-xl border border-border p-6 space-y-4", className)}>
			<Skeleton className="h-5 w-1/3" />
			<Skeleton className="h-4 w-2/3" />
			<div className="space-y-2">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);
}

export function SkeletonConfigTab({ sections = 2 }: { sections?: number }) {
	return (
		<div className="space-y-6 animate-pulse">
			{Array.from({ length: sections }).map((_, i) => (
				<div
					key={`skel-cfg-${i}`}
					className="rounded-xl border border-border bg-card overflow-hidden"
				>
					<div className="px-6 py-4 border-b border-border">
						<div className="h-5 w-40 rounded bg-muted" />
					</div>
					<div className="p-6 space-y-4">
						<div className="h-10 rounded-lg bg-muted" />
						<div className="h-10 rounded-lg bg-muted" />
					</div>
				</div>
			))}
		</div>
	);
}
