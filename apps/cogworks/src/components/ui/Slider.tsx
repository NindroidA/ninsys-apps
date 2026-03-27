import { cn } from "@ninsys/ui/lib";
import { useCallback, useRef } from "react";

interface SliderProps {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	step?: number;
	label?: string;
	showValue?: boolean;
	valueFormat?: (value: number) => string;
	disabled?: boolean;
}

export function Slider({
	value,
	onChange,
	min,
	max,
	step = 1,
	label,
	showValue = true,
	valueFormat,
	disabled,
}: SliderProps) {
	const range = max - min;
	const percentage = range > 0 ? ((value - min) / range) * 100 : 0;
	const display = valueFormat ? valueFormat(value) : String(value);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(Number(e.target.value));
		},
		[onChange],
	);

	return (
		<div className={cn(disabled && "opacity-50 pointer-events-none")}>
			{(label || showValue) && (
				<div className="flex items-center justify-between mb-3">
					{label && <label className="text-sm font-medium">{label}</label>}
					{showValue && (
						<span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
							{display}
						</span>
					)}
				</div>
			)}
			<div className="relative h-6 flex items-center group">
				{/* Track background */}
				<div className="absolute inset-x-0 h-2 rounded-full bg-muted" />
				{/* Filled track */}
				<div
					className="absolute left-0 h-2 rounded-full bg-primary transition-[width] duration-75"
					style={{ width: `${percentage}%` }}
				/>
				{/* Native range input — invisible but handles all interaction */}
				<input
					ref={inputRef}
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={handleChange}
					disabled={disabled}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
				/>
				{/* Custom thumb */}
				<div
					className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-primary shadow-md border-2 border-background pointer-events-none transition-transform group-hover:scale-110 group-active:scale-125"
					style={{ left: `${percentage}%` }}
				/>
			</div>
			<div className="flex justify-between mt-2">
				<span className="text-xs text-muted-foreground">
					{valueFormat ? valueFormat(min) : min}
				</span>
				<span className="text-xs text-muted-foreground">
					{valueFormat ? valueFormat(max) : max}
				</span>
			</div>
		</div>
	);
}
