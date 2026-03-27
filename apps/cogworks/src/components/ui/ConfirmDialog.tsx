import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: "default" | "destructive";
	isLoading?: boolean;
	confirmDisabled?: boolean;
	onConfirm: () => void;
	children?: ReactNode;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "default",
	isLoading = false,
	confirmDisabled = false,
	onConfirm,
	children,
}: ConfirmDialogProps) {
	const dialogRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	// Focus trap + escape + body scroll lock
	useEffect(() => {
		if (!open) return;

		// Store the previously focused element
		previousActiveElement.current = document.activeElement as HTMLElement | null;

		// Focus the dialog panel after mount
		requestAnimationFrame(() => {
			dialogRef.current?.focus();
		});

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) {
				e.stopImmediatePropagation();
				onOpenChange(false);
				return;
			}

			// Focus trap: Tab / Shift+Tab
			if (e.key === "Tab" && dialogRef.current) {
				const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
					'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
				);
				if (focusable.length === 0) {
					e.preventDefault();
					return;
				}
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (e.shiftKey) {
					if (
						document.activeElement === first ||
						!dialogRef.current.contains(document.activeElement)
					) {
						e.preventDefault();
						last?.focus();
					}
				} else {
					if (
						document.activeElement === last ||
						!dialogRef.current.contains(document.activeElement)
					) {
						e.preventDefault();
						first?.focus();
					}
				}
			}
		};

		document.addEventListener("keydown", onKeyDown);
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = "";
			// Restore focus
			previousActiveElement.current?.focus();
		};
	}, [open, isLoading, onOpenChange]);

	const handleClose = useCallback(() => {
		if (!isLoading) onOpenChange(false);
	}, [isLoading, onOpenChange]);

	const dialog = (
		<AnimatePresence>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<motion.div
						className="fixed inset-0 bg-black/50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
					/>
					<motion.div
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="confirm-dialog-title"
						tabIndex={-1}
						className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl outline-none"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
					>
						<h2 id="confirm-dialog-title" className="text-lg font-semibold">
							{title}
						</h2>
						{description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
						{children && <div className="mt-4">{children}</div>}
						<div className="flex justify-end gap-2 mt-6">
							<Button variant="ghost" onClick={handleClose} disabled={isLoading}>
								{cancelLabel}
							</Button>
							<Button
								onClick={onConfirm}
								disabled={isLoading || confirmDisabled}
								className={cn(
									variant === "destructive" &&
										"bg-destructive text-destructive-foreground hover:bg-destructive/90",
								)}
							>
								{isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
								{confirmLabel}
							</Button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);

	return createPortal(dialog, document.body);
}
