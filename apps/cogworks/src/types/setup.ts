export type SystemId =
	| "staffRole"
	| "ticket"
	| "application"
	| "announcement"
	| "baitchannel"
	| "memory"
	| "rules"
	| "reactionRole";

export type SystemState = "not_started" | "partial" | "complete";

export interface SetupState {
	guildId: string;
	selectedSystems: SystemId[] | null;
	systemStates: Record<SystemId, SystemState>;
	partialData: Record<string, unknown> | null;
	hasSetupState: boolean;
}
