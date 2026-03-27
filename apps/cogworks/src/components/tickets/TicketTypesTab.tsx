import { ColorPicker } from "@/components/discord/ColorPicker";
import { FieldBuilder } from "@/components/forms/FieldBuilder";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import {
	useCreateTicketType,
	useDeleteTicketType,
	useReorderTicketTypes,
	useTicketTypes,
	useUpdateTicketType,
	useUpdateTicketTypeFields,
} from "@/hooks/useTickets";
import type { CustomField, CustomTicketType } from "@/types/tickets";
import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Input } from "@ninsys/ui/components";
import { GripVertical, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

interface TicketTypesTabProps {
	guildId: string;
}

interface TypeEditorState {
	displayName: string;
	emoji: string;
	embedColor: string | null;
	description: string;
	isDefault: boolean;
	isActive: boolean;
	pingStaffOnCreate: boolean;
	customFields: CustomField[];
}

function emptyEditor(): TypeEditorState {
	return {
		displayName: "",
		emoji: "",
		embedColor: null,
		description: "",
		isDefault: false,
		isActive: true,
		pingStaffOnCreate: false,
		customFields: [],
	};
}

function fromType(type: CustomTicketType): TypeEditorState {
	return {
		displayName: type.displayName,
		emoji: type.emoji ?? "",
		embedColor: type.embedColor,
		description: type.description ?? "",
		isDefault: type.isDefault,
		isActive: type.isActive,
		pingStaffOnCreate: type.pingStaffOnCreate,
		customFields: [...(type.customFields ?? [])],
	};
}

function TypeEditor({
	state,
	onChange,
	onSave,
	onCancel,
	isSaving,
	saveLabel,
}: {
	state: TypeEditorState;
	onChange: (update: Partial<TypeEditorState>) => void;
	onSave: () => void;
	onCancel: () => void;
	isSaving: boolean;
	saveLabel: string;
}) {
	const id = useId();
	return (
		<div className="p-4 space-y-4 border-t border-border bg-muted/10">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label htmlFor={`${id}-name`} className="text-sm font-medium mb-1.5 block">
						Name
					</label>
					<Input
						id={`${id}-name`}
						value={state.displayName}
						onChange={(e) => onChange({ displayName: e.target.value })}
						placeholder="e.g. General Support"
						disabled={isSaving}
					/>
				</div>
				<div>
					<EmojiPicker
						value={state.emoji}
						onChange={(emoji) => onChange({ emoji })}
						label="Emoji"
						disabled={isSaving}
					/>
				</div>
			</div>

			<div>
				<label htmlFor={`${id}-desc`} className="text-sm font-medium mb-1.5 block">
					Description
				</label>
				<Input
					id={`${id}-desc`}
					value={state.description}
					onChange={(e) => onChange({ description: e.target.value })}
					placeholder="Brief description of this ticket type"
					disabled={isSaving}
				/>
			</div>

			<ColorPicker
				value={state.embedColor}
				onChange={(embedColor) => onChange({ embedColor })}
				label="Embed Color"
				disabled={isSaving}
			/>

			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={state.isDefault}
					onChange={(e) => onChange({ isDefault: e.target.checked })}
					disabled={isSaving}
				/>
				Default type (pre-selected for new tickets)
			</label>

			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={state.isActive}
					onChange={(e) => onChange({ isActive: e.target.checked })}
					disabled={isSaving}
				/>
				Active (available for users to select)
			</label>

			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={state.pingStaffOnCreate}
					onChange={(e) => onChange({ pingStaffOnCreate: e.target.checked })}
					disabled={isSaving}
				/>
				Ping staff when a ticket of this type is created
			</label>

			<div>
				<h4 className="text-sm font-medium mb-2">Custom Fields</h4>
				<FieldBuilder
					fields={state.customFields}
					onChange={(customFields) => onChange({ customFields })}
					maxFields={5}
					disabled={isSaving}
				/>
			</div>

			<div className="flex items-center gap-2 justify-end pt-2">
				<Button variant="ghost" onClick={onCancel} disabled={isSaving}>
					Cancel
				</Button>
				<Button onClick={onSave} disabled={!state.displayName.trim() || isSaving}>
					{isSaving ? "Saving..." : saveLabel}
				</Button>
			</div>
		</div>
	);
}

function SortableTypeCard({
	type,
	guildId,
	onDelete,
}: {
	type: CustomTicketType;
	guildId: string;
	onDelete: (type: CustomTicketType) => void;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [editor, setEditor] = useState<TypeEditorState>(() => fromType(type));
	const updateType = useUpdateTicketType(guildId);
	const updateFields = useUpdateTicketTypeFields(guildId);

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: type.typeId,
	});

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.6 : 1,
		scale: isDragging ? "1.02" : undefined,
		boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.15)" : undefined,
		zIndex: isDragging ? 10 : undefined,
	};

	useEffect(() => {
		if (!isExpanded) {
			setEditor(fromType(type));
		}
	}, [type, isExpanded]);

	const handleSave = useCallback(() => {
		updateType.mutate(
			{
				typeId: type.typeId,
				displayName: editor.displayName,
				emoji: editor.emoji || null,
				embedColor: editor.embedColor,
				description: editor.description || null,
				isDefault: editor.isDefault,
				isActive: editor.isActive,
				pingStaffOnCreate: editor.pingStaffOnCreate,
			},
			{
				onSuccess: () => {
					updateFields.mutate(
						{ typeId: type.typeId, customFields: editor.customFields },
						{ onSuccess: () => setIsExpanded(false) },
					);
				},
			},
		);
	}, [type.typeId, editor, updateType, updateFields]);

	const handleCancel = useCallback(() => {
		setEditor(fromType(type));
		setIsExpanded(false);
	}, [type]);

	return (
		<div ref={setNodeRef} style={style} className="rounded-lg border border-border overflow-hidden">
			<div className="flex items-center gap-2 px-4 py-3 bg-card">
				{/* Drag handle */}
				<button
					type="button"
					aria-label={`Drag to reorder ${type.displayName}`}
					className="p-1 rounded hover:bg-muted text-muted-foreground cursor-grab active:cursor-grabbing touch-none"
					{...attributes}
					{...listeners}
				>
					<GripVertical className="h-4 w-4" />
				</button>
				{type.embedColor && (
					<span
						className="h-3 w-3 rounded-full flex-shrink-0"
						style={{ backgroundColor: type.embedColor }}
					/>
				)}
				{type.emoji && <span className="text-lg">{type.emoji}</span>}
				<span className="font-medium text-sm flex-1 truncate">{type.displayName}</span>
				{(type.customFields?.length ?? 0) > 0 && (
					<span className="text-xs text-muted-foreground">
						{type.customFields?.length ?? 0} field
						{(type.customFields?.length ?? 0) !== 1 ? "s" : ""}
					</span>
				)}
				{type.isDefault && (
					<span className="inline-flex items-center gap-1 text-xs text-primary">
						<Star className="h-3 w-3" />
						Default
					</span>
				)}
				<button
					type="button"
					aria-label={isExpanded ? `Collapse ${type.displayName}` : `Edit ${type.displayName}`}
					onClick={() => setIsExpanded(!isExpanded)}
					className="p-1 rounded hover:bg-muted text-muted-foreground"
				>
					<Pencil className="h-3.5 w-3.5" />
				</button>
				<button
					type="button"
					aria-label={`Delete ${type.displayName}`}
					onClick={() => onDelete(type)}
					className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
				>
					<Trash2 className="h-3.5 w-3.5" />
				</button>
			</div>

			{isExpanded && (
				<TypeEditor
					state={editor}
					onChange={(update) => setEditor((prev) => ({ ...prev, ...update }))}
					onSave={handleSave}
					onCancel={handleCancel}
					isSaving={updateType.isPending || updateFields.isPending}
					saveLabel="Save Changes"
				/>
			)}
		</div>
	);
}

function SkeletonTypes() {
	return (
		<div className="space-y-3 animate-pulse">
			{[0, 1, 2].map((i) => (
				<div key={`skel-type-${i}`} className="rounded-lg border border-border bg-card p-4">
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

export function TicketTypesTab({ guildId }: TicketTypesTabProps) {
	const { data: types = [], isLoading } = useTicketTypes(guildId);
	const createType = useCreateTicketType(guildId);
	const deleteType = useDeleteTicketType(guildId);
	const reorderTypes = useReorderTicketTypes(guildId);

	const [isAdding, setIsAdding] = useState(false);
	const [newType, setNewType] = useState<TypeEditorState>(emptyEditor);
	const [deleteTarget, setDeleteTarget] = useState<CustomTicketType | null>(null);

	const sorted = useMemo(() => [...types].sort((a, b) => a.sortOrder - b.sortOrder), [types]);
	const sortedIds = useMemo(() => sorted.map((t) => t.typeId), [sorted]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor),
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			const { active, over } = event;
			if (!over || active.id === over.id) return;
			const oldIndex = sorted.findIndex((t) => t.typeId === active.id);
			const newIndex = sorted.findIndex((t) => t.typeId === over.id);
			if (oldIndex === -1 || newIndex === -1) return;
			const reordered = arrayMove(sorted, oldIndex, newIndex);
			reorderTypes.mutate(reordered.map((t) => t.typeId));
		},
		[sorted, reorderTypes],
	);

	const handleCreate = useCallback(() => {
		createType.mutate(
			{
				displayName: newType.displayName,
				emoji: newType.emoji || undefined,
				embedColor: newType.embedColor ?? undefined,
				description: newType.description || undefined,
				isDefault: newType.isDefault,
				isActive: newType.isActive,
				pingStaffOnCreate: newType.pingStaffOnCreate,
				customFields: newType.customFields,
			},
			{
				onSuccess: () => {
					setIsAdding(false);
					setNewType(emptyEditor());
				},
			},
		);
	}, [newType, createType]);

	const handleConfirmDelete = useCallback(() => {
		if (!deleteTarget) return;
		deleteType.mutate(deleteTarget.typeId, {
			onSuccess: () => setDeleteTarget(null),
		});
	}, [deleteTarget, deleteType]);

	if (isLoading) return <SkeletonTypes />;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{types.length} ticket type{types.length !== 1 ? "s" : ""}
				</p>
				{!isAdding && (
					<Button variant="outline" onClick={() => setIsAdding(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Type
					</Button>
				)}
			</div>

			{isAdding && (
				<div className="rounded-lg border border-primary/50 overflow-visible">
					<div className="px-4 py-3 bg-primary/5 text-sm font-medium">New Ticket Type</div>
					<TypeEditor
						state={newType}
						onChange={(update) => setNewType((prev) => ({ ...prev, ...update }))}
						onSave={handleCreate}
						onCancel={() => {
							setIsAdding(false);
							setNewType(emptyEditor());
						}}
						isSaving={createType.isPending}
						saveLabel="Create Type"
					/>
				</div>
			)}

			{sorted.length === 0 && !isAdding ? (
				<div className="text-center py-12 border border-dashed border-border rounded-lg">
					<p className="text-muted-foreground mb-3">No ticket types configured</p>
					<Button variant="outline" onClick={() => setIsAdding(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Create Your First Type
					</Button>
				</div>
			) : (
				<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
						<div className="space-y-3">
							{sorted.map((type) => (
								<SortableTypeCard
									key={type.typeId}
									type={type}
									guildId={guildId}
									onDelete={setDeleteTarget}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			)}

			<ConfirmDialog
				open={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				title="Delete Ticket Type"
				description={`Delete "${deleteTarget?.displayName}"? This will not affect existing tickets.`}
				confirmLabel="Delete"
				variant="destructive"
				isLoading={deleteType.isPending}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
