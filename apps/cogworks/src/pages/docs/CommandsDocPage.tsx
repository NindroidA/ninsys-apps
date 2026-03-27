import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { DOC_PATHS, useGitHubMarkdown } from "@/hooks/useGitHubMarkdown";
import { FileText } from "lucide-react";

export function CommandsDocPage() {
	const docId = "commands";
	const hasPath = !!DOC_PATHS[docId];
	const { content, isLoading, error, refetch } = useGitHubMarkdown(docId);

	return (
		<DocsLayout
			title="Commands Reference"
			description="Complete reference for all Cogworks bot commands"
			isLoading={isLoading}
			error={error}
			onRefresh={hasPath ? refetch : undefined}
			githubPath={DOC_PATHS[docId]}
		>
			{content ? (
				<MarkdownRenderer content={content} />
			) : !isLoading && !error ? (
				<div className="text-center py-12">
					<FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-lg font-semibold mb-2">Documentation Coming Soon</h2>
					<p className="text-muted-foreground text-sm max-w-md mx-auto">
						This page is being prepared and will be available shortly.
					</p>
				</div>
			) : null}
		</DocsLayout>
	);
}
