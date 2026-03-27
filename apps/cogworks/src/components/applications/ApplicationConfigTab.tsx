import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { SaveBar } from "@/components/forms/SaveBar";
import { SkeletonConfigTab } from "@/components/ui/LoadingSkeleton";
import { useApplicationConfig, useUpdateApplicationConfig } from "@/hooks/useApplications";
import { deepEqual } from "@/lib/utils";
import type { ApplicationConfig } from "@/types/applications";
import { useCallback, useEffect, useState } from "react";

interface ApplicationConfigTabProps {
	guildId: string;
}

type ConfigFormState = Pick<ApplicationConfig, "channelId" | "categoryId" | "archiveForumId">;

const DEFAULT_STATE: ConfigFormState = {
	channelId: null,
	categoryId: null,
	archiveForumId: null,
};

export function ApplicationConfigTab({ guildId }: ApplicationConfigTabProps) {
	const { data: config, isLoading } = useApplicationConfig(guildId);
	const updateConfig = useUpdateApplicationConfig(guildId);

	const [form, setForm] = useState<ConfigFormState>(DEFAULT_STATE);
	const [original, setOriginal] = useState<ConfigFormState>(DEFAULT_STATE);

	useEffect(() => {
		if (config) {
			const state: ConfigFormState = {
				channelId: config.channelId,
				categoryId: config.categoryId,
				archiveForumId: config.archiveForumId,
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

	if (isLoading) return <SkeletonConfigTab />;

	return (
		<div className="space-y-6">
			<ConfigSection
				title="Channel Settings"
				description="Configure where applications are managed"
			>
				<ChannelPicker
					guildId={guildId}
					value={form.channelId}
					onChange={(channelId) => setForm((prev) => ({ ...prev, channelId }))}
					filter="text"
					label="Application Channel"
					placeholder="Select application channel"
					clearable
					disabled={updateConfig.isPending}
				/>
				<ChannelPicker
					guildId={guildId}
					value={form.categoryId}
					onChange={(categoryId) => setForm((prev) => ({ ...prev, categoryId }))}
					filter="category"
					label="Application Category"
					placeholder="Select application category"
					clearable
					disabled={updateConfig.isPending}
				/>
				<ChannelPicker
					guildId={guildId}
					value={form.archiveForumId}
					onChange={(archiveForumId) => setForm((prev) => ({ ...prev, archiveForumId }))}
					filter="forum"
					label="Archive Forum"
					placeholder="Select archive forum"
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
