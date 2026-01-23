import { motion } from "framer-motion";
import {
	type ButtonHTMLAttributes,
	type ReactElement,
	type ReactNode,
	cloneElement,
	isValidElement,
} from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	asChild?: boolean;
}

const variants = {
	primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg",
	secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
	outline:
		"border-[3px] border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md",
	ghost: "text-foreground hover:bg-muted",
	destructive: "bg-error text-error-foreground hover:opacity-90",
};

const sizes = {
	sm: "h-8 px-3 text-sm gap-1.5",
	md: "h-10 px-5 text-base gap-2",
	lg: "h-12 px-6 text-lg gap-2.5",
};

export function Button({
	children,
	variant = "primary",
	size = "md",
	isLoading = false,
	leftIcon,
	rightIcon,
	className,
	disabled,
	asChild = false,
	...props
}: ButtonProps) {
	const buttonClassName = cn(
		"inline-flex items-center justify-center font-medium",
		"rounded-lg transition-all duration-200",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
		"disabled:opacity-50 disabled:pointer-events-none",
		variants[variant],
		sizes[size],
		className,
	);

	// If asChild is true, render the child element with button styles
	if (asChild && isValidElement(children)) {
		return cloneElement(children as ReactElement<{ className?: string }>, {
			className: cn(
				buttonClassName,
				(children as ReactElement<{ className?: string }>).props.className,
			),
		});
	}

	// Extract only the props we want to pass to the button element
	const {
		onClick,
		onMouseDown,
		onMouseUp,
		onFocus,
		onBlur,
		type,
		form,
		name,
		value,
		id,
		"aria-label": ariaLabel,
		"aria-describedby": ariaDescribedby,
		tabIndex,
	} = props;

	return (
		<motion.button
			whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
			whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
			className={buttonClassName}
			disabled={disabled || isLoading}
			onClick={onClick}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onFocus={onFocus}
			onBlur={onBlur}
			type={type}
			form={form}
			name={name}
			value={value}
			id={id}
			aria-label={ariaLabel}
			aria-describedby={ariaDescribedby}
			tabIndex={tabIndex}
		>
			{isLoading ? (
				<svg
					className="animate-spin h-4 w-4"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					role="img"
					aria-labelledby="loading-title"
				>
					<title id="loading-title">Loading</title>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			) : (
				<>
					{leftIcon && <span className="shrink-0">{leftIcon}</span>}
					{children}
					{rightIcon && <span className="shrink-0">{rightIcon}</span>}
				</>
			)}
		</motion.button>
	);
}
