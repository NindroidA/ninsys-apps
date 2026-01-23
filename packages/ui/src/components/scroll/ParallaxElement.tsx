/**
 * ParallaxElement - Element with parallax scroll effect
 *
 * Creates elements that move at different speeds relative to scroll,
 * creating depth and visual interest.
 */

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode } from "react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxElementProps {
	children: ReactNode;
	/** Parallax speed (-1 to 1, negative = opposite direction, 0 = no parallax) */
	speed?: number;
	/** Direction of parallax movement */
	direction?: "vertical" | "horizontal";
	/** Start position */
	start?: string;
	/** End position */
	end?: string;
	/** Additional className */
	className?: string;
	/** Inline styles */
	style?: React.CSSProperties;
	/** Whether to fade in as element enters viewport */
	fadeIn?: boolean;
	/** Scale effect (1 = no scale, > 1 = grow, < 1 = shrink) */
	scale?: number;
}

export function ParallaxElement({
	children,
	speed = 0.5,
	direction = "vertical",
	start = "top bottom",
	end = "bottom top",
	className = "",
	style,
	fadeIn = false,
	scale,
}: ParallaxElementProps) {
	const elementRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!elementRef.current) return;

			const distance = speed * 100;
			const fromProps: gsap.TweenVars = {};
			const toProps: gsap.TweenVars = {};

			if (direction === "vertical") {
				fromProps.y = distance;
				toProps.y = -distance;
			} else {
				fromProps.x = distance;
				toProps.x = -distance;
			}

			if (fadeIn) {
				fromProps.opacity = 0;
				toProps.opacity = 1;
			}

			if (scale !== undefined) {
				fromProps.scale = 1;
				toProps.scale = scale;
			}

			const tween = gsap.fromTo(elementRef.current, fromProps, {
				...toProps,
				ease: "none",
				scrollTrigger: {
					trigger: elementRef.current,
					start,
					end,
					scrub: 1.2, // Increased scrub for smoother/slower catch-up
				},
			});

			// Cleanup on re-render
			return () => {
				tween.scrollTrigger?.kill();
				tween.kill();
			};
		},
		{ scope: elementRef, dependencies: [speed, direction, fadeIn, scale, start, end] },
	);

	return (
		<div ref={elementRef} className={className} style={style}>
			{children}
		</div>
	);
}
