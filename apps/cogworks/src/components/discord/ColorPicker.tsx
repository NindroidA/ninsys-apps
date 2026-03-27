import { cn } from "@ninsys/ui/lib";
import { useRef, useState } from "react";

interface ColorPickerProps {
	value: string | null;
	onChange: (hex: string | null) => void;
	label?: string;
	error?: string;
	disabled?: boolean;
}

const PRESETS = [
	{ name: "Default", hex: "#99AAB5" },
	{ name: "Aqua", hex: "#1ABC9C" },
	{ name: "Green", hex: "#2ECC71" },
	{ name: "Blue", hex: "#3498DB" },
	{ name: "Yellow", hex: "#F1C40F" },
	{ name: "Purple", hex: "#9B59B6" },
	{ name: "Gold", hex: "#F39C12" },
	{ name: "Orange", hex: "#E67E22" },
	{ name: "Red", hex: "#E74C3C" },
	{ name: "Grey", hex: "#95A5A6" },
	{ name: "Navy", hex: "#34495E" },
	{ name: "Dark Aqua", hex: "#11806A" },
	{ name: "Dark Green", hex: "#1F8B4C" },
	{ name: "Dark Blue", hex: "#206694" },
	{ name: "Dark Purple", hex: "#71368A" },
	{ name: "Dark Gold", hex: "#C27C0E" },
	{ name: "Dark Orange", hex: "#A84300" },
	{ name: "Dark Red", hex: "#992D22" },
	{ name: "Blurple", hex: "#5865F2" },
	{ name: "Fuchsia", hex: "#EB459E" },
];

export function ColorPicker({ value, onChange, label, error, disabled }: ColorPickerProps) {
	const prevValue = useRef(value);
	const [inputValue, setInputValue] = useState(value ?? "");

	// Sync from parent without useEffect — runs during render
	if (value !== prevValue.current) {
		prevValue.current = value;
		setInputValue(value ?? "");
	}

	const handleInput = (raw: string) => {
		const cleaned = raw.replace(/[^0-9a-fA-F#]/g, "");
		setInputValue(cleaned);
		const hex = cleaned.startsWith("#") ? cleaned : `#${cleaned}`;
		if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
			onChange(hex);
		}
	};

	const selectPreset = (hex: string) => {
		setInputValue(hex);
		onChange(hex);
	};

	return (
		<div>
			{label && <label className="text-sm font-medium mb-1.5 block">{label}</label>}
			<div className="flex items-center gap-3">
				<div
					className="h-10 w-10 rounded-lg border border-border flex-shrink-0"
					style={{ backgroundColor: value ?? "#99AAB5" }}
				/>
				<input
					type="text"
					value={inputValue}
					onChange={(e) => handleInput(e.target.value)}
					placeholder="#5865F2"
					disabled={disabled}
					className={cn(
						"flex-1 rounded-lg border px-3 py-2 text-sm font-mono outline-none transition-colors",
						error ? "border-destructive" : "border-border focus:border-primary/50",
						disabled && "opacity-50 cursor-not-allowed",
					)}
					maxLength={7}
				/>
			</div>
			<div className="grid grid-cols-10 gap-1.5 mt-3">
				{PRESETS.map((preset) => (
					<button
						key={preset.hex}
						type="button"
						disabled={disabled}
						onClick={() => selectPreset(preset.hex)}
						title={preset.name}
						className={cn(
							"h-6 w-6 rounded-md border transition-transform hover:scale-110",
							value === preset.hex
								? "border-foreground ring-1 ring-foreground"
								: "border-transparent",
						)}
						style={{ backgroundColor: preset.hex }}
					/>
				))}
			</div>
			{error && <p className="text-xs text-destructive mt-1">{error}</p>}
		</div>
	);
}
