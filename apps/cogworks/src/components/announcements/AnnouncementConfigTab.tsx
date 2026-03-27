import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { RolePicker } from "@/components/discord/RolePicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { SaveBar } from "@/components/forms/SaveBar";
import { SkeletonConfigTab } from "@/components/ui/LoadingSkeleton";
import { useAnnouncementConfig, useUpdateAnnouncementConfig } from "@/hooks/useAnnouncements";
import { deepEqual } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

interface AnnouncementConfigTabProps {
	guildId: string;
}

interface ConfigFormState {
	defaultRoleId: string | null;
	defaultChannelId: string | null;
}

const DEFAULT_STATE: ConfigFormState = {
	defaultRoleId: null,
	defaultChannelId: null,
};

export function AnnouncementConfigTab({ guildId }: AnnouncementConfigTabProps) {
	const { data: config, isLoading } = useAnnouncementConfig(guildId);
	const updateConfig = useUpdateAnnouncementConfig(guildId);

	const [form, setForm] = useState<ConfigFormState>(DEFAULT_STATE);
	const [original, setOriginal] = useState<ConfigFormState>(DEFAULT_STATE);

	useEffect(() => {
		if (config) {
			const state: ConfigFormState = {
				defaultRoleId: config.defaultRoleId,
				defaultChannelId: config.defaultChannelId,
			};
			setForm(state);
			setOriginal(state);
		}
	}, [config]);

	const isDirty = !deepEqual(form, original);

	const handleSave = useCallback(() => {
		updateConfig.mutate(form, {
			onSuccess: () => setOriginal(form),
		});
	}, [form, updateConfig]);

	const handleDiscard = useCallback(() => {
		setForm(original);
	}, [original]);

	if (isLoading) return <SkeletonConfigTab sections={1} />;

	return (
		<div className="space-y-6">
			<ConfigSection
				title="Default Settings"
				description="Configure default values for announcements"
			>
				<RolePicker
					guildId={guildId}
					value={form.defaultRoleId}
					onChange={(value) =>
						setForm((prev) => ({
							...prev,
							defaultRoleId: Array.isArray(value) ? (value[0] ?? null) : value,
						}))
					}
					label="Minecraft Role"
					placeholder="Select role to ping for Minecraft announcements"
					clearable
					disabled={updateConfig.isPending}
				/>
				<ChannelPicker
					guildId={guildId}
					value={form.defaultChannelId}
					onChange={(defaultChannelId) => setForm((prev) => ({ ...prev, defaultChannelId }))}
					filter="text"
					label="Default Channel"
					placeholder="Select default announcement channel"
					clearable
					disabled={updateConfig.isPending}
				/>
			</ConfigSection>

			<SaveBar
				isDirty={isDirty}
				isLoading={updateConfig.isPending}
				onSave={handleSave}
				onDiscard={handleDiscard}
			/>
		</div>
	);
}
