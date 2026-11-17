import { Button } from "@ninsys/ui/components";
import { AlertTriangle } from "lucide-react";

/**
 * Shown instead of a settings form whose data didn't load. A form of empty
 * defaults would overwrite the real settings on the next save.
 */
export function BaitLoadError({
	what,
	error,
	onRetry,
	retrying,
}: {
	what: string;
	error: Error | null;
	onRetry: () => void;
	retrying: boolean;
}) {
	return (
		<div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
			<AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
			<div className="space-y-3">
				<div>
					<p className="text-sm font-medium">Couldn't load the {what}</p>
					<p className="text-xs text-muted-foreground mt-0.5">
						{error?.message ?? "Unknown error"}. Nothing can be saved until it loads, so your
						current settings stay as they are.
					</p>
				</div>
				<Button variant="outline" onClick={onRetry} disabled={retrying}>
					{retrying ? "Retrying..." : "Try again"}
				</Button>
			</div>
		</div>
	);
}

/** The guild has no bait channel yet; the API stores nothing until it does. */
export function BaitNotSetUp() {
	return (
		<div className="text-center py-12 border border-dashed border-border rounded-lg">
			<p className="text-muted-foreground mb-1">The bait channel isn't set up on this server</p>
			<p className="text-sm text-muted-foreground">
				Run <code>/baitchannel setup</code> in Discord first, then come back here.
			</p>
		</div>
	);
}
