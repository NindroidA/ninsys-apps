export interface OnboardingConfig {
	enabled: boolean;
	welcomeMessage: string | null;
	completionRoleId: string | null;
}

export type OnboardingStepType =
	| "message"
	| "role_select"
	| "channel_suggest"
	| "rules_accept"
	| "custom_question";

export interface RoleOption {
	label: string;
	roleId: string;
	emoji: string | null;
}

export interface OnboardingStep {
	id: string;
	type: OnboardingStepType;
	title: string;
	description: string;
	required: boolean;
	sortOrder: number;
	roleOptions?: RoleOption[];
}

export interface OnboardingStats {
	completionRate: number;
	started: number;
	completed: number;
	averageCompletionMinutes: number;
	dropOff: { stepId: string; stepTitle: string; dropCount: number }[];
}
