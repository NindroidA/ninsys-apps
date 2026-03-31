import { PageHeader } from "@/components/dashboard/PageHeader";
import { useServerEvents } from "@/hooks/useAdminEnhanced";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { Loader2, Server, Users } from "lucide-react";
import { useMemo, useState } from "react";

type EventFilter = "all" | "joined" | "left";

const FILTER_OPTIONS: { value: EventFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "joined", label: "Joined" },
	{ value: "left", label: "Left" },
];

function formatTimestamp(timestamp: string): string {
	const date = new Date(timestamp);
	return date.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function GuildAvatar({ name, icon }: { name: string; icon: string | null }) {
	if (icon) {
		return (
			<img src={icon} alt={name} className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
		);
	}

	const initials = name
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0] ?? "")
		.join("")
		.toUpperCase();

	return (
		<div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
			<span className="text-xs font-semibold text-primary">{initials || "?"}</span>
		</div>
	);
}

export function AdminServerEventsPage() {
	usePageTitle("Server Events \u2014 Admin");
	const { data: events, isLoading } = useServerEvents(50);
	const [filter, setFilter] = useState<EventFilter>("all");

	const filtered = useMemo(() => {
		if (!events) return [];
		if (filter === "all") return events;
		return events.filter((e) => e.action === filter);
	}, [events, filter]);

	return (
		<FadeIn>
			<PageHeader title="Server Events" description="Server join and leave history" />

			<div className="space-y-4 max-w-5xl">
				{/* Filter bar */}
				<div className="flex items-center gap-1 rounded-lg border border-border p-0.5 w-fit">
					{FILTER_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => setFilter(opt.value)}
							className={cn(
								"px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
								filter === opt.value
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							{opt.label}
						</button>
					))}
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					</div>
				) : filtered.length === 0 ? (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<Server className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
						<p className="text-muted-foreground">No server events recorded</p>
					</div>
				) : (
					<div className="space-y-2">
						{filtered.map((event, i) => (
							<Card key={`${event.guildId}-${event.createdAt}-${i}`} className="px-4 py-3">
								<div className="flex items-center gap-4">
									<GuildAvatar name={event.guildName} icon={event.guildIcon} />

									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium truncate">{event.guildName}</p>
										<div className="flex items-center gap-2 mt-0.5">
											<Users className="h-3 w-3 text-muted-foreground" />
											<span className="text-xs text-muted-foreground">
												{event.memberCount.toLocaleString()} member
												{event.memberCount !== 1 ? "s" : ""}
											</span>
										</div>
									</div>

									<Badge
										variant="outline"
										className={cn(
											"text-xs",
											event.action === "joined"
												? "text-green-400 border-green-500/30 bg-green-500/10"
												: "text-red-400 border-red-500/30 bg-red-500/10",
										)}
									>
										{event.action === "joined" ? "Joined" : "Left"}
									</Badge>

									<span className="text-xs text-muted-foreground w-32 text-right flex-shrink-0">
										{formatTimestamp(event.createdAt)}
									</span>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</FadeIn>
	);
}
