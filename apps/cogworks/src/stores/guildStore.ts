import { create } from "zustand";

interface GuildStore {
	currentGuildId: string | null;
	setCurrentGuildId: (id: string | null) => void;
}

export const useGuildStore = create<GuildStore>((set) => ({
	currentGuildId: null,
	setCurrentGuildId: (id) => set({ currentGuildId: id }),
}));
