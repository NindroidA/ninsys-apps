export interface SlaConfig {
	enabled: boolean;
	targetResponseMinutes: number;
	breachAlertChannelId: string | null;
	perTypeOverrides: { typeId: string; typeName: string; minutes: number }[];
}

export interface SlaStats {
	averageFirstResponseMinutes: number;
	complianceRate: number;
	breachCount: number;
	trending: { date: string; compliance: number; breaches: number }[];
}
