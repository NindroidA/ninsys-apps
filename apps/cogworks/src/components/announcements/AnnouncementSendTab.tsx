import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmojiTextarea } from "@/components/ui/EmojiTextarea";
import { Select } from "@/components/ui/Select";
import { useSendAnnouncement } from "@/hooks/useAnnouncements";
import type { AnnouncementPayload, AnnouncementType } from "@/types/announcements";
import { Button, Card, Input } from "@ninsys/ui/components";
import { Loader2, Megaphone } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

interface AnnouncementSendTabProps {
	guildId: string;
	defaultChannelId: string | null;
}

interface FormState {
	type: AnnouncementType;
	channelId: string | null;
	scheduledTime: string;
	duration: string;
	version: string;
	customMessage: string;
}

const TYPE_OPTIONS: {
	value: AnnouncementType;
	label: string;
	description: string;
}[] = [
	{
		value: "maintenance_short",
		label: "Short Maintenance",
		description: "Brief maintenance (< 1 hour)",
	},
	{
		value: "maintenance_long",
		label: "Extended Maintenance",
		description: "Long maintenance with scheduled time",
	},
	{
		value: "update_scheduled",
		label: "Scheduled Update",
		description: "Upcoming update announcement",
	},
	{
		value: "update_complete",
		label: "Update Complete",
		description: "Update has been deployed",
	},
	{
		value: "back_online",
		label: "Back Online",
		description: "Service restored",
	},
];

const TYPE_CONFIG: Record<
	AnnouncementType,
	{
		fields: ("scheduledTime" | "duration" | "version")[];
		color: string;
		title: string;
	}
> = {
	maintenance_short: {
		fields: ["duration"],
		color: "oklch(0.75 0.15 85)",
		title: "Scheduled Maintenance",
	},
	maintenance_long: {
		fields: ["scheduledTime", "duration"],
		color: "oklch(0.75 0.15 85)",
		title: "Extended Maintenance",
	},
	update_scheduled: {
		fields: ["scheduledTime", "version"],
		color: "oklch(0.7 0.17 145)",
		title: "Scheduled Update",
	},
	update_complete: {
		fields: ["version"],
		color: "oklch(0.7 0.17 145)",
		title: "Update Complete",
	},
	back_online: {
		fields: [],
		color: "oklch(0.65 0.18 230)",
		title: "Back Online",
	},
};

function buildDefaultForm(defaultChannelId: string | null): FormState {
	return {
		type: "maintenance_short",
		channelId: defaultChannelId,
		scheduledTime: "",
		duration: "",
		version: "",
		customMessage: "",
	};
}

export function AnnouncementSendTab({ guildId, defaultChannelId }: AnnouncementSendTabProps) {
	const sendAnnouncement = useSendAnnouncement(guildId);
	const [form, setForm] = useState<FormState>(() => buildDefaultForm(defaultChannelId));
	const [showConfirm, setShowConfirm] = useState(false);

	// Sync default channel when config loads after mount
	useEffect(() => {
		if (defaultChannelId) {
			setForm((prev) =>
				prev.channelId === null ? { ...prev, channelId: defaultChannelId } : prev,
			);
		}
	}, [defaultChannelId]);

	const channelId = useId();
	const scheduledTimeId = useId();
	const durationId = useId();
	const versionId = useId();
	const messageId = useId();

	const typeConfig = TYPE_CONFIG[form.type];
	const showScheduledTime = typeConfig.fields.includes("scheduledTime");
	const showDuration = typeConfig.fields.includes("duration");
	const showVersion = typeConfig.fields.includes("version");

	const isValid = form.channelId !== null;

	const handleSend = useCallback(() => {
		if (!form.channelId) return;

		const payload: AnnouncementPayload = {
			type: form.type,
			channelId: form.channelId,
		};

		if (showScheduledTime && form.scheduledTime) {
			payload.scheduledTime = new Date(form.scheduledTime).toISOString();
		}
		if (showDuration && form.duration) {
			payload.duration = form.duration;
		}
		if (showVersion && form.version) {
			payload.version = form.version;
		}
		if (form.customMessage.trim()) {
			payload.customMessage = form.customMessage.trim();
		}

		sendAnnouncement.mutate(payload, {
			onSuccess: () => {
				setForm(buildDefaultForm(defaultChannelId));
				setShowConfirm(false);
			},
			onError: () => {
				setShowConfirm(false);
			},
		});
	}, [form, defaultChannelId, sendAnnouncement, showScheduledTime, showDuration, showVersion]);

	const buildPreviewDescription = useCallback(() => {
		const parts: string[] = [];

		if (showDuration && form.duration) {
			parts.push(`Duration: ${form.duration}`);
		}
		if (showScheduledTime && form.scheduledTime) {
			parts.push(`Scheduled: ${new Date(form.scheduledTime).toLocaleString()}`);
		}
		if (showVersion && form.version) {
			parts.push(`Version: ${form.version}`);
		}
		if (form.customMessage.trim()) {
			parts.push(form.customMessage.trim());
		}

		return parts.length > 0 ? parts.join("\n") : "No details provided yet";
	}, [form, showDuration, showScheduledTime, showVersion]);

	return (
		<div className="grid lg:grid-cols-[1fr_380px] gap-6">
			{/* Composer Form */}
			<div className="space-y-6 max-w-2xl">
				<Card className="p-6 space-y-5">
					{/* Type Selector */}
					<Select
						value={form.type}
						onChange={(v) =>
							setForm((prev) => ({
								...prev,
								type: v as AnnouncementType,
								scheduledTime: "",
								duration: "",
								version: "",
							}))
						}
						options={TYPE_OPTIONS.map((opt) => ({
							value: opt.value,
							label: opt.label,
							description: opt.description,
						}))}
						label="Announcement Type"
					/>

					{/* Channel */}
					<div>
						<label htmlFor={channelId} className="block text-sm font-medium mb-2">
							Channel
						</label>
						<ChannelPicker
							guildId={guildId}
							value={form.channelId}
							onChange={(ch) => setForm((prev) => ({ ...prev, channelId: ch }))}
							filter="text"
							placeholder="Select announcement channel"
							clearable
						/>
					</div>

					{/* Dynamic Fields */}
					{showScheduledTime && (
						<div>
							<label htmlFor={scheduledTimeId} className="block text-sm font-medium mb-2">
								Scheduled Time
							</label>
							<Input
								id={scheduledTimeId}
								type="datetime-local"
								value={form.scheduledTime}
								onChange={(e) =>
									setForm((prev) => ({
										...prev,
										scheduledTime: e.target.value,
									}))
								}
							/>
						</div>
					)}

					{showDuration && (
						<div>
							<label htmlFor={durationId} className="block text-sm font-medium mb-2">
								Duration
							</label>
							<Input
								id={durationId}
								type="text"
								placeholder="e.g., 30 minutes"
								value={form.duration}
								onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
							/>
						</div>
					)}

					{showVersion && (
						<div>
							<label htmlFor={versionId} className="block text-sm font-medium mb-2">
								Version
							</label>
							<Input
								id={versionId}
								type="text"
								placeholder="e.g., v2.1.0"
								value={form.version}
								onChange={(e) => setForm((prev) => ({ ...prev, version: e.target.value }))}
							/>
						</div>
					)}

					{/* Custom Message */}
					<div>
						<label htmlFor={messageId} className="block text-sm font-medium mb-2">
							Custom Message <span className="text-muted-foreground font-normal">(optional)</span>
						</label>
						<EmojiTextarea
							id={messageId}
							rows={4}
							placeholder="Additional details..."
							value={form.customMessage}
							onChange={(v) => setForm((prev) => ({ ...prev, customMessage: v }))}
						/>
					</div>

					{/* Send Button */}
					<Button
						variant="primary"
						className="w-full"
						disabled={!isValid || sendAnnouncement.isPending}
						onClick={() => setShowConfirm(true)}
					>
						{sendAnnouncement.isPending ? (
							<>
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
								Sending...
							</>
						) : (
							<>
								<Megaphone className="h-4 w-4 mr-2" />
								Send Announcement
							</>
						)}
					</Button>
				</Card>
			</div>

			{/* Preview */}
			<div className="space-y-3">
				<h3 className="text-sm font-medium text-muted-foreground">Preview</h3>
				<AnnouncementPreview
					title={typeConfig.title}
					description={buildPreviewDescription()}
					color={typeConfig.color}
					type={form.type}
				/>
			</div>

			{/* Confirm Dialog */}
			<ConfirmDialog
				open={showConfirm}
				onOpenChange={setShowConfirm}
				onConfirm={handleSend}
				title="Send Announcement"
				description="This will send the announcement to the selected channel. This action cannot be undone."
				confirmLabel="Send"
				isLoading={sendAnnouncement.isPending}
			/>
		</div>
	);
}

// --- Preview Component ---

function AnnouncementPreview({
	title,
	description,
	color,
	type,
}: {
	title: string;
	description: string;
	color: string;
	type: AnnouncementType;
}) {
	const emoji = getTypeEmoji(type);

	return (
		<Card className="overflow-visible">
			{/* Discord-style embed */}
			<div className="flex">
				<div className="w-1 flex-shrink-0 rounded-l" style={{ backgroundColor: color }} />
				<div className="p-4 flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-lg">{emoji}</span>
						<h4 className="font-semibold text-sm">{title}</h4>
					</div>
					<p className="text-sm text-muted-foreground whitespace-pre-line break-words">
						{description}
					</p>
					<div className="mt-3 pt-2 border-t border-border flex items-center gap-2">
						<div className="h-4 w-4 rounded-full bg-primary/20" />
						<span className="text-xs text-muted-foreground">
							Cogworks Bot • {new Date().toLocaleDateString()}
						</span>
					</div>
				</div>
			</div>
		</Card>
	);
}

function getTypeEmoji(type: AnnouncementType): string {
	switch (type) {
		case "maintenance_short":
		case "maintenance_long":
			return "🔧";
		case "update_scheduled":
			return "📅";
		case "update_complete":
			return "🚀";
		case "back_online":
			return "✅";
	}
}
