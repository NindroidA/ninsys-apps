import { create } from "zustand";

interface BotHealthStore {
	isOffline: boolean;
	lastError: string | null;
	setOffline: (error: string) => void;
	setOnline: () => void;
}

export const useBotHealthStore = create<BotHealthStore>((set) => ({
	isOffline: false,
	lastError: null,
	setOffline: (error) => set({ isOffline: true, lastError: error }),
	setOnline: () => set({ isOffline: false, lastError: null }),
}));

/** Check if an API error string indicates the bot is offline */
export function isBotOfflineError(error: string | undefined | null): boolean {
	if (!error) return false;
	return error === "Bot is currently offline" || error.includes("503");
}
