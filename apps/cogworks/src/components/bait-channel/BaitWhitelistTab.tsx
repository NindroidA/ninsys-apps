import { RolePicker } from "@/components/discord/RolePicker";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { SaveBar } from "@/components/forms/SaveBar";
import { useBaitChannelWhitelist, useUpdateBaitChannelWhitelist } from "@/hooks/useBaitChannel";
import { deepEqual } from "@/lib/utils";
import { Button, Input } from "@ninsys/ui/components";
import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";

interface BaitWhitelistTabProps {
	guildId: string;
}

export function BaitWhitelistTab({ guildId }: BaitWhitelistTabProps) {
	const { data: whitelist, isLoading } = useBaitChannelWhitelist(guildId);
	const updateWhitelist = useUpdateBaitChannelWhitelist(guildId);

	const [roleIds, setRoleIds] = useState<string[]>([]);
	const [userIds, setUserIds] = useState<string[]>([]);
	const [originalRoleIds, setOriginalRoleIds] = useState<string[]>([]);
	const [originalUserIds, setOriginalUserIds] = useState<string[]>([]);
	const [newUserId, setNewUserId] = useState("");

	const userInputId = useId();

	useEffect(() => {
		if (whitelist) {
			setRoleIds([...(whitelist.roleIds ?? [])]);
			setUserIds([...(whitelist.userIds ?? [])]);
			setOriginalRoleIds([...(whitelist.roleIds ?? [])]);
			setOriginalUserIds([...(whitelist.userIds ?? [])]);
		}
	}, [whitelist]);

	const isDirty = !deepEqual(roleIds, originalRoleIds) || !deepEqual(userIds, originalUserIds);

	const handleSave = useCallback(() => {
		updateWhitelist.mutate(
			{ roleIds, userIds },
			{
				onSuccess: () => {
					setOriginalRoleIds(roleIds);
					setOriginalUserIds(userIds);
				},
			},
		);
	}, [roleIds, userIds, updateWhitelist]);

	const handleDiscard = useCallback(() => {
		setRoleIds(originalRoleIds);
		setUserIds(originalUserIds);
	}, [originalRoleIds, originalUserIds]);

	const handleAddUser = useCallback(() => {
		const id = newUserId.trim();
		if (!id || userIds.includes(id)) return;
		if (!/^\d{17,20}$/.test(id)) return;
		setUserIds((prev) => [...prev, id]);
		setNewUserId("");
	}, [newUserId, userIds]);

	const handleRemoveUser = useCallback((id: string) => {
		setUserIds((prev) => prev.filter((u) => u !== id));
	}, []);

	if (isLoading) {
		return (
			<div className="space-y-6 animate-pulse ">
				<div className="rounded-xl border border-border bg-card overflow-visible">
					<div className="px-6 py-4 border-b border-border">
						<div className="h-5 w-40 rounded bg-muted" />
					</div>
					<div className="p-6 space-y-4">
						<div className="h-10 rounded-lg bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 ">
			<ConfigSection
				title="Whitelisted Roles"
				description="Roles exempt from bait channel detection"
			>
				<RolePicker
					guildId={guildId}
					value={roleIds}
					onChange={(value) => {
						if (Array.isArray(value)) {
							setRoleIds(value);
						} else if (value) {
							setRoleIds([value]);
						} else {
							setRoleIds([]);
						}
					}}
					label="Exempt Roles"
					placeholder="Select roles..."
					multi
					disabled={updateWhitelist.isPending}
				/>
			</ConfigSection>

			<ConfigSection title="Whitelisted Users" description="Individual users exempt from detection">
				<div className="flex items-end gap-2">
					<div className="flex-1">
						<label htmlFor={userInputId} className="text-sm font-medium mb-1.5 block">
							User ID
						</label>
						<Input
							id={userInputId}
							value={newUserId}
							onChange={(e) => setNewUserId(e.target.value)}
							placeholder="Enter Discord user ID"
							disabled={updateWhitelist.isPending}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									handleAddUser();
								}
							}}
						/>
					</div>
					<Button
						variant="outline"
						onClick={handleAddUser}
						disabled={!newUserId.trim() || updateWhitelist.isPending}
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>

				{userIds.length > 0 ? (
					<div className="flex flex-wrap gap-2 pt-2">
						{userIds.map((id) => (
							<span
								key={id}
								className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-sm"
							>
								{id}
								<button
									type="button"
									onClick={() => handleRemoveUser(id)}
									className="p-0.5 rounded-full hover:bg-background/50"
									aria-label={`Remove user ${id}`}
									disabled={updateWhitelist.isPending}
								>
									<X className="h-3 w-3" />
								</button>
							</span>
						))}
					</div>
				) : (
					<p className="text-sm text-muted-foreground text-center py-4">No users whitelisted</p>
				)}
			</ConfigSection>

			<SaveBar
				isDirty={isDirty}
				isLoading={updateWhitelist.isPending}
				onSave={handleSave}
				onDiscard={handleDiscard}
			/>
		</div>
	);
}
