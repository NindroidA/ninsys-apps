export type DataExportState = "none" | "processing" | "ready" | "failed";

export interface DataExportStatus {
	state: DataExportState;
	downloadUrl: string | null;
	error: string | null;
	requestedAt: string | null;
	completedAt: string | null;
	nextAvailableAt: string | null;
}
