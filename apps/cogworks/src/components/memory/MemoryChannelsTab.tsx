import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
	useCreateMemoryConfig,
	useCreateMemoryTag,
	useDeleteMemoryConfig,
	useDeleteMemoryTag,
	useMemoryConfigs,
	useMemoryTags,
	useUpdateMemoryConfig,
	useUpdateMemoryTag,
} from "@/hooks/useMemory";
import type { MemoryChannelConfig, MemoryTag } from "@/types/memory";
import { Button, Input } from "@ninsys/ui/components";
import { StaggerContainer } from "@ninsys/ui/components/animations";
import { ChevronDown, ChevronRight, Database, Lock, Pencil, Plus, Trash2, X } from "lucide-react";
import { useCallback, useId, useState } from "react";

interface MemoryChannelsTabProps {
	guildId: string;
}

const MAX_CHANNELS = 3;

// --- Add Channel Form ---

function AddChannelForm({
	guildId,
	onDone,
}: {
	guildId: string;
	onDone: () => void;
}) {
	const createConfig = useCreateMemoryConfig(guildId);
	const [name, setName] = useState("");
	const [forumChannelId, setForumChannelId] = useState<string | null>(null);
	const nameId = useId();

	const handleCreate = useCallback(() => {
		if (!name.trim() || !forumChannelId) return;
		createConfig.mutate({ channelName: name.trim(), forumChannelId }, { onSuccess: onDone });
	}, [name, forumChannelId, createConfig, onDone]);

	return (
		<div className="rounded-lg border border-primary/50 overflow-visible">
			<div className="px-4 py-3 bg-primary/5 text-sm font-medium">New Memory Channel</div>
			<div className="p-4 space-y-4">
				<div>
					<label htmlFor={nameId} className="text-sm font-medium mb-1.5 block">
						Channel Name
					</label>
					<Input
						id={nameId}
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Bug Reports"
						disabled={createConfig.isPending}
					/>
				</div>
				<div>
					<ChannelPicker
						guildId={guildId}
						value={forumChannelId}
						onChange={setForumChannelId}
						filter="forum"
						label="Forum Channel"
						placeholder="Select a forum channel"
						disabled={createConfig.isPending}
					/>
				</div>
				<div className="flex items-center gap-2 justify-end">
					<Button variant="ghost" onClick={onDone} disabled={createConfig.isPending}>
						Cancel
					</Button>
					<Button
						onClick={handleCreate}
						disabled={!name.trim() || !forumChannelId || createConfig.isPending}
					>
						{createConfig.isPending ? "Creating..." : "Create Channel"}
					</Button>
				</div>
			</div>
		</div>
	);
}

// --- Tag Row ---

function TagRow({
	tag,
	guildId,
	onDelete,
}: {
	tag: MemoryTag;
	guildId: string;
	onDelete: (tag: MemoryTag) => void;
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(tag.name);
	const updateTag = useUpdateMemoryTag(guildId, tag.configId);

	const handleSave = useCallback(() => {
		if (!editName.trim() || editName === tag.name) {
			setIsEditing(false);
			setEditName(tag.name);
			return;
		}
		updateTag.mutate(
			{ tagId: tag.id, name: editName.trim() },
			{ onSuccess: () => setIsEditing(false) },
		);
	}, [editName, tag, updateTag]);

	return (
		<div className="flex items-center gap-2 py-1.5">
			{tag.emoji && <span className="text-sm">{tag.emoji}</span>}
			{isEditing ? (
				<Input
					value={editName}
					onChange={(e) => setEditName(e.target.value)}
					className="h-7 text-sm flex-1"
					disabled={updateTag.isPending}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSave();
						if (e.key === "Escape") {
							setIsEditing(false);
							setEditName(tag.name);
						}
					}}
					autoFocus
				/>
			) : (
				<span className="text-sm flex-1 truncate">{tag.name}</span>
			)}
			{tag.isDefault ? (
				<Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
			) : (
				<>
					{!isEditing && (
						<button
							type="button"
							onClick={() => setIsEditing(true)}
							className="p-0.5 rounded hover:bg-muted text-muted-foreground"
							aria-label={`Edit ${tag.name}`}
						>
							<Pencil className="h-3 w-3" />
						</button>
					)}
					{isEditing ? (
						<>
							<Button variant="ghost" size="sm" onClick={handleSave} disabled={updateTag.isPending}>
								Save
							</Button>
							<button
								type="button"
								onClick={() => {
									setIsEditing(false);
									setEditName(tag.name);
								}}
								className="p-0.5 rounded hover:bg-muted text-muted-foreground"
								aria-label="Cancel edit"
							>
								<X className="h-3 w-3" />
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={() => onDelete(tag)}
							className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
							aria-label={`Delete ${tag.name}`}
						>
							<Trash2 className="h-3 w-3" />
						</button>
					)}
				</>
			)}
		</div>
	);
}

// --- Tag Section ---

function TagSection({
	title,
	tags,
	tagType,
	configId,
	guildId,
	onDeleteTag,
}: {
	title: string;
	tags: MemoryTag[];
	tagType: "category" | "status";
	configId: string;
	guildId: string;
	onDeleteTag: (tag: MemoryTag) => void;
}) {
	const [isAdding, setIsAdding] = useState(false);
	const [newName, setNewName] = useState("");
	const createTag = useCreateMemoryTag(guildId);

	const handleAdd = useCallback(() => {
		if (!newName.trim()) return;
		createTag.mutate(
			{ configId, name: newName.trim(), tagType },
			{
				onSuccess: () => {
					setNewName("");
					setIsAdding(false);
				},
			},
		);
	}, [newName, configId, tagType, createTag]);

	return (
		<div>
			<div className="flex items-center justify-between mb-2">
				<h5 className="text-xs font-semibold uppercase text-muted-foreground">{title}</h5>
				{!isAdding && (
					<button
						type="button"
						onClick={() => setIsAdding(true)}
						className="text-xs text-primary hover:underline"
					>
						+ Add
					</button>
				)}
			</div>
			<div className="space-y-0.5">
				{tags.map((tag) => (
					<TagRow key={tag.id} tag={tag} guildId={guildId} onDelete={onDeleteTag} />
				))}
				{tags.length === 0 && !isAdding && (
					<p className="text-xs text-muted-foreground py-2">No {title.toLowerCase()} yet</p>
				)}
			</div>
			{isAdding && (
				<div className="flex items-center gap-2 mt-2">
					<Input
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder={`New ${tagType} name`}
						className="h-7 text-sm flex-1"
						disabled={createTag.isPending}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleAdd();
							if (e.key === "Escape") {
								setIsAdding(false);
								setNewName("");
							}
						}}
						autoFocus
					/>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleAdd}
						disabled={!newName.trim() || createTag.isPending}
					>
						Add
					</Button>
					<button
						type="button"
						onClick={() => {
							setIsAdding(false);
							setNewName("");
						}}
						className="p-0.5 rounded hover:bg-muted text-muted-foreground"
						aria-label="Cancel"
					>
						<X className="h-3 w-3" />
					</button>
				</div>
			)}
		</div>
	);
}

// --- Channel Card ---

function ChannelCard({
	config,
	guildId,
	onDelete,
}: {
	config: MemoryChannelConfig;
	guildId: string;
	onDelete: (config: MemoryChannelConfig) => void;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [editName, setEditName] = useState(config.channelName);
	const [editForumId, setEditForumId] = useState<string | null>(config.forumChannelId);
	const [deleteTag, setDeleteTag] = useState<MemoryTag | null>(null);

	const updateConfig = useUpdateMemoryConfig(guildId);
	const deleteMemoryTag = useDeleteMemoryTag(guildId, config.id);
	const { data: tags } = useMemoryTags(guildId, isExpanded ? config.id : null);

	const nameId = useId();

	const handleSaveConfig = useCallback(() => {
		const updates: Record<string, string> = {};
		if (editName.trim() !== config.channelName) updates.channelName = editName.trim();
		if (editForumId && editForumId !== config.forumChannelId) updates.forumChannelId = editForumId;

		if (Object.keys(updates).length === 0) return;

		updateConfig.mutate({ configId: config.id, ...updates });
	}, [editName, editForumId, config, updateConfig]);

	const handleDeleteTag = useCallback(() => {
		if (!deleteTag) return;
		deleteMemoryTag.mutate(deleteTag.id, {
			onSuccess: () => setDeleteTag(null),
		});
	}, [deleteTag, deleteMemoryTag]);

	return (
		<div className="rounded-lg border border-border overflow-visible">
			<button
				type="button"
				className="flex items-center gap-3 px-4 py-3 bg-card w-full text-left hover:bg-muted/30 transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{isExpanded ? (
					<ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
				) : (
					<ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
				)}
				<Database className="h-4 w-4 text-primary flex-shrink-0" />
				<span className="font-medium text-sm flex-1 truncate">{config.channelName}</span>
				<span className="text-xs text-muted-foreground">{config.tagCount} tags</span>
				<span className="text-xs text-muted-foreground">{config.itemCount} items</span>
			</button>

			{isExpanded && (
				<div className="p-4 border-t border-border bg-muted/10 space-y-5">
					{/* Edit Channel Settings */}
					<div className="space-y-3">
						<div>
							<label htmlFor={nameId} className="text-sm font-medium mb-1.5 block">
								Channel Name
							</label>
							<Input
								id={nameId}
								value={editName}
								onChange={(e) => setEditName(e.target.value)}
								disabled={updateConfig.isPending}
							/>
						</div>
						<ChannelPicker
							guildId={guildId}
							value={editForumId}
							onChange={setEditForumId}
							filter="forum"
							label="Forum Channel"
							disabled={updateConfig.isPending}
						/>
						{(editName.trim() !== config.channelName ||
							(editForumId && editForumId !== config.forumChannelId)) && (
							<div className="flex gap-2 justify-end">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setEditName(config.channelName);
										setEditForumId(config.forumChannelId);
									}}
								>
									Discard
								</Button>
								<Button
									size="sm"
									onClick={handleSaveConfig}
									disabled={!editName.trim() || updateConfig.isPending}
								>
									{updateConfig.isPending ? "Saving..." : "Save"}
								</Button>
							</div>
						)}
					</div>

					{/* Tags */}
					<div className="border-t border-border pt-4">
						<h4 className="text-sm font-semibold mb-3">Tags</h4>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<TagSection
								title="Categories"
								tags={tags?.categories ?? []}
								tagType="category"
								configId={config.id}
								guildId={guildId}
								onDeleteTag={setDeleteTag}
							/>
							<TagSection
								title="Statuses"
								tags={tags?.statuses ?? []}
								tagType="status"
								configId={config.id}
								guildId={guildId}
								onDeleteTag={setDeleteTag}
							/>
						</div>
					</div>

					{/* Delete Channel */}
					<div className="border-t border-border pt-4">
						<Button
							variant="outline"
							className="text-destructive border-destructive/30 hover:bg-destructive/10"
							onClick={() => onDelete(config)}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete Channel
						</Button>
					</div>
				</div>
			)}

			{/* Delete Tag Confirm */}
			<ConfirmDialog
				open={deleteTag !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTag(null);
				}}
				title="Delete Tag"
				description={`Delete "${deleteTag?.name}"? This will unset it from any items using it.`}
				confirmLabel="Delete"
				variant="destructive"
				isLoading={deleteMemoryTag.isPending}
				onConfirm={handleDeleteTag}
			/>
		</div>
	);
}

// --- Main Component ---

function SkeletonChannels() {
	return (
		<div className="space-y-3 animate-pulse">
			{[0, 1].map((i) => (
				<div key={`skel-ch-${i}`} className="rounded-lg border border-border bg-card p-4">
					<div className="flex items-center gap-3">
						<div className="h-4 w-4 rounded bg-muted" />
						<div className="h-4 w-32 rounded bg-muted" />
						<div className="flex-1" />
						<div className="h-4 w-16 rounded bg-muted" />
					</div>
				</div>
			))}
		</div>
	);
}

export function MemoryChannelsTab({ guildId }: MemoryChannelsTabProps) {
	const { data: configs = [], isLoading } = useMemoryConfigs(guildId);
	const deleteConfig = useDeleteMemoryConfig(guildId);

	const [isAdding, setIsAdding] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<MemoryChannelConfig | null>(null);

	const atLimit = configs.length >= MAX_CHANNELS;

	const handleConfirmDelete = useCallback(() => {
		if (!deleteTarget) return;
		deleteConfig.mutate(deleteTarget.id, {
			onSuccess: () => setDeleteTarget(null),
		});
	}, [deleteTarget, deleteConfig]);

	if (isLoading) return <SkeletonChannels />;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{configs.length} / {MAX_CHANNELS} channels configured
				</p>
				{!isAdding && (
					<Button
						variant="outline"
						onClick={() => setIsAdding(true)}
						disabled={atLimit}
						title={atLimit ? "Maximum 3 channels allowed" : undefined}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Channel
					</Button>
				)}
			</div>

			{isAdding && <AddChannelForm guildId={guildId} onDone={() => setIsAdding(false)} />}

			{configs.length === 0 && !isAdding ? (
				<div className="text-center py-12 border border-dashed border-border rounded-lg">
					<Database className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
					<p className="text-muted-foreground mb-3">No memory channels configured</p>
					<Button variant="outline" onClick={() => setIsAdding(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Create First Channel
					</Button>
				</div>
			) : (
				<StaggerContainer className="space-y-3">
					{configs.map((config) => (
						<ChannelCard
							key={config.id}
							config={config}
							guildId={guildId}
							onDelete={setDeleteTarget}
						/>
					))}
				</StaggerContainer>
			)}

			<ConfirmDialog
				open={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				title="Delete Memory Channel"
				description={`This will permanently delete "${deleteTarget?.channelName}" with ${
					deleteTarget?.itemCount ?? 0
				} items and all tags. Are you sure?`}
				confirmLabel="Delete Channel"
				variant="destructive"
				isLoading={deleteConfig.isPending}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
