import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@ninsys/ui/lib";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useId, useMemo, useRef, useState } from "react";

export interface SelectOption {
	value: string;
	label: string;
	description?: string;
	icon?: React.ReactNode;
}

interface SelectProps {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	placeholder?: string;
	label?: string;
	disabled?: boolean;
	className?: string;
	"aria-label"?: string;
}

export function Select({
	value,
	onChange,
	options,
	placeholder = "Select...",
	label,
	disabled,
	className,
	"aria-label": ariaLabel,
}: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightIndex, setHighlightIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const id = useId();

	const handleClose = useCallback(() => {
		setIsOpen(false);
		setHighlightIndex(-1);
	}, []);

	useClickOutside(containerRef, handleClose, isOpen);

	const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

	const handleSelect = useCallback(
		(optionValue: string) => {
			onChange(optionValue);
			handleClose();
		},
		[onChange, handleClose],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (disabled) return;

			switch (e.key) {
				case "Enter":
				case " ": {
					e.preventDefault();
					if (!isOpen) {
						setIsOpen(true);
						setHighlightIndex(options.findIndex((o) => o.value === value));
					} else if (highlightIndex >= 0 && highlightIndex < options.length) {
						handleSelect(options[highlightIndex]!.value);
					}
					break;
				}
				case "ArrowDown": {
					e.preventDefault();
					if (!isOpen) {
						setIsOpen(true);
						setHighlightIndex(options.findIndex((o) => o.value === value));
					} else {
						const next = Math.min(highlightIndex + 1, options.length - 1);
						setHighlightIndex(next);
						listRef.current?.children[next]?.scrollIntoView({
							block: "nearest",
						});
					}
					break;
				}
				case "ArrowUp": {
					e.preventDefault();
					if (isOpen) {
						const prev = Math.max(highlightIndex - 1, 0);
						setHighlightIndex(prev);
						listRef.current?.children[prev]?.scrollIntoView({
							block: "nearest",
						});
					}
					break;
				}
				case "Escape": {
					handleClose();
					break;
				}
			}
		},
		[disabled, isOpen, highlightIndex, options, value, handleSelect, handleClose],
	);

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			{label && (
				<label htmlFor={id} className="text-sm font-medium mb-1.5 block">
					{label}
				</label>
			)}
			<button
				id={id}
				type="button"
				role="combobox"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-controls={`${id}-listbox`}
				aria-label={ariaLabel}
				disabled={disabled}
				onClick={() => {
					if (!disabled) {
						setIsOpen(!isOpen);
						if (!isOpen) {
							setHighlightIndex(options.findIndex((o) => o.value === value));
						}
					}
				}}
				onKeyDown={handleKeyDown}
				className={cn(
					"flex items-center justify-between w-full rounded-lg border border-border px-3 py-2 text-sm transition-colors",
					disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50",
					isOpen && "border-primary/50",
				)}
			>
				<span className={cn("truncate", !selected && "text-muted-foreground")}>
					{selected ? (
						<span className="flex items-center gap-2">
							{selected.icon}
							{selected.label}
						</span>
					) : (
						placeholder
					)}
				</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 ml-2",
						isOpen && "rotate-180",
					)}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
					<div
						ref={listRef}
						id={`${id}-listbox`}
						role="listbox"
						aria-labelledby={id}
						className="max-h-56 overflow-y-auto py-1"
					>
						{options.map((option, i) => (
							<button
								key={option.value}
								type="button"
								role="option"
								aria-selected={option.value === value}
								onClick={() => handleSelect(option.value)}
								onMouseEnter={() => setHighlightIndex(i)}
								className={cn(
									"flex items-center gap-2 w-full px-3 py-1.5 text-sm transition-colors",
									option.value === value && "text-primary",
									i === highlightIndex && "bg-muted",
								)}
							>
								{option.icon && (
									<span className="flex-shrink-0 w-4 text-center">{option.icon}</span>
								)}
								<span className="flex-1 text-left truncate">
									{option.label}
									{option.description && (
										<span className="text-muted-foreground"> — {option.description}</span>
									)}
								</span>
								{option.value === value && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
