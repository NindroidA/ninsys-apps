/**
 * HorizontalScroll - Horizontal scrolling section
 *
 * Creates a section that scrolls horizontally as the user scrolls vertically,
 * similar to Apple's product showcases.
 */

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
	children: ReactNode;
	/** Speed of horizontal scroll (higher = faster) */
	speed?: number;
	/** Show debug markers */
	markers?: boolean;
	/** Additional className for container */
	className?: string;
	/** Additional className for inner track */
	trackClassName?: string;
}

export function HorizontalScroll({
	children,
	speed = 1,
	markers = false,
	className = "",
	trackClassName = "",
}: HorizontalScrollProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!containerRef.current || !trackRef.current) return;

			const track = trackRef.current;
			const scrollWidth = track.scrollWidth - window.innerWidth;

			gsap.to(track, {
				x: -scrollWidth,
				ease: "none",
				scrollTrigger: {
					trigger: containerRef.current,
					pin: true,
					scrub: 1,
					end: () => `+=${scrollWidth * speed}`,
					markers,
					invalidateOnRefresh: true,
				},
			});
		},
		{ scope: containerRef, dependencies: [speed] },
	);

	return (
		<div ref={containerRef} className={`overflow-hidden ${className}`}>
			<div ref={trackRef} className={`flex items-center will-change-transform ${trackClassName}`}>
				{children}
			</div>
		</div>
	);
}
