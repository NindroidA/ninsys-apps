import { cn } from "@ninsys/ui/lib";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { useId } from "react";

interface Tab {
	id: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
	badge?: number;
}

interface TabsProps {
	tabs: Tab[];
	activeTab: string;
	onChange: (tabId: string) => void;
	className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
	const layoutId = useId();
	return (
		<div
			role="tablist"
			className={cn("flex gap-1 border-b border-border overflow-x-auto", className)}
		>
			{tabs.map((tab) => {
				const isActive = tab.id === activeTab;
				const Icon = tab.icon;
				return (
					<button
						key={tab.id}
						type="button"
						role="tab"
						aria-selected={isActive}
						aria-controls={`tabpanel-${tab.id}`}
						onClick={() => onChange(tab.id)}
						className={cn(
							"relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
							isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
						)}
					>
						{Icon && <Icon className="h-4 w-4" />}
						{tab.label}
						{tab.badge != null && tab.badge > 0 && (
							<span className="ml-1 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-xs">
								{tab.badge}
							</span>
						)}
						{isActive && (
							<motion.div
								layoutId={`tab-underline-${layoutId}`}
								className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
								aria-hidden="true"
								transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
							/>
						)}
					</button>
				);
			})}
		</div>
	);
}
