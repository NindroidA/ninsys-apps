import type { Tier } from "@/types/tier";
import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { Check, Loader2, Sparkles } from "lucide-react";

interface PricingCardProps {
  tier: Tier;
  name: string;
  price: string;
  originalPrice?: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
  ctaStyle?: "default" | "downgrade" | "current";
  className?: string;
}

const tierStyles: Record<Tier, { badge: string; card: string }> = {
  free: {
    badge: "bg-muted text-muted-foreground",
    card: "bg-card border-2 border-border",
  },
  plus: {
    badge:
      "bg-gradient-to-r from-blue-400/25 via-blue-500/25 to-indigo-500/25 backdrop-blur-sm border border-blue-500/40 text-blue-400",
    card: "bg-gradient-to-br from-blue-400/25 via-blue-500/25 to-indigo-500/25 backdrop-blur-sm border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.2)]",
  },
  pro: {
    badge:
      "bg-gradient-to-r from-violet-500/25 via-purple-500/25 to-fuchsia-500/25 backdrop-blur-sm border border-purple-500/40 text-purple-400",
    card: "bg-gradient-to-br from-violet-500/25 via-purple-500/25 to-fuchsia-500/25 backdrop-blur-sm border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]",
  },
  max: {
    badge:
      "bg-gradient-to-r from-amber-400/25 via-orange-500/25 to-rose-500/25 backdrop-blur-sm border border-amber-500/40 text-amber-400",
    card: "bg-gradient-to-br from-amber-400/25 via-orange-500/25 to-rose-500/25 backdrop-blur-sm border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]",
  },
};

export function PricingCard({
  tier,
  name,
  price,
  originalPrice,
  period = "/mo",
  description,
  features,
  highlighted = false,
  ctaText = "Get Started",
  ctaHref,
  onCtaClick,
  ctaDisabled = false,
  ctaLoading = false,
  ctaStyle = "default",
  className,
}: PricingCardProps) {
  const styles = tierStyles[tier];

  return (
    <div
      className={cn(
        "relative rounded-2xl p-8 h-full flex flex-col transition-all",
        styles.card,
        highlighted && "scale-105 shadow-2xl",
        className
      )}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <span
          className={cn(
            "inline-block px-3 py-1 rounded-full text-xs font-medium mb-4",
            styles.badge
          )}
        >
          {name}
        </span>
        <div className="flex items-baseline gap-2">
          {originalPrice && (
            <span className="text-lg text-muted-foreground/60 line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Custom" && (
            <span className="text-muted-foreground">{period}</span>
          )}
        </div>
        {originalPrice && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-400/15 via-blue-500/15 to-indigo-500/15 border border-blue-500/30 text-blue-400">
            <Sparkles className="h-3 w-3" />
            Plus discount
          </div>
        )}
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
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
        <Button
          variant={highlighted ? "primary" : "outline"}
          className="w-full"
          size="lg"
          asChild
        >
          <a href={ctaHref}>{ctaText}</a>
        </Button>
      ) : (
        <Button
          variant={
            ctaStyle === "current"
              ? "ghost"
              : ctaStyle === "downgrade"
              ? "outline"
              : highlighted
              ? "primary"
              : "outline"
          }
          className={cn(
            "w-full",
            ctaStyle === "current" &&
              "bg-foreground/[0.08] backdrop-blur-sm border border-foreground/[0.12] text-foreground/50",
            ctaStyle === "downgrade" &&
              "text-foreground/70 hover:text-foreground"
          )}
          size="lg"
          onClick={onCtaClick}
          disabled={ctaDisabled || ctaLoading}
        >
          {ctaLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {ctaText}
        </Button>
      )}
    </div>
  );
}
