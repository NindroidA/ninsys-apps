/**
 * ScrollProvider - Lenis smooth scroll context
 *
 * Provides smooth scrolling throughout the app and integrates with GSAP ScrollTrigger.
 * Wrap your app with this provider to enable smooth scrolling and scroll-triggered animations.
 *
 * Key configuration based on Apple-style best practices:
 * - Uses GSAP ticker for RAF sync (not manual RAF)
 * - Disables lag smoothing for immediate response
 * - Disables smooth touch for better mobile UX
 * - Refreshes ScrollTrigger after layout settles
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface ScrollContextValue {
	lenis: Lenis | null;
	scrollTo: (target: string | number | HTMLElement, options?: ScrollToOptions) => void;
}

interface ScrollToOptions {
	offset?: number;
	duration?: number;
	immediate?: boolean;
}

const ScrollContext = createContext<ScrollContextValue>({
	lenis: null,
	scrollTo: () => {},
});

export const useScroll = () => useContext(ScrollContext);

interface ScrollProviderProps {
	children: ReactNode;
	/** Enable/disable smooth scrolling (respects prefers-reduced-motion) */
	smoothScroll?: boolean;
	/** Scroll duration - controls smoothness (default 1.2) */
	duration?: number;
	/** Scroll easing function */
	easing?: (t: number) => number;
}

export function ScrollProvider({
	children,
	smoothScroll = true,
	duration = 0.6, // Reduced from 1.2 for faster, snappier scrolling
	easing = (t) => Math.min(1, 1.001 - 2 ** (-10 * t)), // Expo ease-out
}: ScrollProviderProps) {
	const [lenis, setLenis] = useState<Lenis | null>(null);

	useEffect(() => {
		// Respect prefers-reduced-motion
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (!smoothScroll || prefersReducedMotion) {
			// Still set up ScrollTrigger without Lenis
			ScrollTrigger.defaults({ markers: false });
			return;
		}

		// Initialize Lenis with optimized settings
		const lenisInstance = new Lenis({
			duration,
			easing,
			orientation: "vertical",
			gestureOrientation: "vertical",
			smoothWheel: true,
			wheelMultiplier: 1,
			touchMultiplier: 2,
			autoRaf: true, // Let Lenis handle its own RAF
		});

		setLenis(lenisInstance);

		// Sync Lenis scroll events with ScrollTrigger
		lenisInstance.on("scroll", ScrollTrigger.update);

		// Refresh ScrollTrigger after layout settles
		const refreshTimeout = setTimeout(() => {
			ScrollTrigger.refresh();
		}, 100);

		// Handle resize
		const handleResize = () => {
			ScrollTrigger.refresh();
		};
		window.addEventListener("resize", handleResize);

		return () => {
			clearTimeout(refreshTimeout);
			window.removeEventListener("resize", handleResize);
			lenisInstance.destroy();
			ScrollTrigger.killAll();
		};
	}, [smoothScroll, duration, easing]);

	const scrollTo = (
		target: string | number | HTMLElement,
		options: ScrollToOptions = {},
	) => {
		if (lenis) {
			lenis.scrollTo(target, {
				offset: options.offset ?? 0,
				duration: options.duration ?? duration,
				immediate: options.immediate ?? false,
			});
		} else {
			// Fallback for when Lenis is disabled
			if (typeof target === "string") {
				const element = document.querySelector(target);
				element?.scrollIntoView({ behavior: "smooth" });
			} else if (typeof target === "number") {
				window.scrollTo({ top: target, behavior: "smooth" });
			} else {
				target.scrollIntoView({ behavior: "smooth" });
			}
		}
	};

	return (
		<ScrollContext.Provider value={{ lenis, scrollTo }}>
			{children}
		</ScrollContext.Provider>
	);
}
