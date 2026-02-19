/**
 * Custom Select/Dropdown Component
 *
 * A premium-looking dropdown with animations and custom styling.
 */

import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface SelectOption {
	value: string;
	label: string;
	icon?: React.ReactNode;
}

interface SelectProps {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
	disabled?: boolean;
}

export function Select({
	value,
	onChange,
	options,
	placeholder = "Select...",
	className,
	disabled = false,
}: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === value);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Close on escape key
	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		}
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, []);

	const handleSelect = (optionValue: string) => {
		onChange(optionValue);
		setIsOpen(false);
	};

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			{/* Trigger button */}
			<button
				type="button"
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				className={cn(
					"flex items-center justify-between gap-2 w-full h-10 px-3 rounded-lg",
					"bg-gradient-to-b from-muted/80 to-muted/40 text-sm font-medium",
					"border border-border/60",
					"transition-all duration-200",
					"hover:from-muted hover:to-muted/60 hover:border-primary/40",
					"focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50",
					isOpen && "border-primary/50 ring-2 ring-primary/30 from-muted to-muted/60",
					disabled && "opacity-50 cursor-not-allowed",
				)}
			>
				<span className={cn("truncate", !selectedOption && "text-muted-foreground")}>
					{selectedOption ? (
						<span className="flex items-center gap-2">
							{selectedOption.icon}
							{selectedOption.label}
						</span>
					) : (
						placeholder
					)}
				</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
						isOpen && "rotate-180 text-primary",
					)}
				/>
			</button>

			{/* Dropdown menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.96 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className={cn(
							"absolute z-50 top-full left-0 right-0 mt-1.5",
							"rounded-xl overflow-hidden",
							"border border-border/60 bg-card/98 backdrop-blur-xl",
							"shadow-xl shadow-black/20 dark:shadow-black/40",
						)}
					>
						{/* Subtle gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

						<div className="relative max-h-64 overflow-y-auto py-1.5">
							{options.map((option, index) => {
								const isSelected = option.value === value;
								return (
									<motion.button
										key={option.value}
										type="button"
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.02 }}
										onClick={() => handleSelect(option.value)}
										className={cn(
											"flex items-center justify-between gap-2 w-full px-3 py-2.5 text-sm",
											"transition-all duration-100",
											isSelected
												? "bg-primary/15 text-primary font-medium"
												: "hover:bg-muted/70 text-foreground",
										)}
									>
										<span className="flex items-center gap-2 truncate">
											{option.icon}
											{option.label}
										</span>
										{isSelected && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{ type: "spring", stiffness: 500, damping: 30 }}
											>
												<Check className="h-4 w-4 text-primary shrink-0" />
											</motion.div>
										)}
									</motion.button>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

/**
 * Checkbox component with premium styling
 */
interface CheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	className?: string;
	disabled?: boolean;
}

export function Checkbox({
	checked,
	onChange,
	label,
	className,
	disabled = false,
}: CheckboxProps) {
	return (
		<label
			className={cn(
				"flex items-center gap-2.5 cursor-pointer select-none group",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
		>
			<div className="relative">
				<input
					type="checkbox"
					checked={checked}
					onChange={(e) => !disabled && onChange(e.target.checked)}
					disabled={disabled}
					className="sr-only peer"
				/>
				<div
					className={cn(
						"h-5 w-5 rounded-md transition-all duration-200",
						"flex items-center justify-center",
						checked
							? "bg-gradient-to-br from-primary to-primary/80 border-primary shadow-sm shadow-primary/25"
							: "border-2 border-border/60 bg-muted/30 group-hover:border-primary/40 group-hover:bg-muted/50",
						"peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30",
					)}
				>
					<AnimatePresence>
						{checked && (
							<motion.div
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0, opacity: 0 }}
								transition={{ type: "spring", stiffness: 500, damping: 30 }}
							>
								<Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			{label && (
				<span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
					{label}
				</span>
			)}
		</label>
	);
}
