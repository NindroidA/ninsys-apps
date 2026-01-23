export interface Subcommand {
	name: string;
	description: string;
	usage: string;
}

export interface Command {
	name: string;
	description: string;
	usage: string;
	category: string;
	permissions: string[];
	examples: string[];
	subcommands?: Subcommand[];
}

export const commands: Command[] = [
	// Setup Commands
	{
		name: "setup",
		description: "Configure Cogworks for your server with an interactive setup wizard.",
		usage: "/setup",
		category: "Setup",
		permissions: ["Administrator"],
		examples: ["/setup"],
	},
	{
		name: "config",
		description: "View or modify the current server configuration.",
		usage: "/config [setting] [value]",
		category: "Setup",
		permissions: ["Administrator"],
		examples: ["/config", "/config ticket-category Support"],
	},

	// Ticket Commands
	{
		name: "ticket",
		description: "Create a new support ticket.",
		usage: "/ticket [reason]",
		category: "Tickets",
		permissions: [],
		examples: ["/ticket I need help with my account", "/ticket"],
	},
	{
		name: "close",
		description: "Close the current ticket and generate a transcript.",
		usage: "/close [reason]",
		category: "Tickets",
		permissions: ["Manage Channels"],
		examples: ["/close Issue resolved", "/close"],
	},
	{
		name: "claim",
		description: "Claim a ticket to handle it.",
		usage: "/claim",
		category: "Tickets",
		permissions: ["Manage Channels"],
		examples: ["/claim"],
	},
	{
		name: "add",
		description: "Add a user to the current ticket.",
		usage: "/add <user>",
		category: "Tickets",
		permissions: ["Manage Channels"],
		examples: ["/add @User"],
	},
	{
		name: "remove",
		description: "Remove a user from the current ticket.",
		usage: "/remove <user>",
		category: "Tickets",
		permissions: ["Manage Channels"],
		examples: ["/remove @User"],
	},

	// Application Commands
	{
		name: "apply",
		description: "Start a staff application.",
		usage: "/apply",
		category: "Applications",
		permissions: [],
		examples: ["/apply"],
	},
	{
		name: "application",
		description: "View application status or manage applications.",
		usage: "/application [view|accept|deny] [id]",
		category: "Applications",
		permissions: ["Manage Roles"],
		examples: ["/application view 123", "/application accept 123"],
	},

	// Announcement Commands
	{
		name: "announce",
		description: "Create and send an announcement.",
		usage: "/announce <channel> <message>",
		category: "Announcements",
		permissions: ["Manage Messages"],
		examples: ["/announce #announcements Server maintenance tonight at 10 PM"],
	},
	{
		name: "schedule",
		description: "Schedule an announcement for later.",
		usage: "/schedule <channel> <time> <message>",
		category: "Announcements",
		permissions: ["Manage Messages"],
		examples: ["/schedule #announcements 2h Server restart in 2 hours"],
	},

	// Bait Channel Commands
	{
		name: "bait",
		description: "Configure bait channel settings.",
		usage: "/bait <setup|disable|status>",
		category: "Bait Channel",
		permissions: ["Administrator"],
		examples: ["/bait setup", "/bait status"],
	},

	// Admin Commands
	{
		name: "purge",
		description: "Delete multiple messages at once.",
		usage: "/purge <amount> [user]",
		category: "Admin",
		permissions: ["Manage Messages"],
		examples: ["/purge 50", "/purge 20 @User"],
	},
	{
		name: "logs",
		description: "View server action logs.",
		usage: "/logs [type] [count]",
		category: "Admin",
		permissions: ["View Audit Log"],
		examples: ["/logs ticket 10", "/logs"],
	},
];

export const commandCategories = [
	"All",
	"Setup",
	"Tickets",
	"Applications",
	"Announcements",
	"Bait Channel",
	"Admin",
];
