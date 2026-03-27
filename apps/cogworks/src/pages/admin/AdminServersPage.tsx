import { PageHeader } from "@/components/dashboard/PageHeader";
import { useAdminServers } from "@/hooks/useAdmin";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getGuildIconUrl } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { Badge, Card, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Search, Server } from "lucide-react";
import { useMemo, useState } from "react";

export function AdminServersPage() {
	usePageTitle("Servers — Admin");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);

	const { data, isLoading } = useAdminServers(page, 25, search);
	const servers = data?.servers ?? [];

	const sortedServers = useMemo(
		() => [...servers].sort((a, b) => b.memberCount - a.memberCount),
		[servers],
	);

	return (
		<FadeIn>
			<PageHeader
				title="Server Management"
				description="View and manage all servers the bot is in"
			/>

			<div className="space-y-4 max-w-5xl">
				{/* Search */}
				<div className="relative max-w-sm">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1);
						}}
						placeholder="Search servers..."
						className="pl-9"
					/>
				</div>

				{/* Server list */}
				{isLoading ? (
					<div className="space-y-3 animate-pulse">
						{[0, 1, 2, 3, 4].map((i) => (
							<div key={`skel-${i}`} className="h-16 rounded-lg bg-muted" />
						))}
					</div>
				) : sortedServers.length === 0 ? (
					<div className="text-center py-12 border border-dashed border-border rounded-lg">
						<Server className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
						<p className="text-muted-foreground">
							{search ? "No servers match your search" : "No servers found"}
						</p>
					</div>
				) : (
					<div className="space-y-2">
						{sortedServers.map((server) => {
							const icon = server.icon ? getGuildIconUrl(server.id, server.icon, 48) : null;
							return (
								<Card key={server.id} className="px-4 py-3">
									<div className="flex items-center gap-3">
										{icon ? (
											<img
												src={icon}
												alt={server.name}
												className="h-10 w-10 rounded-full flex-shrink-0"
											/>
										) : (
											<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
												{getInitials(server.name)}
											</div>
										)}
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium truncate">{server.name}</p>
											<p className="text-xs text-muted-foreground">
												{server.memberCount.toLocaleString()} members
												{server.joinedAt && (
													<> · Joined {new Date(server.joinedAt).toLocaleDateString()}</>
												)}
											</p>
										</div>
										<div className="flex items-center gap-1.5 flex-wrap justify-end">
											{server.configuredSystems.length > 0 ? (
												[...new Set(server.configuredSystems)].map((sys) => (
													<Badge key={sys} variant="outline" className="text-[10px]">
														{sys}
													</Badge>
												))
											) : (
												<span className="text-xs text-muted-foreground">No systems</span>
											)}
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				)}
			</div>
		</FadeIn>
	);
}
