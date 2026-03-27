import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

const ROUTE_LABELS: Record<string, string> = {
	config: "Bot Config",
	tickets: "Tickets",
	applications: "Applications",
	announcements: "Announcements",
	memory: "Memory",
	rules: "Rules",
	"reaction-roles": "Reaction Roles",
	"bait-channel": "Bait Channel",
	roles: "Role Management",
	status: "Bot Status",
	data: "Data Export",
};

export function Breadcrumbs() {
	const { guildId } = useParams<{ guildId: string }>();
	const { guild } = useCurrentGuild();
	const location = useLocation();

	if (!guildId) return null;

	const basePath = `/dashboard/${guildId}`;
	const relativePath = location.pathname.replace(basePath, "").replace(/^\//, "");
	const segment = relativePath.split("/")[0] || "";
	const label = ROUTE_LABELS[segment];

	return (
		<nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
			<Link to="/dashboard" className="hover:text-foreground transition-colors">
				<Home className="h-3.5 w-3.5" />
			</Link>
			<ChevronRight className="h-3 w-3" />
			<Link
				to={basePath}
				className="hover:text-foreground transition-colors truncate max-w-[200px]"
			>
				{guild?.name ?? "Server"}
			</Link>
			{label && (
				<>
					<ChevronRight className="h-3 w-3" />
					<span className="text-foreground font-medium">{label}</span>
				</>
			)}
		</nav>
	);
}
