import { useBotHealthStore } from "@/stores/botHealthStore";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function BotOfflineBanner() {
	const { isOffline } = useBotHealthStore();
	const [dismissed, setDismissed] = useState(false);
	const [retrying, setRetrying] = useState(false);
	const queryClient = useQueryClient();
	const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Reset dismissed state when bot comes back online then goes offline again
	useEffect(() => {
		if (!isOffline && dismissed) {
			setDismissed(false);
		}
	}, [isOffline, dismissed]);

	// Cleanup retry timer on unmount
	useEffect(() => {
		return () => {
			if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
		};
	}, []);

	const handleRetry = useCallback(async () => {
		setRetrying(true);
		await queryClient.invalidateQueries({ queryKey: ["bot-health"] });
		retryTimerRef.current = setTimeout(() => setRetrying(false), 2000);
	}, [queryClient]);

	const handleDismiss = useCallback(() => {
		setDismissed(true);
	}, []);

	if (!isOffline || dismissed) return null;

	return (
		<div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5">
			<div className="flex items-center gap-3 max-w-5xl mx-auto">
				<AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
				<p className="text-sm text-amber-200 flex-1">
					We're having trouble connecting to Cogworks. Make sure the bot is online and try again.
				</p>
				<button
					type="button"
					onClick={handleRetry}
					disabled={retrying}
					className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
				>
					{retrying ? (
						<Loader2 className="h-3 w-3 animate-spin" />
					) : (
						<RefreshCw className="h-3 w-3" />
					)}
					Retry
				</button>
				<button
					type="button"
					onClick={handleDismiss}
					className="p-1 rounded hover:bg-amber-500/20 text-amber-400 transition-colors"
					aria-label="Dismiss"
				>
					<X className="h-3.5 w-3.5" />
				</button>
			</div>
		</div>
	);
}
