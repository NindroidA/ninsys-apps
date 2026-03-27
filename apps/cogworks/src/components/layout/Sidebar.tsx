import { useAuth } from "@/hooks/useAuth";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { getGuildIconUrl } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@ninsys/ui/lib";
import {
	BarChart3,
	BookOpen,
	Brain,
	CalendarDays,
	ChevronLeft,
	Download,
	FileText,
	LayoutDashboard,
	Megaphone,
	Route,
	Settings,
	Shield,
	ShieldAlert,
	SlidersHorizontal,
	Smile,
	Sparkles,
	Star,
	Target,
	Ticket,
	UserPlus,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link, NavLink, useParams } from "react-router-dom";

interface NavItem {
	to: string;
	label: string;
	icon: ComponentType<{ className?: string }>;
	ownerOnly?: boolean;
	end?: boolean;
}

interface SectionItem {
	section: string;
}

type SidebarItem = NavItem | SectionItem;

function isSection(item: SidebarItem): item is SectionItem {
	return "section" in item;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
	{ to: "", label: "Overview", icon: LayoutDashboard, end: true },
	{ to: "systems", label: "System Settings", icon: SlidersHorizontal },
	{ section: "Configuration" },
	{ to: "config", label: "Bot Config", icon: Settings },
	{ to: "roles", label: "Role Management", icon: Shield },
	{ to: "onboarding", label: "Onboarding", icon: UserPlus },
	{ section: "Systems" },
	{ to: "tickets", label: "Tickets", icon: Ticket },
	{ to: "sla", label: "Ticket SLA", icon: Target },
	{ to: "routing", label: "Smart Routing", icon: Route },
	{ to: "applications", label: "Applications", icon: FileText },
	{ to: "app-workflow", label: "Application Workflow", icon: Sparkles },
	{ to: "announcements", label: "Announcements", icon: Megaphone },
	{ to: "memory", label: "Memory", icon: Brain },
	{ to: "rules", label: "Rules", icon: BookOpen },
	{ to: "reaction-roles", label: "Reaction Roles", icon: Smile },
	{ to: "xp", label: "XP & Levels", icon: Star },
	{ to: "starboard", label: "Starboard", icon: Star },
	{ to: "events", label: "Events", icon: CalendarDays },
	{ section: "Moderation" },
	{ to: "bait-channel", label: "Bait Channel", icon: ShieldAlert },
	{ section: "Analytics" },
	{ to: "server-analytics", label: "Server Stats", icon: BarChart3 },
	{ section: "Data" },
	{ to: "data", label: "Data Export", icon: Download },
];

export function Sidebar() {
	const { guildId } = useParams<{ guildId: string }>();
	const { guild } = useCurrentGuild();
	const { isOwner } = useAuth();
	const { isCollapsed, setCollapsed } = useSidebarStore();

	const guildIcon = guild ? getGuildIconUrl(guild.id, guild.icon, 64) : null;
	const basePath = `/dashboard/${guildId ?? ""}`;

	return (
		<aside
			className={cn(
				"relative flex flex-col border-r border-border bg-card/80 backdrop-blur-xl h-screen sticky top-0 transition-[width] duration-200",
				isCollapsed ? "w-16" : "w-60",
			)}
		>
			{/* Collapse tab — edge handle (desktop only) */}
			<button
				type="button"
				onClick={() => setCollapsed(!isCollapsed)}
				className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-[18px] z-10 h-14 w-[18px] items-center justify-center rounded-r-md border border-l-0 border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
				title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				<ChevronLeft
					className={cn("h-3.5 w-3.5 transition-transform", isCollapsed && "rotate-180")}
				/>
			</button>
			{/* Brand — links back to public site */}
			<Link
				to="/"
				className="flex items-center gap-2 px-4 h-14 border-b border-border flex-shrink-0 hover:bg-muted/50 transition-colors"
				title="Back to Cogworks site"
			>
				<img
					src="/cogworks-bot-icon.png"
					alt="Cogworks"
					className="h-8 w-8 rounded-lg flex-shrink-0"
				/>
				{!isCollapsed && (
					<>
						<span className="font-semibold text-sm truncate">Cogworks</span>
						<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25 border border-amber-500/40 text-amber-500 font-semibold uppercase tracking-wider">
							Beta
						</span>
					</>
				)}
			</Link>

			{/* Guild info */}
			{guild && (
				<div className="flex items-center gap-2 px-4 py-3 border-b border-border flex-shrink-0">
					{guildIcon ? (
						<img src={guildIcon} alt={guild.name} className="h-8 w-8 rounded-full flex-shrink-0" />
					) : (
						<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
							{getInitials(guild.name)}
						</div>
					)}
					{!isCollapsed && <span className="text-sm font-medium truncate">{guild.name}</span>}
				</div>
			)}

			{/* Navigation */}
			<nav className="flex-1 overflow-y-auto py-2 px-2">
				{SIDEBAR_ITEMS.map((item) => {
					if (isSection(item)) {
						if (isCollapsed) {
							return <div key={item.section} className="mx-3 my-2 h-px bg-border" />;
						}
						return (
							<div
								key={item.section}
								className="px-2 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
							>
								{item.section}
							</div>
						);
					}

					if (item.ownerOnly && !isOwner) return null;

					const Icon = item.icon;
					return (
						<NavLink
							key={item.to}
							to={`${basePath}/${item.to}`}
							end={item.end}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
									isActive
										? "bg-primary/10 text-primary font-medium"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
									isCollapsed && "justify-center px-0",
								)
							}
							title={isCollapsed ? item.label : undefined}
						>
							<Icon className="h-4 w-4 flex-shrink-0" />
							{!isCollapsed && <span className="truncate">{item.label}</span>}
						</NavLink>
					);
				})}
			</nav>

			{/* Footer */}
			<div className="border-t border-border p-2 flex-shrink-0">
				<NavLink
					to="/dashboard"
					className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
				>
					<ChevronLeft className="h-4 w-4 flex-shrink-0" />
					{!isCollapsed && <span>Back to Servers</span>}
				</NavLink>
			</div>
		</aside>
	);
}
