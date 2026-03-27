import { ColorPicker } from "@/components/discord/ColorPicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmojiTextarea } from "@/components/ui/EmojiTextarea";
import {
	useAnnouncementTemplates,
	useCreateAnnouncementTemplate,
	useDeleteAnnouncementTemplate,
} from "@/hooks/useAnnouncements";
import type { AnnouncementTemplate } from "@/types/announcements";
import { Badge, Button, Card, Input } from "@ninsys/ui/components";
import { Eye, Plus, Trash2 } from "lucide-react";
import { useCallback, useId, useState } from "react";

interface AnnouncementTemplatesTabProps {
	guildId: string;
}

const MAX_TEMPLATES = 25;

const PLACEHOLDERS = [
	{ key: "{version}", desc: "Version number" },
	{ key: "{duration}", desc: "Maintenance duration" },
	{ key: "{time}", desc: "Timestamp (Discord format)" },
	{ key: "{time_relative}", desc: "Relative time" },
	{ key: "{user}", desc: "Current user mention" },
	{ key: "{role}", desc: "Announcement role" },
	{ key: "{server}", desc: "Server name" },
	{ key: "{channel}", desc: "Channel mention" },
];

interface TemplateFormState {
	name: string;
	displayName: string;
	title: string;
	body: string;
	color: string;
	description: string;
	footerText: string;
	showTimestamp: boolean;
	mentionRole: boolean;
}

const EMPTY_FORM: TemplateFormState = {
	name: "",
	displayName: "",
	title: "",
	body: "",
	color: "#5865F2",
	description: "",
	footerText: "",
	showTimestamp: true,
	mentionRole: false,
};

function EmbedPreview({ form }: { form: TemplateFormState }) {
	const previewBody = form.body
		.replace(/\{version\}/g, "1.0.0")
		.replace(/\{duration\}/g, "5-10 minutes")
		.replace(/\{time\}/g, new Date().toLocaleString())
		.replace(/\{time_relative\}/g, "in 5 minutes")
		.replace(/\{user\}/g, "@You")
		.replace(/\{server\}/g, "My Server")
		.replace(/\{role\}/g, "@Announcements")
		.replace(/\{channel\}/g, "#general");

	return (
		<div className="rounded-lg overflow-hidden border border-border">
			<div className="flex">
				<div className="w-1 flex-shrink-0" style={{ backgroundColor: form.color || "#5865F2" }} />
				<div className="p-3 space-y-2 flex-1 bg-muted/20">
					{form.title && <p className="font-semibold text-sm">{form.title}</p>}
					{previewBody && (
						<p className="text-sm text-muted-foreground whitespace-pre-wrap">{previewBody}</p>
					)}
					{form.footerText && (
						<div className="flex items-center gap-2 pt-1 border-t border-border/50">
							<p className="text-[11px] text-muted-foreground">{form.footerText}</p>
							{form.showTimestamp && (
								<p className="text-[11px] text-muted-foreground">• {new Date().toLocaleString()}</p>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export function AnnouncementTemplatesTab({ guildId }: AnnouncementTemplatesTabProps) {
	const { data: templates = [], isLoading } = useAnnouncementTemplates(guildId);
	const createTemplate = useCreateAnnouncementTemplate(guildId);
	const deleteTemplate = useDeleteAnnouncementTemplate(guildId);

	const [isCreating, setIsCreating] = useState(false);
	const [previewTarget, setPreviewTarget] = useState<AnnouncementTemplate | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<AnnouncementTemplate | null>(null);
	const [form, setForm] = useState<TemplateFormState>(EMPTY_FORM);

	const nameId = useId();
	const displayNameId = useId();
	const titleId = useId();

	const atLimit = templates.length >= MAX_TEMPLATES;

	const handleCreate = useCallback(() => {
		if (!form.name.trim() || !form.displayName.trim() || !form.title.trim()) return;
		createTemplate.mutate(
			{
				name: form.name.trim().toLowerCase().replace(/\s+/g, "-"),
				displayName: form.displayName.trim(),
				title: form.title.trim(),
				body: form.body,
				color: form.color,
				description: form.description || null,
				footerText: form.footerText || null,
				showTimestamp: form.showTimestamp,
				mentionRole: form.mentionRole,
				fields: null,
			},
			{
				onSuccess: () => {
					setIsCreating(false);
					setForm(EMPTY_FORM);
				},
			},
		);
	}, [form, createTemplate]);

	const handleDelete = useCallback(() => {
		if (!deleteTarget) return;
		deleteTemplate.mutate(deleteTarget.name, {
			onSuccess: () => setDeleteTarget(null),
		});
	}, [deleteTarget, deleteTemplate]);

	if (isLoading) {
		return (
			<div className="space-y-3 animate-pulse">
				{[0, 1, 2].map((i) => (
					<div key={`skel-tmpl-${i}`} className="h-16 rounded-lg bg-muted" />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{templates.length}/{MAX_TEMPLATES} templates
				</p>
				{!isCreating && (
					<Button variant="outline" onClick={() => setIsCreating(true)} disabled={atLimit}>
						<Plus className="h-4 w-4 mr-2" />
						Create Template
					</Button>
				)}
			</div>

			{/* Create form */}
			{isCreating && (
				<Card className="p-5 space-y-4 border-primary/30">
					<h3 className="text-sm font-semibold">New Template</h3>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label htmlFor={nameId} className="text-sm font-medium mb-1.5 block">
								Name <span className="text-muted-foreground font-normal">(code)</span>
							</label>
							<Input
								id={nameId}
								value={form.name}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
									}))
								}
								placeholder="e.g. server-update"
								maxLength={50}
							/>
						</div>
						<div>
							<label htmlFor={displayNameId} className="text-sm font-medium mb-1.5 block">
								Display Name
							</label>
							<Input
								id={displayNameId}
								value={form.displayName}
								onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
								placeholder="e.g. Server Update"
								maxLength={100}
							/>
						</div>
					</div>

					<div>
						<label htmlFor={titleId} className="text-sm font-medium mb-1.5 block">
							Embed Title
						</label>
						<Input
							id={titleId}
							value={form.title}
							onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
							placeholder="e.g. 🔄 Server Update v{version}"
							maxLength={256}
						/>
					</div>

					<div>
						<label className="text-sm font-medium mb-1.5 block">Embed Body</label>
						<EmojiTextarea
							value={form.body}
							onChange={(v) => setForm((prev) => ({ ...prev, body: v }))}
							placeholder="Write the announcement body... Use {placeholders} for dynamic content"
							rows={5}
							maxLength={4000}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<ColorPicker
							value={form.color}
							onChange={(color) => setForm((prev) => ({ ...prev, color: color ?? "#5865F2" }))}
							label="Embed Color"
						/>
						<div>
							<label className="text-sm font-medium mb-1.5 block">
								Footer Text <span className="text-muted-foreground font-normal">(optional)</span>
							</label>
							<Input
								value={form.footerText}
								onChange={(e) => setForm((prev) => ({ ...prev, footerText: e.target.value }))}
								placeholder="e.g. Cogworks Bot"
								maxLength={256}
							/>
						</div>
					</div>

					<div className="flex items-center gap-6">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={form.showTimestamp}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										showTimestamp: e.target.checked,
									}))
								}
							/>
							Show Timestamp
						</label>
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={form.mentionRole}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										mentionRole: e.target.checked,
									}))
								}
							/>
							Mention Role
						</label>
					</div>

					{/* Placeholder reference */}
					<div className="rounded-lg bg-muted/30 p-3">
						<p className="text-xs font-medium text-muted-foreground mb-2">Available Placeholders</p>
						<div className="flex flex-wrap gap-2">
							{PLACEHOLDERS.map((p) => (
								<span
									key={p.key}
									className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded"
									title={p.desc}
								>
									{p.key}
								</span>
							))}
						</div>
					</div>

					{/* Preview */}
					{(form.title || form.body) && (
						<div>
							<p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
							<EmbedPreview form={form} />
						</div>
					)}

					<div className="flex items-center gap-2 justify-end pt-2">
						<Button
							variant="ghost"
							onClick={() => {
								setIsCreating(false);
								setForm(EMPTY_FORM);
							}}
							disabled={createTemplate.isPending}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreate}
							disabled={
								!form.name.trim() ||
								!form.displayName.trim() ||
								!form.title.trim() ||
								createTemplate.isPending
							}
						>
							{createTemplate.isPending ? "Creating..." : "Create Template"}
						</Button>
					</div>
				</Card>
			)}

			{/* Template list */}
			{templates.length === 0 && !isCreating ? (
				<div className="text-center py-12 border border-dashed border-border rounded-lg">
					<p className="text-muted-foreground mb-3">No templates yet</p>
					<Button variant="outline" onClick={() => setIsCreating(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Create Your First Template
					</Button>
				</div>
			) : (
				<div className="space-y-2">
					{templates.map((tmpl) => (
						<Card key={tmpl.name} className="px-4 py-3">
							<div className="flex items-center gap-3">
								<span
									className="h-3 w-3 rounded-full flex-shrink-0"
									style={{ backgroundColor: tmpl.color }}
								/>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium truncate">{tmpl.displayName}</span>
										{tmpl.isDefault && (
											<Badge variant="outline" className="text-[10px]">
												Default
											</Badge>
										)}
									</div>
									<p className="text-xs text-muted-foreground font-mono">{tmpl.name}</p>
								</div>
								<div className="flex items-center gap-1">
									<button
										type="button"
										onClick={() => setPreviewTarget(tmpl)}
										className="p-1.5 rounded hover:bg-muted text-muted-foreground"
										title="Preview"
									>
										<Eye className="h-3.5 w-3.5" />
									</button>
									{!tmpl.isDefault && (
										<button
											type="button"
											onClick={() => setDeleteTarget(tmpl)}
											className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
											title="Delete"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									)}
								</div>
							</div>
						</Card>
					))}
				</div>
			)}

			{/* Preview modal */}
			{previewTarget && (
				<Card className="p-5 space-y-3 border-primary/20">
					<div className="flex items-center justify-between">
						<h4 className="text-sm font-semibold">Preview: {previewTarget.displayName}</h4>
						<Button variant="ghost" size="sm" onClick={() => setPreviewTarget(null)}>
							Close
						</Button>
					</div>
					<EmbedPreview
						form={{
							name: previewTarget.name,
							displayName: previewTarget.displayName,
							title: previewTarget.title,
							body: previewTarget.body,
							color: previewTarget.color,
							description: previewTarget.description ?? "",
							footerText: previewTarget.footerText ?? "",
							showTimestamp: previewTarget.showTimestamp,
							mentionRole: previewTarget.mentionRole,
						}}
					/>
				</Card>
			)}

			{/* Delete confirmation */}
			<ConfirmDialog
				open={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				title="Delete Template"
				description={`Delete "${deleteTarget?.displayName}"? This cannot be undone.`}
				confirmLabel="Delete"
				variant="destructive"
				isLoading={deleteTemplate.isPending}
				onConfirm={handleDelete}
			/>
		</div>
	);
}
