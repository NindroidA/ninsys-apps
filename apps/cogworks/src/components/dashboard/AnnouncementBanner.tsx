import {
	dismissAnnouncement,
	getGlobalAnnouncement,
	isAnnouncementDismissed,
} from "@/hooks/useMaintenance";
import { cn } from "@ninsys/ui/lib";
import { Info, Megaphone, PartyPopper, X } from "lucide-react";
import { useCallback, useState } from "react";

const TYPE_STYLES = {
	info: {
		bg: "bg-gradient-to-r from-primary/10 to-accent/5 border-primary/20",
		text: "text-primary/90",
		icon: Info,
	},
	warning: {
		bg: "bg-gradient-to-r from-amber-500/10 to-orange-500/5 border-amber-500/20",
		text: "text-amber-300",
		icon: Megaphone,
	},
	success: {
		bg: "bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/20",
		text: "text-green-400",
		icon: PartyPopper,
	},
};

export function AnnouncementBanner() {
	const [dismissed, setDismissed] = useState(() => isAnnouncementDismissed());
	const announcement = getGlobalAnnouncement();

	const handleDismiss = useCallback(() => {
		dismissAnnouncement();
		setDismissed(true);
	}, []);

	if (!announcement || dismissed) return null;

	const style = TYPE_STYLES[announcement.type] ?? TYPE_STYLES.info;
	const Icon = style.icon;

	return (
		<div className={cn("border-b", style.bg)}>
			<div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
				<Icon className={cn("h-5 w-5 flex-shrink-0", style.text)} />
				<p className={cn("text-sm flex-1", style.text)}>{announcement.message}</p>
				<button
					type="button"
					onClick={handleDismiss}
					className={cn(
						"p-1 rounded hover:bg-white/10 transition-colors flex-shrink-0",
						style.text,
					)}
					aria-label="Dismiss"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
