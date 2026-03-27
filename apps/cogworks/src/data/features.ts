import {
	BarChart3,
	BookOpen,
	Brain,
	CalendarDays,
	FileText,
	Megaphone,
	Shield,
	ShieldAlert,
	Smile,
	Star,
	Ticket,
	UserPlus,
} from "lucide-react";

export const features = [
	{
		id: "tickets",
		title: "Ticket System",
		description:
			"Create and manage support tickets with customizable types, workflow statuses, SLA tracking, and smart routing to staff.",
		icon: Ticket,
		highlights: [
			"Custom ticket types with fields",
			"Workflow statuses & auto-close",
			"SLA tracking & breach alerts",
			"Smart routing to staff",
		],
	},
	{
		id: "applications",
		title: "Application System",
		description:
			"Accept and review staff applications with customizable positions, custom fields, and workflow management.",
		icon: FileText,
		highlights: [
			"Multiple positions with custom questions",
			"Application workflow states",
			"Staff review & voting",
			"Automatic role assignment",
		],
	},
	{
		id: "announcements",
		title: "Announcements",
		description:
			"Send formatted announcements with customizable templates, placeholder variables, and role mentions.",
		icon: Megaphone,
		highlights: [
			"Customizable embed templates",
			"Placeholder variables",
			"Role mention management",
			"Announcement history",
		],
	},
	{
		id: "bait-channel",
		title: "Bait Channel",
		description:
			"Advanced honeypot detection with keyword scoring, escalation thresholds, join velocity tracking, and DM notifications.",
		icon: ShieldAlert,
		highlights: [
			"Smart detection with scoring",
			"Keyword management",
			"Escalation thresholds",
			"Join velocity monitoring",
		],
	},
	{
		id: "xp",
		title: "XP & Levels",
		description:
			"Reward active members with XP for messages and voice, level-up roles, channel multipliers, and leaderboards.",
		icon: Star,
		highlights: [
			"Message & voice XP",
			"Channel multipliers",
			"Level-up role rewards",
			"MEE6 import support",
		],
	},
	{
		id: "starboard",
		title: "Starboard",
		description:
			"Showcase the best messages in your server with customizable star thresholds and emoji reactions.",
		icon: Star,
		highlights: [
			"Customizable star emoji & threshold",
			"Self-star & bot filtering",
			"Starred message gallery",
			"Top starred users",
		],
	},
	{
		id: "memory",
		title: "Memory System",
		description:
			"Organize server knowledge with tagged memory items in forum channels, searchable by category and status.",
		icon: Brain,
		highlights: [
			"Forum-based knowledge base",
			"Category & status tags",
			"Search & filter items",
			"Multi-channel support",
		],
	},
	{
		id: "rules",
		title: "Rules & Verification",
		description:
			"Post server rules with reaction-based acknowledgment and optional role assignment on acceptance.",
		icon: BookOpen,
		highlights: [
			"Custom rules message",
			"Reaction acknowledgment",
			"Role on acceptance",
			"Configurable emoji",
		],
	},
	{
		id: "reaction-roles",
		title: "Reaction Roles",
		description:
			"Let members self-assign roles by reacting to messages with configurable emoji menus.",
		icon: Smile,
		highlights: [
			"Multiple reaction menus",
			"Custom emoji per role",
			"Role validation",
			"Menu rebuild support",
		],
	},
	{
		id: "onboarding",
		title: "Onboarding",
		description:
			"Guide new members through a step-by-step onboarding flow with role selection, rules acceptance, and custom questions.",
		icon: UserPlus,
		highlights: [
			"Multi-step onboarding flow",
			"Role selection steps",
			"Completion tracking",
			"Custom welcome message",
		],
	},
	{
		id: "events",
		title: "Scheduled Events",
		description: "Create event templates with automatic reminders and post-event summaries.",
		icon: CalendarDays,
		highlights: [
			"Event templates",
			"Automatic reminders",
			"Recurring events",
			"Post-event summaries",
		],
	},
	{
		id: "analytics",
		title: "Server Analytics",
		description:
			"Track server activity with message stats, member growth, activity heatmaps, and automated digest reports.",
		icon: BarChart3,
		highlights: [
			"Activity dashboards",
			"Growth tracking",
			"Channel analytics",
			"Automated digests",
		],
	},
	{
		id: "moderation",
		title: "Moderation Tools",
		description:
			"Role management with staff/admin roles, aliases, and a comprehensive audit log of all dashboard actions.",
		icon: Shield,
		highlights: ["Staff & admin roles", "Role aliases", "Audit trail", "Permission management"],
	},
];
