/**
 * Dialog for creating a new Personal Access Token
 * Shows the plaintext token once after creation with copy functionality
 */

import { useCreateToken } from "@/hooks/useTokens";
import { Button, Input } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Key, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface TokenCreateDialogProps {
	open: boolean;
	onClose: () => void;
}

const FOCUSABLE_SELECTOR =
	'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function TokenCreateDialog({ open, onClose }: TokenCreateDialogProps) {
	const createToken = useCreateToken();
	const [name, setName] = useState("");
	const [createdToken, setCreatedToken] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset on close only
	useEffect(() => {
		if (!open) {
			setName("");
			setCreatedToken(null);
			setCopied(false);
			createToken.reset();
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	async function handleCreate() {
		const trimmed = name.trim();
		if (!trimmed) return;
		try {
			const result = await createToken.mutateAsync({ name: trimmed });
			setCreatedToken(result.token);
		} catch {
			// Error handled by mutation state
		}
	}

	async function handleCopy() {
		if (!createdToken) return;
		try {
			await navigator.clipboard.writeText(createdToken);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard API may fail in some contexts
		}
	}

	function handleContentKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (e.key === "Escape") {
			if (createToken.isPending) return;
			onClose();
			return;
		}
		if (e.key === "Tab") {
			const focusable = e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
			if (!focusable.length) return;
			const first = focusable[0]!;
			const last = focusable[focusable.length - 1]!;
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	const titleId = "token-create-dialog-title";

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					role="dialog"
					aria-modal="true"
					aria-labelledby={titleId}
					className="fixed inset-0 z-50 flex items-center justify-center p-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					<motion.div
						className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						onClick={createdToken || createToken.isPending ? undefined : onClose}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					/>
					<motion.div
						className="relative bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6"
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						transition={{ duration: 0.15 }}
						onKeyDown={handleContentKeyDown}
					>
						{createdToken ? (
							<>
								<div className="flex items-center gap-2 mb-4">
									<Key className="h-5 w-5 text-primary" />
									<h3 id={titleId} className="text-lg font-semibold">Token Created</h3>
								</div>
								<div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm mb-4">
									<p className="font-medium text-warning">This token will only be shown once.</p>
									<p className="text-muted-foreground mt-1">Copy it now and store it securely.</p>
								</div>
								<div className="flex items-center gap-2 mb-6">
									<code className="flex-1 p-3 rounded-lg bg-muted text-sm font-mono break-all select-all">
										{createdToken}
									</code>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCopy}
										aria-label={copied ? "Copied" : "Copy token"}
									>
										{copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
									</Button>
								</div>
								<div className="flex justify-end">
									<Button onClick={onClose}>Done</Button>
								</div>
							</>
						) : (
							<>
								<div className="flex items-center gap-2 mb-4">
									<Key className="h-5 w-5 text-primary" />
									<h3 id={titleId} className="text-lg font-semibold">Generate Access Token</h3>
								</div>
								<p className="text-sm text-muted-foreground mb-4">
									Give your token a descriptive name so you can identify it later.
								</p>
								<div className="mb-4">
									<Input
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="e.g. My Server, CI Pipeline"
										maxLength={50}
										autoFocus
										onKeyDown={(e) => {
											if (e.key === "Enter" && name.trim()) handleCreate();
										}}
									/>
								</div>
								{createToken.isError && (
									<p className="text-sm text-red-500 mb-4" role="alert">{createToken.error.message}</p>
								)}
								<div className="flex gap-3 justify-end">
									<Button variant="outline" onClick={onClose} disabled={createToken.isPending}>
										Cancel
									</Button>
									<Button onClick={handleCreate} disabled={!name.trim() || createToken.isPending}>
										{createToken.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
										Generate Token
									</Button>
								</div>
							</>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
