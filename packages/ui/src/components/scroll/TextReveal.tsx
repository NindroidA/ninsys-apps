/**
 * TextReveal - Apple-style text reveal on scroll
 *
 * Reveals text character by character or word by word as the user scrolls,
 * creating an engaging reading experience similar to Apple's website.
 */

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ElementType, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
	/** Text content to reveal */
	children: string;
	/** Reveal mode */
	mode?: "character" | "word" | "line";
	/** Start position */
	start?: string;
	/** End position */
	end?: string;
	/** Scrub value for smooth scroll linking */
	scrub?: boolean | number;
	/** Color for revealed text */
	revealedColor?: string;
	/** Color for unrevealed text */
	unrevealedColor?: string;
	/** Additional className for container */
	className?: string;
	/** Tag to render (h1, h2, p, etc.) */
	as?: ElementType;
}

export function TextReveal({
	children,
	mode = "word",
	start = "top 80%",
	end = "top 20%",
	scrub = true,
	revealedColor = "currentColor",
	unrevealedColor = "rgba(255, 255, 255, 0.2)",
	className = "",
	as: Tag = "p",
}: TextRevealProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	// Split text into units based on mode
	const splitText = () => {
		if (mode === "character") {
			return children.split("").map((char, i) => ({
				content: char === " " ? "\u00A0" : char,
				key: `char-${i}`,
			}));
		}
		if (mode === "word") {
			return children.split(" ").map((word, i) => ({
				content: word,
				key: `word-${i}`,
			}));
		}
		// line mode
		return children.split("\n").map((line, i) => ({
			content: line,
			key: `line-${i}`,
		}));
	};

	const units = splitText();

	useGSAP(
		() => {
			if (!containerRef.current) return;

			const elements = containerRef.current.querySelectorAll(".text-unit");

			const tween = gsap.fromTo(
				elements,
				{
					color: unrevealedColor,
				},
				{
					color: revealedColor,
					stagger: 0.05,
					ease: "none",
					scrollTrigger: {
						trigger: containerRef.current,
						start,
						end,
						scrub: scrub === true ? 1.5 : scrub, // Increased scrub for smoother animation
					},
				},
			);

			// Cleanup on re-render
			return () => {
				tween.scrollTrigger?.kill();
				tween.kill();
			};
		},
		{
			scope: containerRef,
			dependencies: [mode, revealedColor, unrevealedColor, start, end, scrub],
		},
	);

	return (
		<div ref={containerRef} className={className}>
			<Tag className="leading-relaxed">
				{units.map((unit, index) => (
					<span key={unit.key} className="text-unit inline-block">
						{unit.content}
						{mode === "word" && index < units.length - 1 && "\u00A0"}
					</span>
				))}
			</Tag>
		</div>
	);
}
