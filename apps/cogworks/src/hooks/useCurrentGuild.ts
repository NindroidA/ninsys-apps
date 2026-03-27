import { useGuildStore } from "@/stores/guildStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGuilds } from "./useGuilds";

export function useCurrentGuild() {
	const { guildId = "" } = useParams<{ guildId: string }>();
	const { guilds, isLoading } = useGuilds();
	const setCurrentGuildId = useGuildStore((s) => s.setCurrentGuildId);

	const guild = guilds.find((g) => g.id === guildId) ?? null;

	useEffect(() => {
		setCurrentGuildId(guildId || null);
		return () => setCurrentGuildId(null);
	}, [guildId, setCurrentGuildId]);

	return {
		guild,
		guildId,
		isLoading,
		isFound: !!guild,
	};
}
