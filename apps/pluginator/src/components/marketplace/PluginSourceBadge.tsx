/**
 * Plugin Source Badge
 *
 * Displays a badge for a plugin source (Modrinth, Spigot, GitHub, etc.)
 */

import { SOURCE_INFO, getSourceUrl } from "@/types/registry";
import type { RegistryPluginSource } from "@/types/registry";
import { cn } from "@ninsys/ui/lib";
import { Download, ExternalLink, Send } from "lucide-react";
import {
  SiCurseforge,
  SiGithub,
  SiJenkins,
  SiModrinth,
  SiSpigotmc,
} from "react-icons/si";

interface PluginSourceBadgeProps {
  source: RegistryPluginSource;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
}

// Source icons mapping with brand colors
const SOURCE_COLORS: Record<string, string> = {
  modrinth: "#00af5c",
  github: "#ffffff",
  spigot: "#f69823",
  hangar: "#1e88e5",
  curseforge: "#f16436",
  jenkins: "#d33833",
};

function SourceIcon({ type, className }: { type: string; className?: string }) {
  const iconProps = { className };

  switch (type) {
    case "modrinth":
      return (
        <SiModrinth {...iconProps} style={{ color: SOURCE_COLORS.modrinth }} />
      );
    case "github":
      return <SiGithub {...iconProps} />;
    case "spigot":
      return (
        <SiSpigotmc {...iconProps} style={{ color: SOURCE_COLORS.spigot }} />
      );
    case "hangar":
      // Hangar uses a paper plane style icon (PaperMC's platform)
      return <Send {...iconProps} style={{ color: SOURCE_COLORS.hangar }} />;
    case "curseforge":
      return (
        <SiCurseforge
          {...iconProps}
          style={{ color: SOURCE_COLORS.curseforge }}
        />
      );
    case "jenkins":
      return (
        <SiJenkins {...iconProps} style={{ color: SOURCE_COLORS.jenkins }} />
      );
    default:
      return <Download {...iconProps} />;
  }
}

export function PluginSourceBadge({
  source,
  showLabel = true,
  size = "md",
  asLink = true,
}: PluginSourceBadgeProps) {
  const info = SOURCE_INFO[source.type];
  const url = getSourceUrl(source);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-1",
    md: "text-sm px-2 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const content = (
    <>
      <SourceIcon type={source.type} className={iconSizes[size]} />
      {showLabel && <span>{info?.name ?? source.type}</span>}
      {source.preferred && (
        <span className="text-[10px] uppercase tracking-wide text-primary font-medium">
          Preferred
        </span>
      )}
      {asLink && url && (
        <ExternalLink className={cn(iconSizes[size], "opacity-50")} />
      )}
    </>
  );

  const baseClasses = cn(
    "inline-flex items-center rounded-md border border-border bg-muted/50 font-medium transition-colors",
    sizeClasses[size],
    asLink && url && "hover:bg-muted hover:border-primary/50 cursor-pointer"
  );

  if (asLink && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
        title={`View on ${info?.name ?? source.type}`}
      >
        {content}
      </a>
    );
  }

  return <span className={baseClasses}>{content}</span>;
}

/**
 * Compact source icons row (for plugin cards)
 */
export function PluginSourceIcons({
  sources,
  maxVisible = 3,
}: {
  sources: RegistryPluginSource[];
  maxVisible?: number;
}) {
  const visibleSources = sources.slice(0, maxVisible);
  const remaining = sources.length - maxVisible;

  return (
    <div className="flex items-center gap-1.5">
      {visibleSources.map((source) => (
        <span
          key={`${source.type}-${
            source.projectSlug || source.resourceId || source.repoSlug
          }`}
          className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-muted/70 border border-border/50 transition-colors hover:bg-muted hover:border-border"
          title={SOURCE_INFO[source.type]?.name ?? source.type}
        >
          <SourceIcon type={source.type} className="h-4 w-4" />
        </span>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-muted-foreground ml-0.5">
          +{remaining}
        </span>
      )}
    </div>
  );
}
