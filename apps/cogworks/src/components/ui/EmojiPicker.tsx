import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@ninsys/ui/lib";
import { useThemeStore } from "@ninsys/ui/stores";
import { EmojiStyle, Theme } from "emoji-picker-react";
import { SmilePlus, X } from "lucide-react";
import { Suspense, lazy, useCallback, useRef, useState } from "react";

const EmojiPickerReact = lazy(() => import("emoji-picker-react"));

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

function PickerFallback() {
  return (
    <div className="w-[min(350px,90vw)] h-[400px] rounded-lg border border-border bg-card flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function EmojiPicker({
  value,
  onChange,
  label,
  placeholder = "Select emoji",
  disabled,
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useThemeStore();

  const handleClose = useCallback(() => setIsOpen(false), []);
  useClickOutside(containerRef, handleClose, isOpen);

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="text-sm font-medium mb-1.5 block">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors",
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-primary/50",
            isOpen && "border-primary/50"
          )}
        >
          {value ? (
            <span className="text-lg leading-none">{value}</span>
          ) : (
            <>
              <SmilePlus className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{placeholder}</span>
            </>
          )}
        </button>
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Clear emoji"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <Suspense fallback={<PickerFallback />}>
            <EmojiPickerReact
              theme={isDark ? Theme.DARK : Theme.LIGHT}
              emojiStyle={EmojiStyle.TWITTER}
              onEmojiClick={(emojiData) => {
                onChange(emojiData.emoji);
                setIsOpen(false);
              }}
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
