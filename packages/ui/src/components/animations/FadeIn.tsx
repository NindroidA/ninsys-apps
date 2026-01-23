import { type Variants, motion } from "framer-motion";
import type { ReactNode } from "react";

export interface FadeInProps {
	children: ReactNode;
	direction?: "up" | "down" | "left" | "right";
	delay?: number;
	duration?: number;
	className?: string;
}

export function FadeIn({
	children,
	direction = "up",
	delay = 0,
	duration = 0.5,
	className,
}: FadeInProps) {
	const directionOffset = {
		up: { y: 30 },
		down: { y: -30 },
		left: { x: 30 },
		right: { x: -30 },
	};

	const variants: Variants = {
		hidden: {
			opacity: 0,
			...directionOffset[direction],
		},
		visible: {
			opacity: 1,
			x: 0,
			y: 0,
		},
	};

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={variants}
			transition={{ duration, delay, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
