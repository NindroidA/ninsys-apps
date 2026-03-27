import { type Toast, useToastStore } from "@/stores/toastStore";
import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect } from "react";

const ICONS = {
	success: CheckCircle,
	error: XCircle,
	warning: AlertTriangle,
	info: Info,
};

const COLORS = {
	success: "border-green-500/30 bg-green-500/10 text-green-400",
	error: "border-red-500/30 bg-red-500/10 text-red-400",
	warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
	info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
};

function ToastItem({ toast }: { toast: Toast }) {
	const removeToast = useToastStore((s) => s.removeToast);
	const Icon = ICONS[toast.type];

	useEffect(() => {
		if (toast.persistent || toast.duration === 0) return;
		const timer = setTimeout(() => removeToast(toast.id), toast.duration);
		return () => clearTimeout(timer);
	}, [toast.id, toast.duration, toast.persistent, removeToast]);

	return (
		<motion.div
			layout
			initial={{ opacity: 0, x: 50, scale: 0.95 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			exit={{ opacity: 0, x: 50, scale: 0.95 }}
			className={cn(
				"flex items-start gap-3 rounded-lg border p-3 shadow-lg backdrop-blur-sm min-w-[300px] max-w-[400px]",
				COLORS[toast.type],
			)}
		>
			<Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
			<p className="text-sm flex-1 text-foreground">{toast.message}</p>
			<button
				type="button"
				onClick={() => removeToast(toast.id)}
				className="flex-shrink-0 p-0.5 rounded hover:bg-white/10 transition-colors"
			>
				<X className="h-4 w-4" />
			</button>
		</motion.div>
	);
}

export function ToastContainer() {
	const toasts = useToastStore((s) => s.toasts);

	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
			<AnimatePresence mode="popLayout">
				{toasts.map((t) => (
					<ToastItem key={t.id} toast={t} />
				))}
			</AnimatePresence>
		</div>
	);
}
