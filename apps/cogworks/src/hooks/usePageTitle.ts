import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { useEffect } from "react";

export function usePageTitle(title: string) {
	const { guild } = useCurrentGuild();

	useEffect(() => {
		const guildName = guild?.name;
		document.title = guildName ? `${title} - ${guildName} | Cogworks` : `${title} | Cogworks`;
	}, [title, guild?.name]);
}
