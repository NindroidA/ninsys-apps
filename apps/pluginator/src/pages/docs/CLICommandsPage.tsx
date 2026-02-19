import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { DOC_PATHS, useGitHubMarkdown } from "@/hooks/useGitHubMarkdown";
import { FileText } from "lucide-react";

export function CLICommandsPage() {
  const docId = "cli-commands";
  const hasPath = !!DOC_PATHS[docId];
  const { content, isLoading, error, refetch } = useGitHubMarkdown(docId);

  return (
    <DocsLayout
      title="CLI Commands"
      description="Complete reference for all Pluginator command-line commands"
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
          <h2 className="text-lg font-semibold mb-2">
            Documentation in Progress
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            This documentation is being written and will be available soon. In
            the meantime, run{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
              pluginator --help
            </code>{" "}
            for a quick command reference.
          </p>
        </div>
      ) : null}
    </DocsLayout>
  );
}
