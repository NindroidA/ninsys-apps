/**
 * ScrollSection - Pinned section during scroll
 *
 * Creates a section that pins in place while the user scrolls,
 * allowing for scroll-driven animations within the section.
 */

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionProps {
	children: ReactNode;
	/** How long the section stays pinned (in viewport heights, e.g., 2 = 200vh of scroll) */
	pinDuration?: number;
	/** Whether to pin the section */
	pin?: boolean;
	/** Start position (e.g., "top top", "center center") */
	start?: string;
	/** End position (e.g., "bottom top", "+=500") */
	end?: string;
	/** Scrub animation to scroll (true, number for smoothing, or false) */
	scrub?: boolean | number;
	/** Show debug markers */
	markers?: boolean;
	/** Additional className */
	className?: string;
	/** Callback when section enters viewport */
	onEnter?: () => void;
	/** Callback when section leaves viewport */
	onLeave?: () => void;
	/** Callback for scroll progress (0-1) */
	onProgress?: (progress: number) => void;
}

export function ScrollSection({
	children,
	pinDuration = 1,
	pin = true,
	start = "top top",
	end,
	scrub = true,
	markers = false,
	className = "",
	onEnter,
	onLeave,
	onProgress,
}: ScrollSectionProps) {
	const sectionRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!triggerRef.current) return;

			const computedEnd = end || `+=${window.innerHeight * pinDuration}`;

			ScrollTrigger.create({
				trigger: triggerRef.current,
				start,
				end: computedEnd,
				pin: pin ? sectionRef.current : false,
				scrub: scrub === true ? 1 : scrub,
				markers,
				onEnter: () => onEnter?.(),
				onLeave: () => onLeave?.(),
				onUpdate: (self) => onProgress?.(self.progress),
			});
		},
		{ scope: triggerRef, dependencies: [pinDuration, pin, start, end, scrub] },
	);

	return (
		<div ref={triggerRef} className={className}>
			<div ref={sectionRef}>{children}</div>
		</div>
	);
}
