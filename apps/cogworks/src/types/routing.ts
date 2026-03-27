export type RoutingStrategy = "least_load" | "round_robin" | "random";

export interface RoutingConfig {
	enabled: boolean;
	strategy: RoutingStrategy;
	rules: RoutingRule[];
}

export interface RoutingRule {
	id: string;
	ticketTypeId: string;
	ticketTypeName: string;
	staffRoleId: string;
	staffRoleName: string;
	maxOpen: number;
}

export interface StaffWorkload {
	userId: string;
	username: string;
	openTickets: number;
	status: "available" | "at_capacity" | "offline";
}

export interface RoutingStats {
	currentStrategy: RoutingStrategy;
	openTickets: number;
	assignedTickets: number;
	workload: StaffWorkload[];
}
