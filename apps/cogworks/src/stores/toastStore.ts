import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration: number;
	persistent: boolean;
}

interface ToastStore {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => string;
	removeToast: (id: string) => void;
}

let nextId = 0;

export const useToastStore = create<ToastStore>((set) => ({
	toasts: [],
	addToast: (toast) => {
		const id = `toast-${++nextId}`;
		set((state) => ({
			toasts: [...state.toasts.slice(-4), { ...toast, id }],
		}));
		return id;
	},
	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((t) => t.id !== id),
		})),
}));

const DURATIONS: Record<ToastType, number> = {
	success: 3000,
	error: 0,
	warning: 5000,
	info: 3000,
};

export const toast = {
	success: (message: string) =>
		useToastStore
			.getState()
			.addToast({ type: "success", message, duration: DURATIONS.success, persistent: false }),
	error: (message: string) =>
		useToastStore
			.getState()
			.addToast({ type: "error", message, duration: DURATIONS.error, persistent: true }),
	warning: (message: string) =>
		useToastStore
			.getState()
			.addToast({ type: "warning", message, duration: DURATIONS.warning, persistent: false }),
	info: (message: string) =>
		useToastStore
			.getState()
			.addToast({ type: "info", message, duration: DURATIONS.info, persistent: false }),
	dismiss: (id: string) => useToastStore.getState().removeToast(id),
};
