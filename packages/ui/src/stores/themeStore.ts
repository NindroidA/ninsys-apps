import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
	isDark: boolean;
	toggle: () => void;
	setDark: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
	persist(
		(set) => ({
			isDark: true, // Dark mode by default
			toggle: () =>
				set((state) => {
					const newIsDark = !state.isDark;
					updateDocumentClass(newIsDark);
					return { isDark: newIsDark };
				}),
			setDark: (isDark: boolean) =>
				set(() => {
					updateDocumentClass(isDark);
					return { isDark };
				}),
		}),
		{
			name: "theme-storage",
			onRehydrateStorage: () => (state) => {
				// Apply theme class on page load
				if (state) {
					updateDocumentClass(state.isDark);
				}
			},
		},
	),
);

function updateDocumentClass(isDark: boolean) {
	if (isDark) {
		document.documentElement.classList.remove("light");
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
		document.documentElement.classList.add("light");
	}
}
