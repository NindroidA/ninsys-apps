import { cn } from "../lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error" | "outline";
	size?: "sm" | "md";
}

const variants = {
	default: "bg-muted text-muted-foreground",
	primary: "bg-primary text-primary-foreground",
	secondary: "bg-secondary text-secondary-foreground",
	success: "bg-success text-success-foreground",
	warning: "bg-warning text-warning-foreground",
	error: "bg-error text-error-foreground",
	outline: "border border-border text-foreground bg-transparent",
};

const sizes = {
	sm: "text-xs px-2 py-0.5",
	md: "text-sm px-2.5 py-0.5",
};

export function Badge({
	children,
	variant = "default",
	size = "md",
	className,
	...props
}: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center font-medium rounded-full",
				variants[variant],
				sizes[size],
				className,
			)}
			{...props}
		>
			{children}
		</span>
	);
}
