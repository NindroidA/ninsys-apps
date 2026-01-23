import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { DOC_PATHS, useGitHubMarkdown } from "@/hooks/useGitHubMarkdown";

export function CLICommandsPage() {
	const { content, isLoading, error, refetch } = useGitHubMarkdown("cli-commands");

	return (
		<DocsLayout
			title="CLI Commands"
			description="Complete reference for all Pluginator command-line commands"
			isLoading={isLoading}
			error={error}
			onRefresh={refetch}
			githubPath={DOC_PATHS["cli-commands"]}
		>
			{content && <MarkdownRenderer content={content} />}
		</DocsLayout>
	);
}
