import { cn } from "../lib/utils";
import { motion } from "framer-motion";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
	variant?: "default" | "elevated" | "outline" | "glass";
	hover?: boolean;
	animate?: boolean;
}

const variants = {
	default: "bg-card border border-border",
	elevated: "bg-card shadow-lg",
	outline: "border-2 border-border bg-transparent",
	glass: "glass",
};

export function Card({
	children,
	variant = "default",
	hover = false,
	animate = false,
	className,
	id,
	role,
	"aria-label": ariaLabel,
	"aria-describedby": ariaDescribedby,
	onClick,
	onMouseEnter,
	onMouseLeave,
}: CardProps) {
	const cardClassName = cn(
		"rounded-xl p-6",
		variants[variant],
		hover && "transition-all duration-200 hover:shadow-xl hover:border-primary/50",
		onClick && "cursor-pointer",
		className,
	);

	// Handle keyboard events for accessibility when onClick is provided
	const handleKeyDown = onClick
		? (e: KeyboardEvent<HTMLDivElement>) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
				}
			}
		: undefined;

	const interactiveProps = onClick
		? {
				role: role || "button",
				tabIndex: 0,
				onKeyDown: handleKeyDown,
			}
		: { role };

	if (animate) {
		return (
			<motion.div
				className={cardClassName}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				id={id}
				aria-label={ariaLabel}
				aria-describedby={ariaDescribedby}
				onClick={onClick}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
				{...interactiveProps}
			>
				{children}
			</motion.div>
		);
	}

	return (
		<div
			className={cardClassName}
			id={id}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedby}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			{...interactiveProps}
		>
			{children}
		</div>
	);
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
			{children}
		</div>
	);
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3 className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props}>
			{children}
		</h3>
	);
}

export function CardDescription({
	children,
	className,
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p className={cn("text-sm text-muted-foreground", className)} {...props}>
			{children}
		</p>
	);
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("", className)} {...props}>
			{children}
		</div>
	);
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("flex items-center pt-4", className)} {...props}>
			{children}
		</div>
	);
}
