import { DocsLayout, MarkdownRenderer } from "@/components/docs";
import { DOC_PATHS, useGitHubMarkdown } from "@/hooks/useGitHubMarkdown";
import { FileText } from "lucide-react";

export function TroubleshootingPage() {
  const docId = "troubleshooting";
  const hasPath = !!DOC_PATHS[docId];
  const { content, isLoading, error, refetch } = useGitHubMarkdown(docId);

  return (
    <DocsLayout
      title="Troubleshooting"
      description="Common issues and how to resolve them"
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
            Troubleshooting guide is being written. If you're experiencing
            issues, please{" "}
            <a
              href="https://github.com/NindroidA/pluginator/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              open an issue on GitHub
            </a>
            .
          </p>
        </div>
      ) : null}
    </DocsLayout>
  );
}
