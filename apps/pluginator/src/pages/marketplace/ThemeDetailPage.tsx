/**
 * Theme Detail Page
 *
 * Full details for a single theme with preview and color palette.
 */

import {
  ThemeCategoryIcon,
  ThemeColorSwatch,
  ThemePreview,
} from "@/components/marketplace";
import { useRegistryTheme } from "@/hooks/useThemes";
import {
  THEME_CATEGORY_INFO,
  THEME_TIER_INFO,
  THEME_TYPE_INFO,
} from "@/types/theme";
import { Badge, Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import {
  ArrowLeft,
  BadgeCheck,
  Copy,
  Crown,
  Moon,
  Palette,
  Sparkles,
  Star,
  Sun,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export function ThemeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: theme, isLoading, error } = useRegistryTheme(id || "");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (theme) {
      navigator.clipboard.writeText(`pluginator theme set ${theme.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return <ThemeDetailSkeleton />;
  }

  if (error || !theme) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 text-center">
          <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Theme Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The theme you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/marketplace/themes">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Themes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const categoryInfo = THEME_CATEGORY_INFO[theme.category];
  const tierInfo = THEME_TIER_INFO[theme.minTier];
  const typeInfo = THEME_TYPE_INFO[theme.type];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back link */}
        <FadeIn>
          <Link
            to="/marketplace/themes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Themes
          </Link>
        </FadeIn>

        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
            <div className="flex-1">
              {/* Name and badges */}
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold">{theme.name}</h1>
                {theme.verified && (
                  <Badge variant="primary" className="bg-primary">
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {theme.featured && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-500/10 text-amber-500 border-amber-500/20"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Author */}
              <p className="text-muted-foreground mb-4">by {theme.author}</p>

              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Tier */}
                <Badge
                  variant="secondary"
                  className={`${tierInfo?.bgColor ?? ""} ${
                    tierInfo?.color ?? ""
                  }`}
                >
                  {theme.minTier === "max" && (
                    <Crown className="h-3 w-3 mr-1" />
                  )}
                  {tierInfo?.name ?? theme.minTier} Tier
                </Badge>

                {/* Type */}
                <Badge variant="outline">
                  {theme.type === "dark" ? (
                    <Moon className="h-3 w-3 mr-1" />
                  ) : (
                    <Sun className="h-3 w-3 mr-1" />
                  )}
                  {typeInfo?.name ?? theme.type}
                </Badge>

                {/* Category */}
                <Badge variant="outline" className="flex items-center gap-1.5">
                  <ThemeCategoryIcon
                    iconKey={categoryInfo?.iconKey ?? theme.category}
                    className="h-3.5 w-3.5"
                  />
                  {categoryInfo?.name ?? theme.category}
                </Badge>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Main content grid - wider layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left column - Main info (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Terminal Preview */}
            <FadeIn delay={0.2}>
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-primary" />
                  Preview
                </h2>
                <div className="flex justify-center">
                  <ThemePreview theme={theme} size="lg" />
                </div>
              </section>
            </FadeIn>

            {/* Use This Theme - Full width in main content */}
            <FadeIn delay={0.25}>
              <div className="rounded-xl bg-gradient-to-br from-violet-500/25 via-purple-500/25 to-fuchsia-500/25 backdrop-blur-sm border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                <section className="rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Terminal className="h-5 w-5 text-primary" />
                        Use This Theme
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Set this theme in the Pluginator CLI:
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 sm:flex-none bg-background rounded-lg px-4 py-3 font-mono text-sm flex items-center gap-3 min-w-0 overflow-x-auto">
                        <code className="whitespace-nowrap">
                          pluginator theme set {theme.id}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="shrink-0 p-1.5 rounded hover:bg-muted transition-colors"
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <BadgeCheck className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tier warning */}
                  {theme.minTier !== "free" && (
                    <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Requires {tierInfo?.name ?? theme.minTier} tier or higher
                    </p>
                  )}
                </section>
              </div>
            </FadeIn>

            {/* Description */}
            {theme.description && (
              <FadeIn delay={0.3}>
                <section className="rounded-xl border border-border bg-card p-6">
                  <h2 className="text-lg font-semibold mb-3">About</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {theme.description}
                  </p>
                </section>
              </FadeIn>
            )}

            {/* Premium Features */}
            {(theme.gradients || theme.animations) && (
              <FadeIn delay={0.5}>
                <div className="rounded-xl bg-gradient-to-br from-amber-400/25 via-orange-500/25 to-rose-500/25 backdrop-blur-sm border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                  <section className="rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-amber-500">
                      <Crown className="h-5 w-5" />
                      Premium Features
                    </h2>
                    <ul className="space-y-2 text-muted-foreground">
                      {theme.gradients && (
                        <li className="flex items-center gap-2">
                          <span className="text-amber-500">✓</span>
                          Custom gradients for visual effects
                        </li>
                      )}
                      {theme.animations?.shimmer && (
                        <li className="flex items-center gap-2">
                          <span className="text-amber-500">✓</span>
                          Shimmer animation effects
                        </li>
                      )}
                      {theme.animations?.colorCycle && (
                        <li className="flex items-center gap-2">
                          <span className="text-amber-500">✓</span>
                          Color cycling animation
                        </li>
                      )}
                    </ul>
                  </section>
                </div>
              </FadeIn>
            )}
          </div>

          {/* Right column - Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Info card */}
            <FadeIn delay={0.3}>
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Theme Info</h2>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="font-medium">
                      {typeInfo?.name ?? theme.type}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">
                      {categoryInfo?.name ?? theme.category}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Requires</dt>
                    <dd className="font-medium">
                      {tierInfo?.name ?? theme.minTier} Tier
                    </dd>
                  </div>
                  {theme.downloads && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Downloads</dt>
                      <dd className="font-medium">
                        {theme.downloads.toLocaleString()}
                      </dd>
                    </div>
                  )}
                  {theme.rating && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Rating</dt>
                      <dd className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {theme.rating}/5
                      </dd>
                    </div>
                  )}
                </dl>
              </section>
            </FadeIn>

            {/* Color Palette */}
            <FadeIn delay={0.4}>
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Colors
                </h2>
                <ThemeColorSwatch colors={theme.colors} compact />
              </section>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for theme detail
 */
function ThemeDetailSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl animate-pulse">
        {/* Back link */}
        <div className="h-4 w-32 bg-muted rounded mb-6" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="h-10 w-64 bg-muted rounded mb-2" />
            <div className="h-4 w-40 bg-muted rounded mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-muted rounded" />
              <div className="h-6 w-16 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="h-6 w-24 bg-muted rounded mb-4" />
              <div className="h-[280px] bg-muted rounded" />
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <div className="h-6 w-40 bg-muted rounded mb-4" />
              <div className="h-12 bg-muted rounded" />
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="h-6 w-32 bg-muted rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="h-6 w-32 bg-muted rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="h-6 w-28 bg-muted rounded mb-4" />
              <div className="h-10 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
