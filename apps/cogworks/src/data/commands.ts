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
		usage: "/ticket [type] [reason]",
		category: "Tickets",
		permissions: [],
		examples: ["/ticket", "/ticket support I need help"],
		subcommands: [
			{ name: "workflow-enable", description: "Enable ticket workflow statuses", usage: "/ticket workflow-enable" },
			{ name: "workflow-add-status", description: "Add a workflow status", usage: "/ticket workflow-add-status <id> <label> <emoji> <color>" },
			{ name: "workflow-remove-status", description: "Remove a workflow status", usage: "/ticket workflow-remove-status <id>" },
			{ name: "set-status", description: "Set ticket workflow status", usage: "/ticket set-status <status>" },
			{ name: "assign", description: "Assign a ticket to a staff member", usage: "/ticket assign <user>" },
		],
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
		usage: "/apply [position]",
		category: "Applications",
		permissions: [],
		examples: ["/apply", "/apply moderator"],
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
		description: "Send an announcement using a template.",
		usage: "/announce <template> [channel] [params]",
		category: "Announcements",
		permissions: ["Manage Messages"],
		examples: ["/announce maintenance-short", "/announce server-update version:1.2.0"],
		subcommands: [
			{ name: "template-create", description: "Create a new announcement template", usage: "/announce template-create <name>" },
			{ name: "template-list", description: "List all announcement templates", usage: "/announce template-list" },
			{ name: "template-preview", description: "Preview a template", usage: "/announce template-preview <name>" },
			{ name: "template-delete", description: "Delete a custom template", usage: "/announce template-delete <name>" },
		],
	},

	// Bait Channel Commands
	{
		name: "bait",
		description: "Configure bait channel detection and moderation.",
		usage: "/bait <setup|disable|status>",
		category: "Bait Channel",
		permissions: ["Administrator"],
		examples: ["/bait setup", "/bait status"],
		subcommands: [
			{ name: "keyword-add", description: "Add a detection keyword", usage: "/bait keyword-add <word> [weight]" },
			{ name: "keyword-remove", description: "Remove a detection keyword", usage: "/bait keyword-remove <word>" },
			{ name: "keyword-list", description: "List all detection keywords", usage: "/bait keyword-list" },
			{ name: "test-mode", description: "Toggle test mode (log only)", usage: "/bait test-mode" },
		],
	},

	// XP Commands
	{
		name: "xp",
		description: "View your XP, level, and leaderboard position.",
		usage: "/xp [user]",
		category: "XP & Levels",
		permissions: [],
		examples: ["/xp", "/xp @User"],
		subcommands: [
			{ name: "leaderboard", description: "View the server leaderboard", usage: "/xp leaderboard" },
			{ name: "set", description: "Set a user's XP (admin)", usage: "/xp set <user> <amount>" },
			{ name: "reset", description: "Reset a user's XP (admin)", usage: "/xp reset <user>" },
			{ name: "import", description: "Import XP from MEE6", usage: "/xp import mee6" },
		],
	},
	{
		name: "rank",
		description: "View your rank card with level and XP progress.",
		usage: "/rank [user]",
		category: "XP & Levels",
		permissions: [],
		examples: ["/rank", "/rank @User"],
	},

	// Starboard Commands
	{
		name: "starboard",
		description: "Configure starboard settings.",
		usage: "/starboard <setup|disable|status>",
		category: "Starboard",
		permissions: ["Administrator"],
		examples: ["/starboard setup", "/starboard status"],
	},

	// Memory Commands
	{
		name: "memory",
		description: "Search and manage server memory items.",
		usage: "/memory <search|add|edit|delete>",
		category: "Memory",
		permissions: ["Manage Messages"],
		examples: ["/memory search server rules", "/memory add"],
		subcommands: [
			{ name: "setup", description: "Set up a memory channel", usage: "/memory-setup channel <forum>" },
			{ name: "tag-add", description: "Add a tag to a memory channel", usage: "/memory-setup tag-add <channel> <name> <type>" },
			{ name: "tag-remove", description: "Remove a tag", usage: "/memory-setup tag-remove <channel> <tag>" },
		],
	},

	// Rules Commands
	{
		name: "rules",
		description: "Post or update the server rules message.",
		usage: "/rules <setup|update|status>",
		category: "Rules",
		permissions: ["Administrator"],
		examples: ["/rules setup", "/rules update"],
	},

	// Reaction Roles Commands
	{
		name: "reaction-roles",
		description: "Create and manage reaction role menus.",
		usage: "/reaction-roles <create|edit|delete>",
		category: "Reaction Roles",
		permissions: ["Manage Roles"],
		examples: ["/reaction-roles create Color Roles"],
	},

	// Events Commands
	{
		name: "event",
		description: "Create and manage scheduled events.",
		usage: "/event <create|list|cancel>",
		category: "Events",
		permissions: ["Manage Events"],
		examples: ["/event create", "/event list"],
	},

	// Onboarding Commands
	{
		name: "onboarding",
		description: "Configure the member onboarding flow.",
		usage: "/onboarding <setup|add-step|status>",
		category: "Onboarding",
		permissions: ["Administrator"],
		examples: ["/onboarding setup", "/onboarding add-step"],
	},

	// Analytics Commands
	{
		name: "stats",
		description: "View server activity statistics.",
		usage: "/stats [period]",
		category: "Analytics",
		permissions: ["View Audit Log"],
		examples: ["/stats", "/stats weekly"],
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
	{
		name: "status",
		description: "View or set the bot's status display.",
		usage: "/status [set|clear]",
		category: "Admin",
		permissions: ["Administrator"],
		examples: ["/status", "/status set maintenance Bot update in progress"],
	},
];

export const commandCategories = [
	"All",
	"Setup",
	"Tickets",
	"Applications",
	"Announcements",
	"Bait Channel",
	"XP & Levels",
	"Starboard",
	"Memory",
	"Rules",
	"Reaction Roles",
	"Events",
	"Onboarding",
	"Analytics",
	"Admin",
];
