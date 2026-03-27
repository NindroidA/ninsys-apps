import { PageHeader } from "@/components/dashboard/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { usePageTitle } from "@/hooks/usePageTitle";
import { FadeIn } from "@ninsys/ui/components/animations";
import { List, Settings, ShieldBan, Ticket } from "lucide-react";
import { Suspense, lazy, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const TicketConfigTab = lazy(() =>
	import("@/components/tickets/TicketConfigTab").then((m) => ({
		default: m.TicketConfigTab,
	})),
);
const TicketTypesTab = lazy(() =>
	import("@/components/tickets/TicketTypesTab").then((m) => ({
		default: m.TicketTypesTab,
	})),
);
const TicketRestrictionsTab = lazy(() =>
	import("@/components/tickets/TicketRestrictionsTab").then((m) => ({
		default: m.TicketRestrictionsTab,
	})),
);
const TicketActiveTab = lazy(() =>
	import("@/components/tickets/TicketActiveTab").then((m) => ({
		default: m.TicketActiveTab,
	})),
);

const TABS = [
	{ id: "config", label: "Config", icon: Settings },
	{ id: "types", label: "Types", icon: List },
	{ id: "restrictions", label: "Restrictions", icon: ShieldBan },
	{ id: "active", label: "Active", icon: Ticket },
];

function TabFallback() {
	return (
		<div className="py-8 flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

export function TicketsPage() {
	const { guildId } = useCurrentGuild();
	usePageTitle("Tickets");

	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") ?? "config";

	const handleTabChange = useCallback(
		(tab: string) => {
			setSearchParams({ tab }, { replace: true });
		},
		[setSearchParams],
	);

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader title="Ticket System" description="Manage support tickets for your server" />

			<div className="space-y-6">
				<Tabs tabs={TABS} activeTab={activeTab} onChange={handleTabChange} />

				<Suspense fallback={<TabFallback />}>
					{activeTab === "config" && <TicketConfigTab guildId={guildId} />}
					{activeTab === "types" && <TicketTypesTab guildId={guildId} />}
					{activeTab === "restrictions" && <TicketRestrictionsTab guildId={guildId} />}
					{activeTab === "active" && <TicketActiveTab guildId={guildId} />}
				</Suspense>
			</div>
		</FadeIn>
	);
}
