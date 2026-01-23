import { cn } from "@ninsys/ui/lib";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
	return (
		<div className={cn("markdown-content", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeHighlight]}
				components={{
					// Headings
					h1: ({ children }) => (
						<h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0 pb-2 border-b border-border">
							{children}
						</h1>
					),
					h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-8">{children}</h2>,
					h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 mt-6">{children}</h3>,
					h4: ({ children }) => <h4 className="text-lg font-medium mb-2 mt-4">{children}</h4>,

					// Paragraphs and text
					p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
					strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
					em: ({ children }) => <em className="italic">{children}</em>,

					// Lists
					ul: ({ children }) => (
						<ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>
					),
					li: ({ children }) => <li className="leading-relaxed">{children}</li>,

					// Links
					a: ({ href, children }) => (
						<a
							href={href}
							target={href?.startsWith("http") ? "_blank" : undefined}
							rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
							className="text-primary hover:underline"
						>
							{children}
						</a>
					),

					// Code
					code: ({ className, children, ...props }) => {
						const isInline = !className;
						if (isInline) {
							return (
								<code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono" {...props}>
									{children}
								</code>
							);
						}
						return (
							<code className={cn("text-sm", className)} {...props}>
								{children}
							</code>
						);
					},
					pre: ({ children }) => (
						<pre className="mb-4 p-4 rounded-lg bg-muted overflow-x-auto">{children}</pre>
					),

					// Blockquotes
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-primary pl-4 py-2 mb-4 bg-muted/50 rounded-r">
							{children}
						</blockquote>
					),

					// Tables
					table: ({ children }) => (
						<div className="overflow-x-auto mb-4">
							<table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
								{children}
							</table>
						</div>
					),
					thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
					tbody: ({ children }) => <tbody>{children}</tbody>,
					tr: ({ children }) => (
						<tr className="border-b border-border last:border-b-0">{children}</tr>
					),
					th: ({ children }) => <th className="text-left p-3 font-semibold text-sm">{children}</th>,
					td: ({ children }) => <td className="p-3 text-sm">{children}</td>,

					// Horizontal rule
					hr: () => <hr className="my-8 border-border" />,

					// Images
					img: ({ src, alt }) => (
						<img src={src} alt={alt} className="max-w-full h-auto rounded-lg my-4" />
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
