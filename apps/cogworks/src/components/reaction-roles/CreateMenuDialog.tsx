import { ChannelPicker } from "@/components/discord/ChannelPicker";
import { useCreateReactionRoleMenu } from "@/hooks/useReactionRoles";
import type { ReactionRoleMode } from "@/types/reaction-roles";
import { Button, Card, Input } from "@ninsys/ui/components";
import { useCallback, useId, useState } from "react";
import { MODE_INFO } from "./constants";

export function CreateMenuDialog({
	guildId,
	onCreated,
	onCancel,
}: {
	guildId: string;
	onCreated: (menuId: string) => void;
	onCancel: () => void;
}) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [channelId, setChannelId] = useState<string | null>(null);
	const [mode, setMode] = useState<ReactionRoleMode>("normal");
	const createMenu = useCreateReactionRoleMenu(guildId);

	const nameId = useId();
	const descId = useId();

	const handleCreate = useCallback(() => {
		if (!name.trim()) return;
		createMenu.mutate(
			{
				name: name.trim(),
				description: description.trim() || undefined,
				channelId: channelId ?? undefined,
				mode,
			},
			{
				onSuccess: (data) => {
					if (data?.id) onCreated(data.id);
				},
			},
		);
	}, [name, description, channelId, mode, createMenu, onCreated]);

	return (
		<Card className="overflow-visible border-primary/50">
			<div className="px-4 py-3 bg-primary/5 text-sm font-medium">Create Reaction Role Menu</div>
			<div className="p-4 space-y-4">
				<div>
					<label htmlFor={nameId} className="text-sm font-medium mb-1.5 block">
						Name
					</label>
					<Input
						id={nameId}
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="e.g. Color Roles"
						disabled={createMenu.isPending}
					/>
				</div>

				<div>
					<label htmlFor={descId} className="text-sm font-medium mb-1.5 block">
						Description <span className="text-muted-foreground font-normal">(optional)</span>
					</label>
					<Input
						id={descId}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Pick your favorite color role"
						disabled={createMenu.isPending}
					/>
				</div>

				<ChannelPicker
					guildId={guildId}
					value={channelId}
					onChange={setChannelId}
					filter="text"
					label="Target Channel"
					placeholder="Select channel for the role menu message"
					clearable
					disabled={createMenu.isPending}
				/>

				<div>
					<p className="text-sm font-medium mb-2">Mode</p>
					<div className="space-y-2">
						{(
							Object.entries(MODE_INFO) as [
								ReactionRoleMode,
								{ label: string; description: string },
							][]
						).map(([key, info]) => (
							<label
								key={key}
								className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
									mode === key ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
								}`}
							>
								<input
									type="radio"
									name="mode"
									value={key}
									checked={mode === key}
									onChange={() => setMode(key)}
									className="mt-0.5"
									disabled={createMenu.isPending}
								/>
								<div>
									<span className="text-sm font-medium">{info.label}</span>
									<p className="text-xs text-muted-foreground">{info.description}</p>
								</div>
							</label>
						))}
					</div>
				</div>

				<div className="flex items-center gap-2 justify-end">
					<Button variant="ghost" onClick={onCancel} disabled={createMenu.isPending}>
						Cancel
					</Button>
					<Button onClick={handleCreate} disabled={!name.trim() || createMenu.isPending}>
						{createMenu.isPending ? "Creating..." : "Create Menu"}
					</Button>
				</div>
			</div>
		</Card>
	);
}
