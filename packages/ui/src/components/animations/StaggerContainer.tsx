import { type Variants, motion } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerContainerProps {
	children: ReactNode;
	staggerDelay?: number;
	className?: string;
}

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export function StaggerContainer({
	children,
	staggerDelay = 0.1,
	className,
}: StaggerContainerProps) {
	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, margin: "-50px" }}
			variants={{
				...containerVariants,
				visible: {
					...containerVariants.visible,
					transition: {
						staggerChildren: staggerDelay,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// Child component to use inside StaggerContainer
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
	const itemVariants: Variants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: "easeOut" },
		},
	};

	return (
		<motion.div variants={itemVariants} className={className}>
			{children}
		</motion.div>
	);
}
