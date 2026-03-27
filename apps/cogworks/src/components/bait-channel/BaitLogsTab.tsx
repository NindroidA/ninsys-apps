import { type Column, DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import { useBaitChannelLogs, useOverrideBaitLog } from "@/hooks/useBaitChannel";
import type { BaitChannelLog } from "@/types/bait-channel";
import { Badge, Button } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, ShieldOff, X } from "lucide-react";
import { useMemo, useState } from "react";

interface BaitLogsTabProps {
	guildId: string;
}

const ACTION_COLORS: Record<string, string> = {
	ban: "bg-red-500/10 text-red-500",
	kick: "bg-orange-500/10 text-orange-500",
	mute: "bg-yellow-500/10 text-yellow-600",
	warn: "bg-blue-500/10 text-blue-500",
};

function scoreColor(score: number): string {
	if (score < 30) return "text-green-500";
	if (score < 70) return "text-yellow-500";
	return "text-red-500";
}

export function BaitLogsTab({ guildId }: BaitLogsTabProps) {
	const [page, setPage] = useState(1);
	const [actionFilter, setActionFilter] = useState("");
	const [selectedLog, setSelectedLog] = useState<BaitChannelLog | null>(null);

	const { data, isLoading } = useBaitChannelLogs(guildId, {
		page,
		action: actionFilter || undefined,
	});
	const overrideLog = useOverrideBaitLog(guildId);

	const columns = useMemo<Column<BaitChannelLog>[]>(
		() => [
			{
				key: "createdAt",
				header: "Time",
				render: (row) => (
					<span className="text-sm text-muted-foreground">
						{new Date(row.createdAt).toLocaleDateString()}
					</span>
				),
			},
			{
				key: "username",
				header: "User",
				render: (row) => <span className="text-sm font-medium">{row.username}</span>,
			},
			{
				key: "suspicionScore",
				header: "Score",
				render: (row) => (
					<span className={`text-sm font-semibold ${scoreColor(row.suspicionScore)}`}>
						{row.suspicionScore}
					</span>
				),
			},
			{
				key: "action",
				header: "Action",
				render: (row) => (
					<Badge
						variant="outline"
						className={`text-xs capitalize ${ACTION_COLORS[row.action] ?? ""}`}
					>
						{row.action}
					</Badge>
				),
			},
			{
				key: "flags",
				header: "Flags",
				render: (row) => (
					<span className="text-xs text-muted-foreground">
						{row.flagsDetected?.length ?? 0} flag
						{(row.flagsDetected?.length ?? 0) !== 1 ? "s" : ""}
					</span>
				),
			},
			{
				key: "override",
				header: "",
				render: (row) => {
					if (row.overridden) {
						return (
							<span
								className="text-xs text-muted-foreground"
								title={`Overridden by ${row.overriddenBy ?? "unknown"} on ${
									row.overriddenAt ? new Date(row.overriddenAt).toLocaleDateString() : "unknown"
								}`}
							>
								Overridden
							</span>
						);
					}
					return (
						<Button
							variant="ghost"
							className="h-7 px-2 text-xs"
							onClick={(e) => {
								e.stopPropagation();
								overrideLog.mutate(row.userId);
							}}
							disabled={overrideLog.isPending}
						>
							<ShieldOff className="h-3 w-3 mr-1" />
							Override
						</Button>
					);
				},
			},
		],
		[overrideLog],
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<Select
					value={actionFilter}
					onChange={(v) => {
						setActionFilter(v);
						setPage(1);
					}}
					options={[
						{ value: "", label: "All Actions" },
						{ value: "ban", label: "Ban" },
						{ value: "kick", label: "Kick" },
						{ value: "mute", label: "Mute" },
						{ value: "warn", label: "Warn" },
					]}
					aria-label="Filter by action"
				/>
			</div>

			<DataTable
				data={data?.data ?? []}
				columns={columns}
				isLoading={isLoading}
				getRowKey={(row) => row.id}
				pagination={data?.pagination}
				onPageChange={setPage}
				emptyState={{
					title: "No detection logs",
					description: "Detection events will appear here.",
					icon: FileText,
				}}
				rowActions={(row) => [
					{
						label: "View Details",
						icon: FileText,
						onClick: () => setSelectedLog(row),
					},
				]}
			/>

			{/* Detail Panel */}
			<AnimatePresence>
				{selectedLog && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						className="rounded-lg border border-border bg-card overflow-hidden"
					>
						<div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
							<h4 className="text-sm font-medium">Detection Details — {selectedLog.username}</h4>
							<button
								type="button"
								onClick={() => setSelectedLog(null)}
								className="p-1 rounded hover:bg-muted"
								aria-label="Close details"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<div className="p-4 space-y-3 text-sm">
							<div>
								<p className="text-xs text-muted-foreground mb-1">Flags Detected</p>
								<div className="flex flex-wrap gap-1">
									{(selectedLog.flagsDetected?.length ?? 0) > 0 ? (
										(selectedLog.flagsDetected ?? []).map((flag) => (
											<Badge key={flag} variant="outline" className="text-xs">
												{flag}
											</Badge>
										))
									) : (
										<span className="text-muted-foreground">No flags recorded</span>
									)}
								</div>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
								<div>
									<p className="text-xs text-muted-foreground">User ID</p>
									<p className="font-mono text-xs mt-0.5">{selectedLog.userId}</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Score</p>
									<p className={`font-medium mt-0.5 ${scoreColor(selectedLog.suspicionScore)}`}>
										{selectedLog.suspicionScore}
									</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Action</p>
									<p className="capitalize mt-0.5">{selectedLog.action}</p>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Time</p>
									<p className="mt-0.5">{new Date(selectedLog.createdAt).toLocaleString()}</p>
								</div>
							</div>
							{selectedLog.overridden && (
								<div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
									Overridden by {selectedLog.overriddenBy ?? "unknown"} on{" "}
									{selectedLog.overriddenAt
										? new Date(selectedLog.overriddenAt).toLocaleString()
										: "unknown"}
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
