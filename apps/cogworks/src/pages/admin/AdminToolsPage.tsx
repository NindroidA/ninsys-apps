import { PageHeader } from "@/components/dashboard/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Construction, Settings } from "lucide-react";

export function AdminToolsPage() {
	usePageTitle("Admin Tools");

	return (
		<FadeIn>
			<PageHeader
				title="Admin Tools"
				description="Bot-wide management and admin actions"
			/>

			<Card className="p-8 text-center">
				<div className="flex justify-center mb-4">
					<div className="relative">
						<Settings className="h-12 w-12 text-muted-foreground/40" />
						<Construction className="h-6 w-6 text-primary absolute -bottom-1 -right-1" />
					</div>
				</div>
				<h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
				<p className="text-sm text-muted-foreground max-w-md mx-auto">
					Broadcast announcements, force config refresh, global audit log, user lookup,
					and bot-wide settings will be available here.
				</p>
			</Card>
		</FadeIn>
	);
}
