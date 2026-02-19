/**
 * Confirmation dialog overlay
 */

import { Button } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

interface ConfirmDialogProps {
	open: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	confirmVariant?: "primary" | "outline" | "secondary" | "ghost";
	loading?: boolean;
	destructive?: boolean;
}

export function ConfirmDialog({
	open,
	onConfirm,
	onCancel,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmVariant = "primary",
	loading = false,
	destructive = false,
}: ConfirmDialogProps) {
	// Stabilize callback ref to avoid effect churn
	const onCancelRef = useRef(onCancel);
	onCancelRef.current = onCancel;

	const stableOnCancel = useCallback(() => onCancelRef.current(), []);

	// Close on Escape key
	useEffect(() => {
		if (!open) return;
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape" && !loading) stableOnCancel();
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, loading, stableOnCancel]);

	// Lock body scroll when open
	useEffect(() => {
		if (!open) return;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					role="dialog"
					aria-modal="true"
					aria-labelledby="confirm-dialog-title"
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					{/* Backdrop */}
					<motion.div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={loading ? undefined : onCancel}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>

					{/* Dialog */}
					<motion.div
						className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6"
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						transition={{ duration: 0.15 }}
					>
						<h3 id="confirm-dialog-title" className="text-lg font-semibold mb-2">
							{title}
						</h3>
						<p className="text-sm text-muted-foreground mb-6">{description}</p>

						<div className="flex gap-3 justify-end">
							<Button variant="outline" onClick={onCancel} disabled={loading}>
								{cancelText}
							</Button>
							<Button
								variant={confirmVariant}
								onClick={onConfirm}
								disabled={loading}
								className={
									destructive ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : ""
								}
							>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								{confirmText}
							</Button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
