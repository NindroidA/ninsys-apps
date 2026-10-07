export interface MemoryChannelConfig {
	id: string;
	guildId: string;
	forumChannelId: string;
	channelName: string;
	tagCount: number;
	itemCount: number;
	createdAt: string;
}

export interface MemoryTag {
	id: string;
	memoryConfigId: string;
	name: string;
	emoji: string | null;
	tagType: "category" | "status";
	isDefault: boolean;
}

/** A memory_items row. */
export interface MemoryItem {
	id: string;
	memoryConfigId: string;
	title: string;
	description: string | null;
	/** The status tag's name ('Open', 'In Progress', ...), as the bot stores it. */
	status: string;
	threadId: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface MemoryTagGroup {
	categories: MemoryTag[];
	statuses: MemoryTag[];
}
