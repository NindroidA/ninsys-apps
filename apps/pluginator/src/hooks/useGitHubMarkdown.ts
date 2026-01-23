import { useQuery } from "@tanstack/react-query";

// Docs are synced from private CLI repo to public repo via GitHub Actions
const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/NindroidA/pluginator-public/main";

// Map of doc identifiers to their file paths in the repo
export const DOC_PATHS: Record<string, string> = {
	"cli-commands": "/docs/quick-reference/cli-commands.md",
	"config-options": "/docs/quick-reference/config-options.md",
	"troubleshooting": "/docs/quick-reference/troubleshooting.md",
	"plugin-json": "/docs/quick-reference/plugin-json.md",
	"user-guide": "/docs/USER_GUIDE.md",
	changelog: "/docs/CHANGELOG.md",
	security: "/docs/SECURITY.md",
	readme: "/README.md",
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
		staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
		gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
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
