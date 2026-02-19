import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { DOC_PATHS, useGitHubMarkdown } from "@/hooks/useGitHubMarkdown";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function ConfigPage() {
	const docId = "config-options";
	const hasPath = !!DOC_PATHS[docId];
	const { content, isLoading, error, refetch } = useGitHubMarkdown(docId);

	return (
		<DocsLayout
			title="Configuration"
			description="Learn how to configure Pluginator for your server setup"
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
					<h2 className="text-lg font-semibold mb-2">Documentation in Progress</h2>
					<p className="text-muted-foreground text-sm max-w-md mx-auto">
						Full configuration reference is being written. For now, check out the{" "}
						<Link to="/docs/user-files" className="text-primary hover:underline">
							User Files
						</Link>{" "}
						page for config.json documentation.
					</p>
				</div>
			) : null}
		</DocsLayout>
	);
}
