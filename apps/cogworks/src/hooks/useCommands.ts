import { useQuery } from "@tanstack/react-query";

interface CommandOption {
	name: string;
	description: string;
	type: number;
	required?: boolean;
}

interface SubcommandInfo {
	name: string;
	description: string;
	usage: string;
	options?: CommandOption[];
}

interface SubcommandGroup {
	name: string;
	description: string;
	subcommands: SubcommandInfo[];
}

export interface ApiCommand {
	name: string;
	description: string;
	usage: string;
	category: string;
	permissions: string[];
	subcommands: SubcommandInfo[];
	subcommandGroups: SubcommandGroup[];
}

interface CommandsResponse {
	commands: ApiCommand[];
	categories: string[];
}

export function useCommands() {
	return useQuery({
		queryKey: ["commands"],
		queryFn: async () => {
			const res = await fetch("/v2/cogworks/commands");
			if (!res.ok) return null;
			const json = await res.json();
			if (!json.success || !json.data) return null;
			return json.data as CommandsResponse;
		},
		staleTime: 1000 * 60 * 10,
		gcTime: 1000 * 60 * 30,
	});
}
