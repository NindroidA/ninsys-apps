import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { DOC_PATHS, useGitHubMarkdown } from "@/hooks/useGitHubMarkdown";

export function TroubleshootingPage() {
	const { content, isLoading, error, refetch } = useGitHubMarkdown("troubleshooting");

	return (
		<DocsLayout
			title="Troubleshooting"
			description="Common issues and how to resolve them"
			isLoading={isLoading}
			error={error}
			onRefresh={refetch}
			githubPath={DOC_PATHS.troubleshooting}
		>
			{content && <MarkdownRenderer content={content} />}
		</DocsLayout>
	);
}
