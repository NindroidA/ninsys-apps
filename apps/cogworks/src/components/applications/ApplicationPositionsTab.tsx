import { FieldBuilder } from "@/components/forms/FieldBuilder";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmojiPicker } from "@/components/ui/EmojiPicker";
import {
	useCreatePosition,
	useDeletePosition,
	usePositions,
	useTogglePosition,
	useUpdatePosition,
	useUpdatePositionFields,
} from "@/hooks/useApplications";
import type { Position, PositionTemplate } from "@/types/applications";
import type { CustomField } from "@/types/tickets";
import { Button, Input } from "@ninsys/ui/components";
import { StaggerContainer } from "@ninsys/ui/components/animations";
import { ChevronDown, FileText, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

interface ApplicationPositionsTabProps {
	guildId: string;
}

interface PositionEditorState {
	title: string;
	description: string;
	emoji: string;
	ageGate: boolean;
	fields: CustomField[];
}

function emptyEditor(): PositionEditorState {
	return {
		title: "",
		description: "",
		emoji: "",
		ageGate: false,
		fields: [],
	};
}

function fromPosition(pos: Position): PositionEditorState {
	return {
		title: pos.title,
		description: pos.description ?? "",
		emoji: pos.emoji ?? "",
		ageGate: pos.ageGateEnabled,
		fields: [...pos.customFields],
	};
}

const TEMPLATES: Record<
	PositionTemplate,
	{ title: string; description: string; fields: CustomField[] }
> = {
	general: {
		title: "General Application",
		description: "Apply to join our community",
		fields: [
			{
				label: "Why do you want to join?",
				placeholder: "",
				style: "paragraph",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Tell us about yourself",
				placeholder: "",
				style: "paragraph",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "How did you find us?",
				placeholder: "",
				style: "short",
				required: false,
				minLength: null,
				maxLength: null,
			},
		],
	},
	staff: {
		title: "Staff Application",
		description: "Apply for a staff position",
		fields: [
			{
				label: "What position are you applying for?",
				placeholder: "",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Relevant experience",
				placeholder: "",
				style: "paragraph",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Availability (hours/week)",
				placeholder: "",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Why should we pick you?",
				placeholder: "",
				style: "paragraph",
				required: true,
				minLength: null,
				maxLength: null,
			},
		],
	},
	"content-creator": {
		title: "Content Creator Application",
		description: "Apply as a content creator",
		fields: [
			{
				label: "Platform(s) you create on",
				placeholder: "e.g. YouTube, Twitch, TikTok",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Content type / niche",
				placeholder: "",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Audience size",
				placeholder: "e.g. 5K subscribers",
				style: "short",
				required: false,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Link to your content",
				placeholder: "",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
		],
	},
	developer: {
		title: "Developer Application",
		description: "Apply as a developer",
		fields: [
			{
				label: "Languages & technologies",
				placeholder: "e.g. TypeScript, React, Node.js",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Years of experience",
				placeholder: "",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "Portfolio / GitHub",
				placeholder: "",
				style: "short",
				required: false,
				minLength: null,
				maxLength: null,
			},
			{
				label: "What would you like to work on?",
				placeholder: "",
				style: "paragraph",
				required: true,
				minLength: null,
				maxLength: null,
			},
		],
	},
	partnership: {
		title: "Partnership Application",
		description: "Apply for a partnership",
		fields: [
			{
				label: "Organization / server name",
				placeholder: "",
				style: "short",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "What is your proposal?",
				placeholder: "",
				style: "paragraph",
				required: true,
				minLength: null,
				maxLength: null,
			},
			{
				label: "How does this benefit both sides?",
				placeholder: "",
				style: "paragraph",
				required: true,
				minLength: null,
				maxLength: null,
			},
		],
	},
};

const TEMPLATE_OPTIONS: { value: PositionTemplate; label: string }[] = [
	{ value: "general", label: "General" },
	{ value: "staff", label: "Staff" },
	{ value: "content-creator", label: "Content Creator" },
	{ value: "developer", label: "Developer" },
	{ value: "partnership", label: "Partnership" },
];

function PositionEditor({
	state,
	onChange,
	onSave,
	onCancel,
	isSaving,
	saveLabel,
}: {
	state: PositionEditorState;
	onChange: (update: Partial<PositionEditorState>) => void;
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
					<label htmlFor={`${id}-title`} className="text-sm font-medium mb-1.5 block">
						Title
					</label>
					<Input
						id={`${id}-title`}
						value={state.title}
						onChange={(e) => onChange({ title: e.target.value })}
						placeholder="e.g. Staff Application"
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
					placeholder="Brief description of this position"
					disabled={isSaving}
				/>
			</div>

			<label className="flex items-center gap-2 text-sm">
				<input
					type="checkbox"
					checked={state.ageGate}
					onChange={(e) => onChange({ ageGate: e.target.checked })}
					disabled={isSaving}
				/>
				Require age verification before applying
			</label>

			<div>
				<h4 className="text-sm font-medium mb-2">Application Fields</h4>
				<FieldBuilder
					fields={state.fields}
					onChange={(fields) => onChange({ fields })}
					maxFields={5}
					disabled={isSaving}
				/>
			</div>

			<div className="flex items-center gap-2 justify-end pt-2">
				<Button variant="ghost" onClick={onCancel} disabled={isSaving}>
					Cancel
				</Button>
				<Button onClick={onSave} disabled={!state.title.trim() || isSaving}>
					{isSaving ? "Saving..." : saveLabel}
				</Button>
			</div>
		</div>
	);
}

function PositionCard({
	position,
	guildId,
	onDelete,
}: {
	position: Position;
	guildId: string;
	onDelete: (pos: Position) => void;
}) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [editor, setEditor] = useState<PositionEditorState>(() => fromPosition(position));
	const updatePosition = useUpdatePosition(guildId);
	const updateFields = useUpdatePositionFields(guildId);
	const togglePosition = useTogglePosition(guildId);

	useEffect(() => {
		if (!isExpanded) {
			setEditor(fromPosition(position));
		}
	}, [position, isExpanded]);

	const handleSave = useCallback(() => {
		updatePosition.mutate(
			{
				positionId: position.id,
				title: editor.title,
				emoji: editor.emoji || null,
				description: editor.description || null,
				ageGateEnabled: editor.ageGate,
			},
			{
				onSuccess: () => {
					updateFields.mutate(
						{ positionId: position.id, fields: editor.fields },
						{ onSuccess: () => setIsExpanded(false) },
					);
				},
			},
		);
	}, [position.id, editor, updatePosition, updateFields]);

	const handleCancel = useCallback(() => {
		setEditor(fromPosition(position));
		setIsExpanded(false);
	}, [position]);

	const handleToggle = useCallback(() => {
		togglePosition.mutate(position.id);
	}, [position.id, togglePosition]);

	return (
		<div className="rounded-lg border border-border overflow-visible">
			<div className="flex items-center gap-3 px-4 py-3 bg-card">
				{position.emoji && <span className="text-lg">{position.emoji}</span>}
				<span className="font-medium text-sm flex-1 truncate">{position.title}</span>
				{position.customFields.length > 0 && (
					<span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
						<FileText className="h-3 w-3" />
						{position.customFields.length} field
						{position.customFields.length !== 1 ? "s" : ""}
					</span>
				)}
				{position.ageGateEnabled && (
					<span className="inline-flex items-center gap-1 text-xs text-warning">
						<ShieldCheck className="h-3 w-3" />
						Age Gate
					</span>
				)}
				<button
					type="button"
					onClick={handleToggle}
					disabled={togglePosition.isPending}
					title={position.isActive ? "Click to disable" : "Click to enable"}
					className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border ${
						position.isActive
							? "bg-success/10 text-success border-success/30 hover:bg-success/20 hover:border-success/50 hover:scale-105"
							: "bg-muted text-muted-foreground border-border hover:bg-muted/80 hover:border-muted-foreground/30 hover:scale-105"
					} ${togglePosition.isPending ? "opacity-50 cursor-wait" : ""}`}
				>
					{position.isActive ? "Enabled" : "Disabled"}
				</button>
				<button
					type="button"
					aria-label={isExpanded ? `Collapse ${position.title}` : `Edit ${position.title}`}
					onClick={() => setIsExpanded(!isExpanded)}
					className="p-1 rounded hover:bg-muted text-muted-foreground"
				>
					<Pencil className="h-3.5 w-3.5" />
				</button>
				<button
					type="button"
					aria-label={`Delete ${position.title}`}
					onClick={() => onDelete(position)}
					className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
				>
					<Trash2 className="h-3.5 w-3.5" />
				</button>
			</div>

			{isExpanded && (
				<PositionEditor
					state={editor}
					onChange={(update) => setEditor((prev) => ({ ...prev, ...update }))}
					onSave={handleSave}
					onCancel={handleCancel}
					isSaving={updatePosition.isPending || updateFields.isPending}
					saveLabel="Save Changes"
				/>
			)}
		</div>
	);
}

function SkeletonPositions() {
	return (
		<div className="space-y-3 animate-pulse">
			{[0, 1, 2].map((i) => (
				<div key={`skel-pos-${i}`} className="rounded-lg border border-border bg-card p-4">
					<div className="flex items-center gap-3">
						<div className="h-5 w-5 rounded bg-muted" />
						<div className="h-4 w-36 rounded bg-muted" />
						<div className="flex-1" />
						<div className="h-4 w-16 rounded bg-muted" />
					</div>
				</div>
			))}
		</div>
	);
}

export function ApplicationPositionsTab({ guildId }: ApplicationPositionsTabProps) {
	const { data: positions = [], isLoading } = usePositions(guildId);
	const createPosition = useCreatePosition(guildId);
	const deletePosition = useDeletePosition(guildId);

	const [isAdding, setIsAdding] = useState(false);
	const [newPosition, setNewPosition] = useState<PositionEditorState>(emptyEditor);
	const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);
	const [showTemplates, setShowTemplates] = useState(false);

	const handleCreate = useCallback(() => {
		createPosition.mutate(
			{
				title: newPosition.title,
				emoji: newPosition.emoji || undefined,
				description: newPosition.description || undefined,
				ageGateEnabled: newPosition.ageGate,
				customFields: newPosition.fields,
			},
			{
				onSuccess: () => {
					setIsAdding(false);
					setNewPosition(emptyEditor());
				},
			},
		);
	}, [newPosition, createPosition]);

	const handleConfirmDelete = useCallback(() => {
		if (!deleteTarget) return;
		deletePosition.mutate(deleteTarget.id, {
			onSuccess: () => setDeleteTarget(null),
		});
	}, [deleteTarget, deletePosition]);

	const handleSelectTemplate = useCallback((template: PositionTemplate) => {
		const t = TEMPLATES[template];
		setNewPosition({
			title: t.title,
			description: t.description,
			emoji: "",
			ageGate: false,
			fields: [...t.fields],
		});
		setIsAdding(true);
		setShowTemplates(false);
	}, []);

	const sorted = useMemo(
		() => [...positions].sort((a, b) => a.displayOrder - b.displayOrder),
		[positions],
	);

	if (isLoading) return <SkeletonPositions />;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{positions.length} position{positions.length !== 1 ? "s" : ""}
				</p>
				{!isAdding && (
					<div className="flex items-center gap-2">
						<div className="relative">
							<Button variant="outline" onClick={() => setShowTemplates(!showTemplates)}>
								Use Template
								<ChevronDown className="h-4 w-4 ml-1" />
							</Button>
							{showTemplates && (
								<>
									<div
										className="fixed inset-0 z-10"
										role="presentation"
										onClick={() => setShowTemplates(false)}
										onKeyDown={(e) => {
											if (e.key === "Escape") setShowTemplates(false);
										}}
									/>
									<div className="absolute right-0 mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-20 py-1">
										{TEMPLATE_OPTIONS.map((opt) => (
											<button
												key={opt.value}
												type="button"
												onClick={() => handleSelectTemplate(opt.value)}
												className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
											>
												{opt.label}
											</button>
										))}
									</div>
								</>
							)}
						</div>
						<Button variant="outline" onClick={() => setIsAdding(true)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Position
						</Button>
					</div>
				)}
			</div>

			{isAdding && (
				<div className="rounded-lg border border-primary/50 overflow-visible">
					<div className="px-4 py-3 bg-primary/5 text-sm font-medium">New Position</div>
					<PositionEditor
						state={newPosition}
						onChange={(update) => setNewPosition((prev) => ({ ...prev, ...update }))}
						onSave={handleCreate}
						onCancel={() => {
							setIsAdding(false);
							setNewPosition(emptyEditor());
						}}
						isSaving={createPosition.isPending}
						saveLabel="Create Position"
					/>
				</div>
			)}

			{sorted.length === 0 && !isAdding ? (
				<div className="text-center py-12 border border-dashed border-border rounded-lg">
					<p className="text-muted-foreground mb-3">No positions configured</p>
					<Button variant="outline" onClick={() => setIsAdding(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Create Your First Position
					</Button>
				</div>
			) : (
				<StaggerContainer className="space-y-3">
					{sorted.map((pos) => (
						<PositionCard
							key={pos.id}
							position={pos}
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
				title="Delete Position"
				description={`Delete "${deleteTarget?.title}"? Active applications for this position will not be affected.`}
				confirmLabel="Delete"
				variant="destructive"
				isLoading={deletePosition.isPending}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
