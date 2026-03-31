import {
	dismissBanner,
	getMaintenanceBannerMessage,
	isBannerDismissed,
	useMaintenanceStatus,
} from "@/hooks/useMaintenance";
import { Construction, X } from "lucide-react";
import { useCallback, useState } from "react";

export function MaintenanceBanner() {
	const { data: maintenance } = useMaintenanceStatus();
	const [dismissed, setDismissed] = useState(() => isBannerDismissed());

	const handleDismiss = useCallback(() => {
		dismissBanner();
		setDismissed(true);
	}, []);

	if (!maintenance?.active || dismissed) return null;

	const message = getMaintenanceBannerMessage();

	return (
		<div className="bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-b border-amber-500/20">
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
				<Construction className="h-5 w-5 text-amber-500 flex-shrink-0" />
				<p className="text-sm text-amber-200 flex-1">{message}</p>
				<button
					type="button"
					onClick={handleDismiss}
					className="p-1 rounded hover:bg-amber-500/20 text-amber-400 transition-colors flex-shrink-0"
					aria-label="Dismiss"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
