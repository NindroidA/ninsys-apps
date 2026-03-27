import { useSidebarStore } from "@/stores/sidebarStore";
import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface SaveBarProps {
	isDirty: boolean;
	isLoading: boolean;
	onSave: () => void;
	onDiscard: () => void;
}

export function SaveBar({ isDirty, isLoading, onSave, onDiscard }: SaveBarProps) {
	const { isCollapsed } = useSidebarStore();

	return (
		<AnimatePresence>
			{isDirty && (
				<motion.div
					initial={{ y: "100%" }}
					animate={{ y: 0 }}
					exit={{ y: "100%" }}
					transition={{ type: "spring", damping: 25, stiffness: 300 }}
					className={cn(
						"fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-card/95 backdrop-blur-sm px-6 py-3",
						isCollapsed ? "md:left-16" : "md:left-60",
					)}
				>
					<div className="flex items-center justify-between max-w-5xl mx-auto">
						<span className="text-sm text-muted-foreground">You have unsaved changes</span>
						<div className="flex items-center gap-2">
							<Button variant="ghost" onClick={onDiscard} disabled={isLoading}>
								Discard
							</Button>
							<Button onClick={onSave} disabled={isLoading}>
								{isLoading ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
