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
	configId: string;
	name: string;
	emoji: string | null;
	tagType: "category" | "status";
	isDefault: boolean;
}

export interface MemoryItem {
	id: string;
	memoryConfigId: string;
	title: string;
	description: string | null;
	categoryTag: string | null;
	statusTag: string | null;
	tags: string[];
	channelName: string;
	createdBy: string;
	createdByUsername: string;
	createdAt: string;
	updatedAt: string;
}

export interface MemoryTagGroup {
	categories: MemoryTag[];
	statuses: MemoryTag[];
}
