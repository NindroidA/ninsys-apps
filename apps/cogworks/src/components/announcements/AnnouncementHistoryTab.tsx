import { type Column, DataTable } from "@/components/ui/DataTable";
import { useAnnouncementHistory } from "@/hooks/useAnnouncements";
import type { AnnouncementLog } from "@/types/announcements";
import { Badge } from "@ninsys/ui/components";
import { Megaphone } from "lucide-react";
import { useMemo, useState } from "react";

interface AnnouncementHistoryTabProps {
	guildId: string;
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
	maintenance_short: {
		label: "Short Maintenance",
		color: "bg-amber-500/15 text-amber-500",
	},
	maintenance_long: {
		label: "Extended Maintenance",
		color: "bg-amber-500/15 text-amber-500",
	},
	update_scheduled: {
		label: "Scheduled Update",
		color: "bg-green-500/15 text-green-500",
	},
	update_complete: {
		label: "Update Complete",
		color: "bg-green-500/15 text-green-500",
	},
	back_online: {
		label: "Back Online",
		color: "bg-blue-500/15 text-blue-500",
	},
};

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function AnnouncementHistoryTab({ guildId }: AnnouncementHistoryTabProps) {
	const [page, setPage] = useState(1);
	const { data, isLoading } = useAnnouncementHistory(guildId, {
		page,
		limit: 20,
	});

	const columns = useMemo<Column<AnnouncementLog>[]>(
		() => [
			{
				key: "type",
				header: "Type",
				render: (row) => {
					const info = TYPE_LABELS[row.type] ?? {
						label: row.type,
						color: "bg-muted text-muted-foreground",
					};
					return (
						<Badge variant="outline" className={info.color}>
							{info.label}
						</Badge>
					);
				},
			},
			{
				key: "sentByUsername",
				header: "Sent By",
				render: (row) => <span className="text-sm font-medium">{row.sentByUsername}</span>,
			},
			{
				key: "createdAt",
				header: "Date",
				render: (row) => (
					<span className="text-sm text-muted-foreground">{formatDate(row.createdAt)}</span>
				),
			},
		],
		[],
	);

	return (
		<DataTable
			data={data?.data ?? []}
			columns={columns}
			isLoading={isLoading}
			getRowKey={(row) => row.id}
			pagination={data?.pagination}
			onPageChange={setPage}
			emptyState={{
				title: "No announcements sent yet",
				description: "Sent announcements will appear here",
				icon: Megaphone,
			}}
		/>
	);
}
