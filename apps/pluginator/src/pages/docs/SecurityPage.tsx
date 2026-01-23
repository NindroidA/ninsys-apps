import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { useGitHubMarkdown, DOC_PATHS } from "@/hooks/useGitHubMarkdown";

export function SecurityPage() {
	const { content, isLoading, error, refetch } = useGitHubMarkdown("security");

	return (
		<DocsLayout
			title="Security"
			description="Security policies and best practices"
			isLoading={isLoading}
			error={error}
			onRefresh={refetch}
			githubPath={DOC_PATHS.security}
		>
			{content && <MarkdownRenderer content={content} />}
		</DocsLayout>
	);
}
