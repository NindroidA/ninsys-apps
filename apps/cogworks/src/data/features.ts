import { FileText, Megaphone, Shield, Ticket } from "lucide-react";

export const features = [
	{
		id: "tickets",
		title: "Ticket System",
		description:
			"Create and manage support tickets with customizable categories, auto-responses, and transcript logging.",
		icon: Ticket,
		href: "/features/tickets",
		highlights: [
			"Multiple ticket categories",
			"Custom claim system",
			"Automatic transcript generation",
			"Configurable permissions",
		],
	},
	{
		id: "applications",
		title: "Application System",
		description:
			"Accept and review staff applications with customizable forms, voting, and automatic role assignment.",
		icon: FileText,
		href: "/features/applications",
		highlights: [
			"Custom application questions",
			"Staff voting system",
			"Automatic role assignment",
			"Application tracking",
		],
	},
	{
		id: "bait-channel",
		title: "Bait Channel",
		description:
			"Catch bad actors with honeypot channels that automatically ban users who interact with them.",
		icon: Shield,
		href: "/features/bait-channel",
		highlights: [
			"Automatic ban on interaction",
			"Configurable bait messages",
			"Whitelist support",
			"Logging integration",
		],
	},
	{
		id: "announcements",
		title: "Announcements",
		description:
			"Send beautiful, formatted announcements with role pings, embeds, and scheduled delivery.",
		icon: Megaphone,
		href: "/features/announcements",
		highlights: [
			"Rich embed support",
			"Scheduled announcements",
			"Role mention management",
			"Template system",
		],
	},
];
