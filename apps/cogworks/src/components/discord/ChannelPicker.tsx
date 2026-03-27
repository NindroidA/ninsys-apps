import { useClickOutside } from "@/hooks/useClickOutside";
import { useChannels } from "@/hooks/useDiscord";
import { CHANNEL_TYPE_ICONS } from "@/lib/constants";
import { cn } from "@ninsys/ui/lib";
import { ChevronDown, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

interface ChannelPickerProps {
	guildId: string;
	value: string | null;
	onChange: (channelId: string | null) => void;
	filter?: "text" | "voice" | "forum" | "category" | "all";
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	clearable?: boolean;
}

const FILTER_TYPES: Record<string, number[]> = {
	text: [0, 5],
	voice: [2, 13],
	forum: [15],
	category: [4],
	all: [0, 2, 4, 5, 13, 15],
};

export function ChannelPicker({
	guildId,
	value,
	onChange,
	filter = "all",
	placeholder = "Select a channel",
	label,
	error,
	disabled,
	clearable,
}: ChannelPickerProps) {
	const { data: channels = [], isLoading } = useChannels(guildId);
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => {
		setIsOpen(false);
		setSearch("");
	}, []);

	useClickOutside(containerRef, handleClose, isOpen);

	const allowedTypes = useMemo(() => FILTER_TYPES[filter] ?? [0, 2, 4, 5, 13, 15], [filter]);

	const filteredChannels = useMemo(() => {
		const typeFiltered = channels.filter((ch) => allowedTypes.includes(ch.type));
		if (!search) return typeFiltered;
		const q = search.toLowerCase();
		return typeFiltered.filter((ch) => ch.name.toLowerCase().includes(q));
	}, [channels, allowedTypes, search]);

	// Group by parent category
	const grouped = useMemo(() => {
		const categories = channels.filter((ch) => ch.type === 4);
		const groups: {
			category: string | null;
			channels: typeof filteredChannels;
		}[] = [];

		const noCat = filteredChannels.filter((ch) => !ch.parentId && ch.type !== 4);
		if (noCat.length > 0) groups.push({ category: null, channels: noCat });

		for (const cat of categories.sort((a, b) => a.position - b.position)) {
			const children = filteredChannels.filter((ch) => ch.parentId === cat.id);
			if (children.length > 0) groups.push({ category: cat.name, channels: children });
		}

		return groups;
	}, [channels, filteredChannels]);

	const selected = channels.find((ch) => ch.id === value);

	return (
		<div ref={containerRef} className="relative">
			{label && <label className="text-sm font-medium mb-1.5 block">{label}</label>}
			<button
				type="button"
				disabled={disabled || isLoading}
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm transition-colors",
					error ? "border-destructive" : "border-border",
					disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50",
				)}
			>
				<span className={cn(!selected && "text-muted-foreground")}>
					{selected ? (
						<>
							{CHANNEL_TYPE_ICONS[selected.type] ?? "#"} {selected.name}
						</>
					) : (
						placeholder
					)}
				</span>
				<div className="flex items-center gap-1">
					{clearable && value && (
						<span
							role="button"
							tabIndex={0}
							onClick={(e) => {
								e.stopPropagation();
								onChange(null);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.stopPropagation();
									onChange(null);
								}
							}}
							className="p-0.5 rounded hover:bg-muted"
						>
							<X className="h-3 w-3" />
						</span>
					)}
					<ChevronDown
						className={cn(
							"h-4 w-4 text-muted-foreground transition-transform",
							isOpen && "rotate-180",
						)}
					/>
				</div>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
					<div className="p-2 border-b border-border">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search channels..."
							className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary/50"
						/>
					</div>
					<div className="max-h-56 overflow-y-auto py-1">
						{grouped.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">No channels found</p>
						) : (
							grouped.map((group) => (
								<div key={group.category ?? "__none"}>
									{group.category && (
										<div className="px-3 py-1 text-[11px] font-semibold uppercase text-muted-foreground">
											{group.category}
										</div>
									)}
									{group.channels
										.sort((a, b) => a.position - b.position)
										.map((ch) => (
											<button
												key={ch.id}
												type="button"
												onClick={() => {
													onChange(ch.id);
													handleClose();
												}}
												className={cn(
													"flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-muted transition-colors",
													group.category && "pl-6",
													ch.id === value && "bg-primary/5 text-primary",
												)}
											>
												<span className="text-muted-foreground w-4 text-center flex-shrink-0">
													{CHANNEL_TYPE_ICONS[ch.type] ?? "#"}
												</span>
												{ch.name}
											</button>
										))}
								</div>
							))
						)}
					</div>
				</div>
			)}

			{error && <p className="text-xs text-destructive mt-1">{error}</p>}
		</div>
	);
}
