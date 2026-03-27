import { create } from "zustand";

interface SidebarStore {
	/** Whether the mobile drawer is open (overlay sidebar) */
	isMobileOpen: boolean;
	/** Whether the desktop sidebar is collapsed to icon-only mode */
	isCollapsed: boolean;
	toggleMobile: () => void;
	setMobileOpen: (open: boolean) => void;
	setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
	isMobileOpen: false,
	isCollapsed: false,
	toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
	setMobileOpen: (open) => set({ isMobileOpen: open }),
	setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
}));
