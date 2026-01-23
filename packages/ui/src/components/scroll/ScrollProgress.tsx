/**
 * ScrollProgress - Animations tied to scroll position
 *
 * Provides scroll progress (0-1) to children, enabling custom animations
 * that respond to how far the user has scrolled through a section.
 */

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ScrollProgressChildProps {
	/** Current scroll progress (0-1) */
	progress: number;
	/** Whether the element is in view */
	isInView: boolean;
	/** Scroll direction (1 = down, -1 = up) */
	direction: number;
}

interface ScrollProgressProps {
	/** Render function receiving progress data */
	children: (props: ScrollProgressChildProps) => ReactNode;
	/** Start position */
	start?: string;
	/** End position */
	end?: string;
	/** Show debug markers */
	markers?: boolean;
	/** Additional className */
	className?: string;
}

export function ScrollProgress({
	children,
	start = "top bottom",
	end = "bottom top",
	markers = false,
	className = "",
}: ScrollProgressProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);
	const [isInView, setIsInView] = useState(false);
	const [direction, setDirection] = useState(1);

	useGSAP(
		() => {
			if (!containerRef.current) return;

			const trigger = ScrollTrigger.create({
				trigger: containerRef.current,
				start,
				end,
				markers,
				onUpdate: (self) => {
					setProgress(self.progress);
					setDirection(self.direction);
				},
				onEnter: () => setIsInView(true),
				onLeave: () => setIsInView(false),
				onEnterBack: () => setIsInView(true),
				onLeaveBack: () => setIsInView(false),
			});

			// Cleanup on re-render
			return () => {
				trigger.kill();
			};
		},
		{ scope: containerRef, dependencies: [start, end, markers] },
	);

	return (
		<div ref={containerRef} className={className}>
			{children({ progress, isInView, direction })}
		</div>
	);
}

/**
 * Hook to get global scroll progress
 */
export function useScrollProgress() {
	const [progress, setProgress] = useState(0);

	useGSAP(() => {
		ScrollTrigger.create({
			start: 0,
			end: "max",
			onUpdate: (self) => setProgress(self.progress),
		});
	}, []);

	return progress;
}
