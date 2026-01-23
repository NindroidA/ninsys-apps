import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { useGitHubMarkdown, DOC_PATHS } from "@/hooks/useGitHubMarkdown";

export function ConfigPage() {
	const { content, isLoading, error, refetch } = useGitHubMarkdown("config-options");

	return (
		<DocsLayout
			title="Configuration"
			description="Learn how to configure Pluginator for your server setup"
			isLoading={isLoading}
			error={error}
			onRefresh={refetch}
			githubPath={DOC_PATHS["config-options"]}
		>
			{content && <MarkdownRenderer content={content} />}
		</DocsLayout>
	);
}
