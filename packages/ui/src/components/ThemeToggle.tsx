import { useThemeStore } from "../stores/themeStore";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
	const { isDark, toggle } = useThemeStore();

	return (
		<button
			type="button"
			onClick={toggle}
			className="relative p-2 rounded-lg hover:bg-muted transition-colors"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
		>
			<motion.div
				initial={false}
				animate={{ rotate: isDark ? 0 : 180 }}
				transition={{ duration: 0.3 }}
			>
				{isDark ? (
					<Moon className="h-5 w-5 text-muted-foreground" />
				) : (
					<Sun className="h-5 w-5 text-muted-foreground" />
				)}
			</motion.div>
		</button>
	);
}
