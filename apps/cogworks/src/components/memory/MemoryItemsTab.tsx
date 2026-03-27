import { type Column, DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Select";
import {
	useCreateMemoryItem,
	useMemoryConfigs,
	useMemoryItems,
	useMemoryTags,
	useUpdateMemoryItem,
	useUpdateMemoryItemStatus,
} from "@/hooks/useMemory";
import type { MemoryChannelConfig, MemoryItem } from "@/types/memory";
import { Badge, Button, Input } from "@ninsys/ui/components";
import { AnimatePresence, motion } from "framer-motion";
import { Database, FileText, Plus, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface MemoryItemsTabProps {
	guildId: string;
}

// --- Create Item Dialog ---

function CreateItemForm({
	guildId,
	configs,
	onDone,
}: {
	guildId: string;
	configs: MemoryChannelConfig[];
	onDone: () => void;
}) {
	const [selectedConfigId, setSelectedConfigId] = useState(
		configs.length === 1 ? (configs[0]?.id ?? "") : "",
	);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const createItem = useCreateMemoryItem(guildId);
	const { data: tags } = useMemoryTags(guildId, selectedConfigId || null);
	const [categoryTag, setCategoryTag] = useState("");
	const [statusTag, setStatusTag] = useState("");

	const titleId = useId();
	const descId = useId();

	const handleCreate = useCallback(() => {
		if (!title.trim() || !selectedConfigId) return;
		createItem.mutate(
			{
				memoryConfigId: selectedConfigId,
				title: title.trim(),
				description: description.trim() || undefined,
				categoryTag: categoryTag || undefined,
				statusTag: statusTag || undefined,
			},
			{
				onSuccess: () => {
					setTitle("");
					setDescription("");
					setCategoryTag("");
					setStatusTag("");
					onDone();
				},
			},
		);
	}, [title, description, selectedConfigId, categoryTag, statusTag, createItem, onDone]);

	return (
		<div className="rounded-lg border border-primary/50 overflow-visible">
			<div className="px-4 py-3 bg-primary/5 text-sm font-medium">New Memory Item</div>
			<div className="p-4 space-y-4">
				{configs.length > 1 && (
					<Select
						value={selectedConfigId}
						onChange={(v) => {
							setSelectedConfigId(v);
							setCategoryTag("");
							setStatusTag("");
						}}
						options={[
							{ value: "", label: "Select channel..." },
							...configs.map((c) => ({ value: c.id, label: c.channelName })),
						]}
						label="Channel"
					/>
				)}

				<div>
					<label htmlFor={titleId} className="text-sm font-medium mb-1.5 block">
						Title
					</label>
					<Input
						id={titleId}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Memory item title"
						disabled={createItem.isPending}
					/>
				</div>

				<div>
					<label htmlFor={descId} className="text-sm font-medium mb-1.5 block">
						Description <span className="text-muted-foreground font-normal">(optional)</span>
					</label>
					<textarea
						id={descId}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Additional details..."
						rows={3}
						className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
						disabled={createItem.isPending}
					/>
				</div>

				{selectedConfigId && tags && (
					<div className="grid grid-cols-2 gap-4">
						{(tags?.categories ?? []).length > 0 && (
							<Select
								value={categoryTag}
								onChange={setCategoryTag}
								options={[
									{ value: "", label: "None" },
									...(tags?.categories ?? []).map((t) => ({
										value: t.id,
										label: t.emoji ? `${t.emoji} ${t.name}` : t.name,
									})),
								]}
								label="Category"
							/>
						)}
						{(tags?.statuses ?? []).length > 0 && (
							<Select
								value={statusTag}
								onChange={setStatusTag}
								options={[
									{ value: "", label: "None" },
									...(tags?.statuses ?? []).map((t) => ({
										value: t.id,
										label: t.emoji ? `${t.emoji} ${t.name}` : t.name,
									})),
								]}
								label="Status"
							/>
						)}
					</div>
				)}

				<div className="flex items-center gap-2 justify-end">
					<Button variant="ghost" onClick={onDone} disabled={createItem.isPending}>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={!title.trim() || !selectedConfigId || createItem.isPending}
					>
						{createItem.isPending ? "Creating..." : "Create Item"}
					</Button>
				</div>
			</div>
		</div>
	);
}

// --- Item Detail Panel ---

function ItemDetailPanel({
	item,
	guildId,
	onClose,
}: {
	item: MemoryItem;
	guildId: string;
	onClose: () => void;
}) {
	const [editTitle, setEditTitle] = useState(item.title);
	const [editDesc, setEditDesc] = useState(item.description ?? "");
	const updateItem = useUpdateMemoryItem(guildId);
	const updateStatus = useUpdateMemoryItemStatus(guildId);
	const { data: tags } = useMemoryTags(guildId, item.memoryConfigId);

	const titleId = useId();
	const descId = useId();

	const isDirty = editTitle !== item.title || editDesc !== (item.description ?? "");

	const handleSave = useCallback(() => {
		updateItem.mutate(
			{
				itemId: item.id,
				title: editTitle.trim(),
				description: editDesc.trim() || null,
			},
			{ onSuccess: onClose },
		);
	}, [editTitle, editDesc, item.id, updateItem, onClose]);

	const handleStatusChange = useCallback(
		(statusTag: string) => {
			updateStatus.mutate({ itemId: item.id, statusTag });
		},
		[item.id, updateStatus],
	);

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black/30 z-40"
				onClick={onClose}
				aria-hidden="true"
			/>

			<motion.div
				role="dialog"
				aria-modal="true"
				aria-label="Item details"
				onKeyDown={(e) => {
					if (e.key === "Escape") onClose();
				}}
				initial={{ x: "100%" }}
				animate={{ x: 0 }}
				exit={{ x: "100%" }}
				transition={{ type: "spring", damping: 25, stiffness: 300 }}
				className="fixed top-0 right-0 bottom-0 w-full max-w-lg border-l border-border bg-card shadow-xl z-50 overflow-y-auto"
			>
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold">Item Details</h3>
						<button
							type="button"
							aria-label="Close panel"
							onClick={onClose}
							className="p-1 rounded hover:bg-muted"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label htmlFor={titleId} className="text-sm font-medium mb-1.5 block">
								Title
							</label>
							<Input
								id={titleId}
								value={editTitle}
								onChange={(e) => setEditTitle(e.target.value)}
								disabled={updateItem.isPending}
							/>
						</div>

						<div>
							<label htmlFor={descId} className="text-sm font-medium mb-1.5 block">
								Description
							</label>
							<textarea
								id={descId}
								value={editDesc}
								onChange={(e) => setEditDesc(e.target.value)}
								rows={4}
								className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
								disabled={updateItem.isPending}
							/>
						</div>

						{tags && (tags?.statuses ?? []).length > 0 && (
							<div>
								<p className="text-sm font-medium mb-1.5">Status</p>
								<div className="flex flex-wrap gap-1.5">
									{(tags?.statuses ?? []).map((s) => (
										<button
											key={s.id}
											type="button"
											onClick={() => handleStatusChange(s.id)}
											disabled={updateStatus.isPending}
											className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
												item.statusTag === s.id
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground hover:bg-muted/80"
											}`}
										>
											{s.emoji ? `${s.emoji} ${s.name}` : s.name}
										</button>
									))}
								</div>
							</div>
						)}

						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-xs text-muted-foreground">Channel</p>
								<p className="font-medium mt-0.5">{item.channelName}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Created By</p>
								<p className="font-medium mt-0.5">{item.createdByUsername}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Created</p>
								<p className="font-medium mt-0.5">{new Date(item.createdAt).toLocaleString()}</p>
							</div>
							<div>
								<p className="text-xs text-muted-foreground">Updated</p>
								<p className="font-medium mt-0.5">{new Date(item.updatedAt).toLocaleString()}</p>
							</div>
						</div>

						{isDirty && (
							<div className="flex gap-2 justify-end pt-2 border-t border-border">
								<Button
									variant="ghost"
									onClick={() => {
										setEditTitle(item.title);
										setEditDesc(item.description ?? "");
									}}
								>
									Discard
								</Button>
								<Button onClick={handleSave} disabled={!editTitle.trim() || updateItem.isPending}>
									{updateItem.isPending ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						)}
					</div>
				</div>
			</motion.div>
		</>
	);
}

// --- Main Component ---

export function MemoryItemsTab({ guildId }: MemoryItemsTabProps) {
	const { data: configs = [], isLoading: configsLoading } = useMemoryConfigs(guildId);
	const [searchParams, setSearchParams] = useSearchParams();

	const channelFilter = searchParams.get("channel") ?? "";
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const [selectedItem, setSelectedItem] = useState<MemoryItem | null>(null);

	// Debounce search input
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
		return () => clearTimeout(timer);
	}, [searchInput]);

	// Reset page when channel filter changes externally (e.g. browser back/forward)
	const prevChannelFilter = useRef(channelFilter);
	useEffect(() => {
		if (prevChannelFilter.current !== channelFilter) {
			setPage(1);
			prevChannelFilter.current = channelFilter;
		}
	}, [channelFilter]);

	const { data, isLoading } = useMemoryItems(guildId, {
		configId: channelFilter || undefined,
		page,
		search: debouncedSearch || undefined,
	});

	const showChannelColumn = !channelFilter;

	// Load tags for the active config (or first config) to resolve tag IDs to names
	const activeConfigId = channelFilter || (configs[0]?.id ?? null);
	const { data: activeTags } = useMemoryTags(guildId, activeConfigId);

	// Build tag ID → display name lookup
	const tagNameMap = useMemo(() => {
		const map = new Map<string, string>();
		if (activeTags) {
			for (const t of activeTags.statuses ?? []) {
				map.set(t.id, t.emoji ? `${t.emoji} ${t.name}` : t.name);
			}
			for (const t of activeTags.categories ?? []) {
				map.set(t.id, t.emoji ? `${t.emoji} ${t.name}` : t.name);
			}
		}
		return map;
	}, [activeTags]);

	const columns = useMemo<Column<MemoryItem>[]>(() => {
		const cols: Column<MemoryItem>[] = [
			{
				key: "title",
				header: "Title",
				render: (row) => <span className="text-sm font-medium">{row.title}</span>,
			},
			{
				key: "statusTag",
				header: "Status",
				render: (row) =>
					row.statusTag ? (
						<Badge variant="outline" className="text-xs">
							{tagNameMap.get(row.statusTag) ?? row.statusTag}
						</Badge>
					) : (
						<span className="text-xs text-muted-foreground">—</span>
					),
			},
			{
				key: "categoryTag",
				header: "Category",
				render: (row) =>
					row.categoryTag ? (
						<Badge variant="outline" className="text-xs">
							{tagNameMap.get(row.categoryTag) ?? row.categoryTag}
						</Badge>
					) : (
						<span className="text-xs text-muted-foreground">—</span>
					),
			},
		];

		if (showChannelColumn) {
			cols.push({
				key: "channelName",
				header: "Channel",
				render: (row) => (
					<Badge variant="outline" className="text-xs bg-primary/5">
						{row.channelName}
					</Badge>
				),
			});
		}

		cols.push(
			{
				key: "createdByUsername",
				header: "Created By",
				render: (row) => <span className="text-sm">{row.createdByUsername}</span>,
			},
			{
				key: "createdAt",
				header: "Created",
				render: (row) => (
					<span className="text-sm text-muted-foreground">
						{new Date(row.createdAt).toLocaleDateString()}
					</span>
				),
			},
		);

		return cols;
	}, [showChannelColumn, tagNameMap]);

	if (configsLoading) {
		return (
			<div className="py-8 flex items-center justify-center">
				<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
			</div>
		);
	}

	if (configs.length === 0) {
		return (
			<div className="text-center py-12 border border-dashed border-border rounded-lg">
				<Database className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
				<p className="text-muted-foreground mb-1">No memory channels configured</p>
				<p className="text-sm text-muted-foreground">
					Set up a memory channel in the Channels tab first.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3 flex-wrap">
				{configs.length > 1 && (
					<Select
						value={channelFilter}
						onChange={(v) => {
							setSearchParams(
								(prev) => {
									const next = new URLSearchParams(prev);
									if (v) {
										next.set("channel", v);
									} else {
										next.delete("channel");
									}
									return next;
								},
								{ replace: true },
							);
							setPage(1);
						}}
						options={[
							{ value: "", label: "All Channels" },
							...configs.map((c) => ({ value: c.id, label: c.channelName })),
						]}
						aria-label="Filter by channel"
					/>
				)}
				<div className="flex-1" />
				{!isCreating && (
					<Button variant="outline" onClick={() => setIsCreating(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Create Item
					</Button>
				)}
			</div>

			{isCreating && (
				<CreateItemForm guildId={guildId} configs={configs} onDone={() => setIsCreating(false)} />
			)}

			<DataTable
				data={data?.data ?? []}
				columns={columns}
				isLoading={isLoading}
				getRowKey={(row) => row.id}
				pagination={data?.pagination}
				onPageChange={setPage}
				searchValue={searchInput}
				onSearchChange={(v) => {
					setSearchInput(v);
					setPage(1);
				}}
				searchPlaceholder="Search items..."
				emptyState={{
					title: "No memory items",
					description: "Create your first memory item to get started.",
					icon: FileText,
				}}
				rowActions={(row) => [
					{
						label: "View Details",
						icon: FileText,
						onClick: () => setSelectedItem(row),
					},
				]}
			/>

			<AnimatePresence>
				{selectedItem && (
					<ItemDetailPanel
						key={selectedItem.id}
						item={selectedItem}
						guildId={guildId}
						onClose={() => setSelectedItem(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
