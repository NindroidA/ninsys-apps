import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { useGitHubMarkdown, DOC_PATHS } from "@/hooks/useGitHubMarkdown";

export function UserGuidePage() {
	const { content, isLoading, error, refetch } = useGitHubMarkdown("user-guide");

	return (
		<DocsLayout
			title="User Guide"
			description="Step-by-step guide to getting started with Pluginator"
			isLoading={isLoading}
			error={error}
			onRefresh={refetch}
			githubPath={DOC_PATHS["user-guide"]}
		>
			{content && <MarkdownRenderer content={content} />}
		</DocsLayout>
	);
}
