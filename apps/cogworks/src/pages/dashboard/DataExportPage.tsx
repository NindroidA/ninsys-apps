import { PageHeader } from "@/components/dashboard/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { Construction, Download } from "lucide-react";

export function DataExportPage() {
	usePageTitle("Data Export");

	return (
		<FadeIn className="max-w-4xl">
			<PageHeader
				title="Data Export"
				description="Export all data stored by Cogworks for this server"
			/>

			<div>
				<Card className="p-8 text-center">
					<div className="flex justify-center mb-4">
						<div className="relative">
							<Download className="h-12 w-12 text-muted-foreground/40" />
							<Construction className="h-6 w-6 text-primary absolute -bottom-1 -right-1" />
						</div>
					</div>
					<h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
					<p className="text-sm text-muted-foreground max-w-md mx-auto">
						Data export functionality is under development. You'll be able to export all server data
						including configuration, tickets, applications, memory items, and logs for GDPR
						compliance.
					</p>
				</Card>
			</div>
		</FadeIn>
	);
}
