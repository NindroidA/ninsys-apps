import type { Tier } from "@/types/tier";
import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { Check } from "lucide-react";

export type PricingTier = Tier;

interface PricingCardProps {
	tier: PricingTier;
	name: string;
	price: string;
	period?: string;
	description: string;
	features: string[];
	highlighted?: boolean;
	ctaText?: string;
	ctaHref?: string;
	onCtaClick?: () => void;
	className?: string;
}

const tierStyles: Record<PricingTier, { badge: string; border: string }> = {
	free: {
		badge: "bg-muted text-muted-foreground",
		border: "border-border",
	},
	plus: {
		badge: "bg-blue-500 text-white",
		border: "border-blue-500",
	},
	pro: {
		badge: "pro-gradient text-white",
		border: "border-primary",
	},
	max: {
		badge: "bg-amber-500 text-white",
		border: "border-amber-500",
	},
};

export function PricingCard({
	tier,
	name,
	price,
	period = "/mo",
	description,
	features,
	highlighted = false,
	ctaText = "Get Started",
	ctaHref,
	onCtaClick,
	className,
}: PricingCardProps) {
	const styles = tierStyles[tier];

	return (
		<div
			className={cn(
				"relative rounded-2xl border-2 bg-card p-8 transition-all",
				styles.border,
				highlighted && "scale-105 shadow-2xl ring-2 ring-primary/50",
				className,
			)}
		>
			{highlighted && (
				<div className="absolute -top-4 left-1/2 -translate-x-1/2">
					<span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
						Most Popular
					</span>
				</div>
			)}

			<div className="mb-6">
				<span
					className={cn(
						"inline-block px-3 py-1 rounded-full text-xs font-medium mb-4",
						styles.badge,
					)}
				>
					{name}
				</span>
				<div className="flex items-baseline gap-1">
					<span className="text-4xl font-bold">{price}</span>
					{price !== "Custom" && <span className="text-muted-foreground">{period}</span>}
				</div>
				<p className="mt-2 text-muted-foreground">{description}</p>
			</div>

			<ul className="space-y-3 mb-8">
				{features.map((feature) => (
					<li key={feature} className="flex items-start gap-3">
						<div className="rounded-full bg-success/10 p-1 mt-0.5">
							<Check className="h-3 w-3 text-success" />
						</div>
						<span className="text-sm">{feature}</span>
					</li>
				))}
			</ul>

			{ctaHref ? (
				<Button variant={highlighted ? "primary" : "outline"} className="w-full" size="lg" asChild>
					<a href={ctaHref}>{ctaText}</a>
				</Button>
			) : (
				<Button
					variant={highlighted ? "primary" : "outline"}
					className="w-full"
					size="lg"
					onClick={onCtaClick}
				>
					{ctaText}
				</Button>
			)}
		</div>
	);
}
