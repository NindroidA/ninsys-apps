/**
 * Two-Factor Authentication setup dialog
 * Steps: QR code → verify code → show recovery codes
 */

import { useConfirm2FA, useSetup2FA } from "@/hooks/useTwoFactor";
import { Button, Input } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Loader2, Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface TwoFactorSetupDialogProps {
	open: boolean;
	onClose: () => void;
}

type Step = "qr" | "verify" | "recovery";

const FOCUSABLE_SELECTOR =
	'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const STEP_LABELS: Record<Step, string> = {
	qr: "Step 1 of 3: Scan QR code",
	verify: "Step 2 of 3: Verify code",
	recovery: "Step 3 of 3: Save recovery codes",
};

export function TwoFactorSetupDialog({ open, onClose }: TwoFactorSetupDialogProps) {
	const setup2FA = useSetup2FA();
	const confirm2FA = useConfirm2FA();

	const [step, setStep] = useState<Step>("qr");
	const [secret, setSecret] = useState("");
	const [qrUrl, setQrUrl] = useState("");
	const [manualSecret, setManualSecret] = useState("");
	const [code, setCode] = useState("");
	const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
	const [copied, setCopied] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: setup on open, reset on close
	useEffect(() => {
		if (open) {
			setup2FA.mutate(undefined, {
				onSuccess: (data) => {
					setQrUrl(data.qrCodeDataUrl);
					setSecret(data.secret);
					setManualSecret(data.secret);
					setStep("qr");
				},
			});
		} else {
			setStep("qr");
			setSecret("");
			setQrUrl("");
			setManualSecret("");
			setCode("");
			setRecoveryCodes([]);
			setCopied(false);
			setup2FA.reset();
			confirm2FA.reset();
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	async function handleVerify() {
		if (code.length !== 6) return;
		try {
			const result = await confirm2FA.mutateAsync({ secret, code });
			setRecoveryCodes(result.recoveryCodes);
			setStep("recovery");
		} catch {
			// Error shown via mutation state
		}
	}

	async function handleCopyAll() {
		const text = recoveryCodes.join("\n");
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard API may fail in some contexts
		}
	}

	const isLoading = setup2FA.isPending || confirm2FA.isPending;

	function handleContentKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (e.key === "Escape") {
			if (step === "recovery" || isLoading) return;
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

	const titleId = "twofactor-setup-dialog-title";

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
						onClick={step === "recovery" || isLoading ? undefined : onClose}
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
						{/* Screen reader step announcements */}
						<div aria-live="polite" className="sr-only">
							{STEP_LABELS[step]}
						</div>

						{step === "qr" && (
							<>
								<div className="flex items-center gap-2 mb-4">
									<Lock className="h-5 w-5 text-primary" />
									<h3 id={titleId} className="text-lg font-semibold">Set Up Two-Factor Authentication</h3>
								</div>
								{setup2FA.isPending ? (
									<div className="flex items-center justify-center py-8">
										<Loader2 className="h-8 w-8 animate-spin text-primary" />
										<span className="sr-only">Loading QR code...</span>
									</div>
								) : setup2FA.isError ? (
									<div className="text-sm text-red-500 mb-4" role="alert">
										{setup2FA.error.message}
										<Button variant="outline" size="sm" className="ml-2" onClick={() => setup2FA.mutate()}>
											Retry
										</Button>
									</div>
								) : (
									<>
										<p className="text-sm text-muted-foreground mb-4">
											Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
										</p>
										{qrUrl && (
											<div className="flex justify-center mb-4">
												<img src={qrUrl} alt="2FA QR Code" className="w-48 h-48 rounded-lg" />
											</div>
										)}
										<details className="mb-4">
											<summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
												Can't scan? Enter this code manually
											</summary>
											<code className="block mt-2 p-3 rounded-lg bg-muted text-sm font-mono break-all select-all">
												{manualSecret}
											</code>
										</details>
										<div className="flex gap-3 justify-end">
											<Button variant="outline" onClick={onClose}>
												Cancel
											</Button>
											<Button onClick={() => setStep("verify")}>Next</Button>
										</div>
									</>
								)}
							</>
						)}

						{step === "verify" && (
							<>
								<div className="flex items-center gap-2 mb-4">
									<Lock className="h-5 w-5 text-primary" />
									<h3 id={titleId} className="text-lg font-semibold">Verify Setup</h3>
								</div>
								<p className="text-sm text-muted-foreground mb-4">
									Enter the 6-digit code from your authenticator app to confirm setup.
								</p>
								<div className="mb-4">
									<Input
										value={code}
										onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
										placeholder="000000"
										maxLength={6}
										className="text-center text-2xl tracking-[0.5em] font-mono"
										autoFocus
										onKeyDown={(e) => {
											if (e.key === "Enter" && code.length === 6) handleVerify();
										}}
									/>
								</div>
								{confirm2FA.isError && (
									<p className="text-sm text-red-500 mb-4" role="alert">{confirm2FA.error.message}</p>
								)}
								<div className="flex gap-3 justify-end">
									<Button variant="outline" onClick={() => setStep("qr")} disabled={confirm2FA.isPending}>
										Back
									</Button>
									<Button onClick={handleVerify} disabled={code.length !== 6 || confirm2FA.isPending}>
										{confirm2FA.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
										Verify & Enable
									</Button>
								</div>
							</>
						)}

						{step === "recovery" && (
							<>
								<div className="flex items-center gap-2 mb-4">
									<ShieldCheck className="h-5 w-5 text-success" />
									<h3 id={titleId} className="text-lg font-semibold">Recovery Codes</h3>
								</div>
								<div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm mb-4" role="alert">
									<p className="font-medium text-warning">Save these recovery codes.</p>
									<p className="text-muted-foreground mt-1">
										They will not be shown again. Each code can only be used once.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-2 mb-4">
									{recoveryCodes.map((code) => (
										<code
											key={code}
											className="p-2 rounded bg-muted text-sm font-mono text-center select-all"
										>
											{code}
										</code>
									))}
								</div>
								<div className="flex gap-3 justify-between">
									<Button
										variant="outline"
										onClick={handleCopyAll}
										aria-label={copied ? "Copied recovery codes" : "Copy all recovery codes"}
									>
										{copied ? (
											<>
												<Check className="mr-2 h-4 w-4 text-success" /> Copied!
											</>
										) : (
											<>
												<Copy className="mr-2 h-4 w-4" /> Copy All
											</>
										)}
									</Button>
									<Button onClick={onClose}>I've Saved My Codes</Button>
								</div>
							</>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
