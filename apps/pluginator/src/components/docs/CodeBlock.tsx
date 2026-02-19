import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { Check, Copy, FileCode } from "lucide-react";
import { useCallback, useState } from "react";

interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
	className?: string;
}

export function CodeBlock({
	code,
	language = "json",
	filename,
	showLineNumbers = false,
	className,
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, [code]);

	const lines = code.split("\n");

	const highlightJSON = (text: string) => {
		if (language !== "json") {
			return <span>{text}</span>;
		}
		return (
			<>
				{text.split(/("(?:[^"\\]|\\.)*")/g).map((part, i) => {
					if (part.startsWith('"') && part.endsWith('"')) {
						const isKey = text.includes(`${part}:`);
						if (isKey) {
							return (
								<span key={i} className="text-cyan-400">
									{part}
								</span>
							);
						}
						return (
							<span key={i} className="text-green-400">
								{part}
							</span>
						);
					}
					const withNumbers = part.split(/(\b\d+\.?\d*\b)/g).map((subpart, j) => {
						if (/^\d+\.?\d*$/.test(subpart)) {
							return (
								<span key={`${i}-${j}`} className="text-orange-400">
									{subpart}
								</span>
							);
						}
						const withKeywords = subpart.split(/(true|false|null)/g).map((kw, k) => {
							if (kw === "true" || kw === "false" || kw === "null") {
								return (
									<span key={`${i}-${j}-${k}`} className="text-purple-400">
										{kw}
									</span>
								);
							}
							return <span key={`${i}-${j}-${k}`}>{kw}</span>;
						});
						return <span key={`${i}-${j}`}>{withKeywords}</span>;
					});
					return <span key={i}>{withNumbers}</span>;
				})}
			</>
		);
	};

	return (
		<div className={cn("rounded-lg overflow-hidden border border-border", className)}>
			<div className="flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<FileCode className="h-4 w-4" />
					<span className="font-mono">{filename || language}</span>
				</div>
				<Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs gap-1.5">
					{copied ? (
						<>
							<Check className="h-3.5 w-3.5 text-green-500" />
							<span className="text-green-500">Copied!</span>
						</>
					) : (
						<>
							<Copy className="h-3.5 w-3.5" />
							<span>Copy</span>
						</>
					)}
				</Button>
			</div>
			<div className="bg-[#1e1e1e] overflow-x-auto">
				<pre className="p-4 text-sm font-mono leading-relaxed">
					<code>
						{lines.map((line, index) => (
							<div key={index} className="flex">
								{showLineNumbers && (
									<span className="select-none text-gray-500 pr-4 text-right min-w-[2.5rem]">
										{index + 1}
									</span>
								)}
								<span className="text-gray-300">{highlightJSON(line)}</span>
							</div>
						))}
					</code>
				</pre>
			</div>
		</div>
	);
}

interface FilePathDisplayProps {
	path: string;
	platformHint?: string;
	className?: string;
}

export function FilePathDisplay({ path, platformHint, className }: FilePathDisplayProps) {
	const [copied, setCopied] = useState(false);
	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(path);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	}, [path]);

	return (
		<div
			className={cn(
				"flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border group",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				<FileCode className="h-4 w-4 text-primary" />
				<code className="font-mono text-sm">{path}</code>
				{platformHint && (
					<span className="text-xs text-muted-foreground hidden sm:inline">({platformHint})</span>
				)}
			</div>
			<Button
				variant="ghost"
				size="sm"
				onClick={handleCopy}
				className="h-7 px-2 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
			>
				{copied ? (
					<>
						<Check className="h-3.5 w-3.5 text-green-500" />
						<span className="text-green-500">Copied!</span>
					</>
				) : (
					<>
						<Copy className="h-3.5 w-3.5" />
						<span>Copy</span>
					</>
				)}
			</Button>
		</div>
	);
}
