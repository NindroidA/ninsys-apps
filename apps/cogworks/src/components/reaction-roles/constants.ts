import type { ReactionRoleMode } from "@/types/reaction-roles";

export const MODE_INFO: Record<ReactionRoleMode, { label: string; description: string }> = {
	normal: {
		label: "Normal",
		description: "Users can have multiple roles from this menu",
	},
	unique: {
		label: "Unique",
		description: "Users can only have one role from this menu",
	},
	lock: { label: "Lock", description: "Roles are permanent once selected" },
};

export const MODE_COLORS: Record<ReactionRoleMode, string> = {
	normal: "bg-blue-500/10 text-blue-500",
	unique: "bg-amber-500/10 text-amber-500",
	lock: "bg-red-500/10 text-red-500",
};
