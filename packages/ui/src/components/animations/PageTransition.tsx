import { motion } from "framer-motion";
import { type ReactNode, useLayoutEffect } from "react";

interface PageTransitionProps {
	children: ReactNode;
	className?: string;
	/** Whether to scroll to top on mount (default: true) */
	scrollToTop?: boolean;
}

const pageVariants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
};

const pageTransition = {
	type: "tween",
	ease: "easeInOut",
	duration: 0.2,
};

export function PageTransition({ children, className, scrollToTop = true }: PageTransitionProps) {
	// Scroll to top instantly when this component mounts (before paint)
	useLayoutEffect(() => {
		if (scrollToTop) {
			window.scrollTo(0, 0);
		}
	}, [scrollToTop]);

	return (
		<motion.div
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
			transition={pageTransition}
			className={className}
		>
			{children}
		</motion.div>
	);
}
