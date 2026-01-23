/**
 * SmoothScroll - Simple smooth scrolling wrapper
 *
 * A lightweight smooth scroll implementation that doesn't interfere with
 * React Router. Uses continuous RAF loop for smooth wheel scrolling.
 */

import { useEffect, useRef, type ReactNode } from "react";

interface SmoothScrollProps {
	children: ReactNode;
	/** Scroll ease factor (0-1, lower = smoother/slower) */
	ease?: number;
	/** Whether smooth scroll is enabled */
	enabled?: boolean;
}

export function SmoothScroll({
	children,
	ease = 0.08,
	enabled = true
}: SmoothScrollProps) {
	const targetScroll = useRef(0);
	const currentScroll = useRef(0);
	const isScrolling = useRef(false);

	useEffect(() => {
		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches;

		if (!enabled || prefersReducedMotion) {
			return;
		}

		// Initialize scroll positions
		currentScroll.current = window.scrollY;
		targetScroll.current = window.scrollY;

		let animationId: number;

		// Continuous animation loop
		const animate = () => {
			// Calculate difference
			const diff = targetScroll.current - currentScroll.current;

			// Only update if there's meaningful difference
			if (Math.abs(diff) > 0.1) {
				// Lerp towards target
				currentScroll.current += diff * ease;

				// Apply scroll position
				window.scrollTo(0, Math.round(currentScroll.current));
			} else if (Math.abs(diff) > 0) {
				// Snap to target when very close
				currentScroll.current = targetScroll.current;
				window.scrollTo(0, Math.round(currentScroll.current));
			}

			// Keep the loop running
			animationId = requestAnimationFrame(animate);
		};

		// Start the continuous loop
		animationId = requestAnimationFrame(animate);

		// Handle wheel events
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();

			// Update target scroll position
			targetScroll.current += e.deltaY;

			// Clamp to valid range
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
			targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current));
		};

		// Handle keyboard scrolling (arrow keys, page up/down, space)
		const handleKeyDown = (e: KeyboardEvent) => {
			const scrollAmount = 100;
			const pageAmount = window.innerHeight * 0.9;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					targetScroll.current += scrollAmount;
					break;
				case "ArrowUp":
					e.preventDefault();
					targetScroll.current -= scrollAmount;
					break;
				case "PageDown":
				case " ": // Space
					if (!e.shiftKey) {
						e.preventDefault();
						targetScroll.current += pageAmount;
					}
					break;
				case "PageUp":
					e.preventDefault();
					targetScroll.current -= pageAmount;
					break;
				case "Home":
					e.preventDefault();
					targetScroll.current = 0;
					break;
				case "End":
					e.preventDefault();
					targetScroll.current = document.documentElement.scrollHeight - window.innerHeight;
					break;
				default:
					return;
			}

			// Clamp
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
			targetScroll.current = Math.max(0, Math.min(maxScroll, targetScroll.current));
		};

		// Sync when clicking links or navigation changes
		const syncScroll = () => {
			// Only sync if not actively scrolling
			if (!isScrolling.current) {
				const currentWindowScroll = window.scrollY;
				// Check if scroll changed externally (like anchor links or router)
				if (Math.abs(currentWindowScroll - currentScroll.current) > 50) {
					targetScroll.current = currentWindowScroll;
					currentScroll.current = currentWindowScroll;
				}
			}
		};

		// Add event listeners
		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("keydown", handleKeyDown);

		// Check for external scroll changes periodically
		const syncInterval = setInterval(syncScroll, 100);

		return () => {
			cancelAnimationFrame(animationId);
			clearInterval(syncInterval);
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [ease, enabled]);

	return <>{children}</>;
}
