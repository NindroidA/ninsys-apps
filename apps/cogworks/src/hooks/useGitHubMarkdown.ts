import { useQuery } from "@tanstack/react-query";

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/NindroidA/cogworks-bot/main";

/** Map of doc identifiers to their file paths in the cogworks-bot repo */
export const DOC_PATHS: Record<string, string> = {
	"privacy-policy": "/docs/privacy_policy.md",
	"terms-of-service": "/docs/terms_of_service.md",
	"admin-guide": "/docs/admin_guide.md",
	commands: "/docs/commands.md",
	changelog: "/CHANGELOG.md",
};

interface UseGitHubMarkdownResult {
	content: string | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => void;
}

export function useGitHubMarkdown(docId: string): UseGitHubMarkdownResult {
	const path = DOC_PATHS[docId];

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["github-markdown", docId],
		queryFn: async () => {
			if (!path) {
				throw new Error(`Unknown doc ID: ${docId}`);
			}

			const url = `${GITHUB_RAW_BASE}${path}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`Failed to fetch documentation: ${response.statusText}`);
			}

			return response.text();
		},
		staleTime: 5 * 60 * 1000,
		gcTime: 30 * 60 * 1000,
		retry: 2,
		enabled: !!path,
	});

	return {
		content: data ?? null,
		isLoading,
		error: error as Error | null,
		refetch,
	};
}
