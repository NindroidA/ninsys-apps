import { Card } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import type { ReactNode } from "react";

interface ConfigSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ConfigSection({
  title,
  description,
  children,
  className,
}: ConfigSectionProps) {
  return (
    <Card className={cn("overflow-visible", className)}>
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/[0.03] to-transparent">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </Card>
  );
}
