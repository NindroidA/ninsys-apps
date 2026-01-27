import { Clock, Cloud, Puzzle, RefreshCw, Server, Shield, Terminal, Zap } from "lucide-react";

export const features = [
	{
		id: "multi-source",
		title: "Multi-Source Updates",
		description:
			"Update plugins from Spigot, Modrinth, GitHub, Hangar, Jenkins, direct URLs, and more. All from one tool.",
		icon: RefreshCw,
		highlights: [
			"8 plugin sources supported",
			"Automatic version detection",
			"Changelog previews",
			"Dependency resolution",
		],
	},
	{
		id: "server-sync",
		title: "Server Synchronization",
		description:
			"Keep plugins in sync across multiple servers. Update once, deploy everywhere safely.",
		icon: Server,
		highlights: [
			"Multi-server profiles",
			"Safe rollout strategy",
			"Version pinning",
			"Conflict detection",
		],
	},
	{
		id: "smart-backups",
		title: "Smart Backups",
		description:
			"Never lose your plugin configurations. Automatic backups before every update with easy restore.",
		icon: Shield,
		highlights: [
			"Pre-update snapshots",
			"Config preservation",
			"One-click restore",
			"Cloud backup sync (Pro)",
		],
	},
	{
		id: "terminal-ui",
		title: "Modern Terminal UI",
		description:
			"Beautiful CLI experience with interactive menus, progress bars, and colorful output.",
		icon: Terminal,
		highlights: [
			"Interactive mode",
			"Rich progress display",
			"Configurable themes",
			"Keyboard shortcuts",
		],
	},
	{
		id: "plugin-profiles",
		title: "Plugin Profiles",
		description:
			"Define your plugin stack in configuration files. Version control your server setup.",
		icon: Puzzle,
		highlights: [
			"TOML configuration",
			"Git-friendly format",
			"Environment variables",
			"Profile inheritance",
		],
	},
	{
		id: "cloud-dashboard",
		title: "Cloud Dashboard",
		description: "Manage your servers from anywhere with our web dashboard. No CLI access needed.",
		icon: Cloud,
		highlights: ["Web-based management", "Real-time status", "Remote updates", "Mobile friendly"],
	},
	{
		id: "scheduled-updates",
		title: "Scheduled Updates",
		description:
			"Set up automatic update checks and notifications. Stay current without the hassle.",
		icon: Clock,
		highlights: [
			"Cron-based scheduling",
			"Update notifications",
			"Auto-apply options",
			"Maintenance windows",
		],
	},
	{
		id: "fast-downloads",
		title: "Fast & Efficient",
		description:
			"Built with TypeScript and powered by Bun. Parallel downloads and minimal resource usage.",
		icon: Zap,
		highlights: [
			"Parallel downloads",
			"Efficient caching",
			"Low memory footprint",
			"Cross-platform",
		],
	},
];
