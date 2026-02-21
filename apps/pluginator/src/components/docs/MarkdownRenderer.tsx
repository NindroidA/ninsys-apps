import { cn } from "@ninsys/ui/lib";
import { ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
	return (
		<div className={cn("markdown-content text-[0.95rem] leading-7", className)}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeHighlight]}
				components={{
					// Headings
					h1: ({ children }) => (
						<h1 className="text-3xl font-bold mb-6 mt-10 first:mt-0 pb-3 border-b border-border">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-2xl font-semibold mb-4 mt-10 pl-4 border-l-4 border-primary py-1">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-xl font-semibold mb-3 mt-8 text-primary/90">{children}</h3>
					),
					h4: ({ children }) => (
						<h4 className="text-lg font-medium mb-2 mt-6 text-muted-foreground">{children}</h4>
					),

					// Paragraphs and text
					p: ({ children }) => <p className="mb-5 leading-7">{children}</p>,
					strong: ({ children }) => (
						<strong className="font-semibold text-foreground">{children}</strong>
					),
					em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,

					// Lists
					ul: ({ children }) => <ul className="mb-5 space-y-2 ml-6 list-none">{children}</ul>,
					ol: ({ children }) => (
						<ol className="list-decimal mb-5 space-y-2 ml-6 marker:text-primary marker:font-semibold">
							{children}
						</ol>
					),
					li: ({ children }) => (
						<li className="leading-7 relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.7rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary/60">
							{children}
						</li>
					),

					// Links
					a: ({ href, children }) => {
						const isExternal = href?.startsWith("http");
						return (
							<a
								href={href}
								target={isExternal ? "_blank" : undefined}
								rel={isExternal ? "noopener noreferrer" : undefined}
								className="text-primary hover:text-primary-hover underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors inline-flex items-center gap-1"
							>
								{children}
								{isExternal && <ExternalLink className="h-3 w-3 shrink-0" />}
							</a>
						);
					},

					// Code
					code: ({ className, children, ...props }) => {
						const isInline = !className;
						if (isInline) {
							return (
								<code
									className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[0.85em] font-mono border border-primary/10"
									{...props}
								>
									{children}
								</code>
							);
						}
						return (
							<code className={cn("text-sm font-mono", className)} {...props}>
								{children}
							</code>
						);
					},
					pre: ({ children }) => (
						<pre className="mb-6 p-5 rounded-xl bg-[oklch(0.15_0.015_280)] border border-border/50 overflow-x-auto shadow-md">
							{children}
						</pre>
					),

					// Blockquotes
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-accent pl-5 pr-4 py-3 mb-6 bg-accent/5 rounded-r-lg">
							{children}
						</blockquote>
					),

					// Tables
					table: ({ children }) => (
						<div className="overflow-x-auto mb-6 rounded-xl border border-border shadow-sm">
							<table className="w-full border-collapse">{children}</table>
						</div>
					),
					thead: ({ children }) => (
						<thead className="bg-primary/10 border-b border-border">{children}</thead>
					),
					tbody: ({ children }) => <tbody>{children}</tbody>,
					tr: ({ children }) => (
						<tr className="border-b border-border/50 last:border-b-0 even:bg-muted/30 hover:bg-muted/50 transition-colors">
							{children}
						</tr>
					),
					th: ({ children }) => (
						<th className="text-left p-3.5 font-semibold text-sm text-primary">{children}</th>
					),
					td: ({ children }) => <td className="p-3.5 text-sm">{children}</td>,

					// Horizontal rule
					hr: () => (
						<hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
					),

					// Images
					img: ({ src, alt }) => (
						<img
							src={src}
							alt={alt}
							className="max-w-full h-auto rounded-xl my-6 border border-border shadow-md"
						/>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
