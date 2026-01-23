import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";
import { cn } from "../lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
		const inputId = id || props.name;

		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={inputId} className="text-sm font-medium text-foreground">
						{label}
					</label>
				)}
				<div className="relative">
					{leftIcon && (
						<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
							{leftIcon}
						</div>
					)}
					<input
						ref={ref}
						id={inputId}
						className={cn(
							"w-full h-10 px-3 py-2",
							"bg-background text-foreground",
							"border border-border rounded-lg",
							"placeholder:text-muted-foreground",
							"transition-colors duration-200",
							"focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
							"disabled:opacity-50 disabled:cursor-not-allowed",
							error && "border-error focus:ring-error",
							leftIcon && "pl-10",
							rightIcon && "pr-10",
							className,
						)}
						{...props}
					/>
					{rightIcon && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
							{rightIcon}
						</div>
					)}
				</div>
				{hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
				{error && <p className="text-xs text-error">{error}</p>}
			</div>
		);
	},
);

Input.displayName = "Input";
