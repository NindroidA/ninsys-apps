import { cn } from "@ninsys/ui/lib";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
	title: string;
	description: string;
	icon: LucideIcon;
	href?: string;
	className?: string;
}

export function FeatureCard({ title, description, icon: Icon, href, className }: FeatureCardProps) {
	const content = (
		<>
			<div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
				<Icon className="h-6 w-6 text-primary" />
			</div>
			<h3 className="mb-2 text-xl font-semibold">{title}</h3>
			<p className="text-muted-foreground">{description}</p>
			{href && (
				<div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
					Learn more
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
			)}
		</>
	);

	const baseClasses = cn(
		"group block rounded-xl border border-border bg-card p-6 transition-all",
		"hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5",
		className,
	);

	if (href) {
		return (
			<Link to={href} className={baseClasses}>
				{content}
			</Link>
		);
	}

	return <div className={baseClasses}>{content}</div>;
}
