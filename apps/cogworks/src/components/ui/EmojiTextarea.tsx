import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@ninsys/ui/lib";
import { useThemeStore } from "@ninsys/ui/stores";
import { EmojiStyle, Theme } from "emoji-picker-react";
import { SmilePlus } from "lucide-react";
import { Suspense, lazy, useCallback, useRef, useState } from "react";

const EmojiPickerReact = lazy(() => import("emoji-picker-react"));

function PickerFallback() {
	return (
		<div className="w-[min(350px,90vw)] h-[400px] rounded-lg border border-border bg-card flex items-center justify-center">
			<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
		</div>
	);
}

interface EmojiTextareaProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	rows?: number;
	maxLength?: number;
	disabled?: boolean;
	id?: string;
	className?: string;
}

export function EmojiTextarea({
	value,
	onChange,
	placeholder,
	rows = 3,
	maxLength,
	disabled,
	id,
	className,
}: EmojiTextareaProps) {
	const [pickerOpen, setPickerOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { isDark } = useThemeStore();

	const handleClose = useCallback(() => setPickerOpen(false), []);
	useClickOutside(containerRef, handleClose, pickerOpen);

	const insertEmoji = useCallback(
		(emoji: string) => {
			const textarea = textareaRef.current;
			if (!textarea) {
				onChange(value + emoji);
				setPickerOpen(false);
				return;
			}

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const newValue = value.slice(0, start) + emoji + value.slice(end);

			if (maxLength && newValue.length > maxLength) {
				setPickerOpen(false);
				return;
			}

			onChange(newValue);
			setPickerOpen(false);

			// Restore cursor position after emoji
			requestAnimationFrame(() => {
				const pos = start + emoji.length;
				textarea.setSelectionRange(pos, pos);
				textarea.focus();
			});
		},
		[value, onChange, maxLength],
	);

	return (
		<div ref={containerRef} className="relative">
			<div className="relative">
				<textarea
					ref={textareaRef}
					id={id}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					rows={rows}
					maxLength={maxLength}
					disabled={disabled}
					className={cn(
						"w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm",
						className,
					)}
				/>
				<button
					type="button"
					onClick={() => !disabled && setPickerOpen(!pickerOpen)}
					disabled={disabled}
					className={cn(
						"absolute bottom-2 right-2 p-1.5 rounded-md transition-colors",
						disabled
							? "opacity-30 cursor-not-allowed"
							: "text-muted-foreground hover:text-foreground hover:bg-muted",
						pickerOpen && "text-primary bg-primary/10",
					)}
					title="Insert emoji"
				>
					<SmilePlus className="h-4 w-4" />
				</button>
			</div>

			{pickerOpen && (
				<div className="absolute bottom-full right-0 mb-1 z-50">
					<Suspense fallback={<PickerFallback />}>
						<EmojiPickerReact
							theme={isDark ? Theme.DARK : Theme.LIGHT}
							emojiStyle={EmojiStyle.TWITTER}
							onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
							lazyLoadEmojis
							searchPlaceholder="Search emojis..."
							width={350}
							height={400}
						/>
					</Suspense>
				</div>
			)}
		</div>
	);
}
