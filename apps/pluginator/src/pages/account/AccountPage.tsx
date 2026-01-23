/**
 * Account Page
 * User profile and subscription management
 */

import { Button, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription, useCreatePortalSession } from "@/hooks/useSubscription";
import { UsageDashboard } from "@/components/pluginator/UsageDashboard";
import { TIER_DISPLAY } from "@/types/tier";
import { ExternalLink, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";

export function AccountPage() {
	const { user } = useAuth();
	const { data: subscription } = useSubscription();
	const portalMutation = useCreatePortalSession();

	const handleManageSubscription = () => {
		portalMutation.mutate(undefined, {
			onSuccess: (data) => {
				window.location.href = data.url;
			},
		});
	};

	const tierInfo = subscription ? TIER_DISPLAY[subscription.tier] : null;

	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4">
				<FadeIn>
					<h1 className="text-3xl font-bold mb-8">Account Settings</h1>
				</FadeIn>

				<div className="grid gap-8 lg:grid-cols-2 mb-8">
					{/* Profile Section */}
					<FadeIn delay={0.1}>
						<Card className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<User className="h-5 w-5 text-muted-foreground" />
								<h2 className="text-xl font-semibold">Profile</h2>
							</div>
							<div className="space-y-4">
								<div>
									<label className="text-sm text-muted-foreground">Email</label>
									<p className="font-medium">{user?.email || "Not logged in"}</p>
								</div>
								<div>
									<label className="text-sm text-muted-foreground">Name</label>
									<p className="font-medium">{user?.name || "Not set"}</p>
								</div>
							</div>
						</Card>
					</FadeIn>

					{/* Subscription Section */}
					<FadeIn delay={0.2}>
						<Card className="p-6">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-3">
									<Settings className="h-5 w-5 text-muted-foreground" />
									<h2 className="text-xl font-semibold">Subscription</h2>
								</div>
								{tierInfo && (
									<span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
										{tierInfo.name}
									</span>
								)}
							</div>

							<div className="space-y-4">
								{subscription?.hasPlusDiscount && (
									<div className="p-3 rounded-lg bg-success/10 text-success text-sm">
										Plus discount active - saving on Pro/Max subscriptions!
									</div>
								)}

								{subscription?.tier === "free" ? (
									<div className="space-y-3">
										<p className="text-muted-foreground text-sm">
											Upgrade to unlock more features and higher limits.
										</p>
										<Button asChild>
											<Link to="/pricing">Upgrade Plan</Link>
										</Button>
									</div>
								) : (
									<Button
										variant="outline"
										onClick={handleManageSubscription}
										disabled={portalMutation.isPending}
									>
										<Settings className="h-4 w-4 mr-2" />
										Manage Subscription
										<ExternalLink className="h-3 w-3 ml-2" />
									</Button>
								)}
							</div>
						</Card>
					</FadeIn>
				</div>

				{/* Usage Dashboard */}
				<FadeIn delay={0.3}>
					<h2 className="text-2xl font-bold mb-4">Usage</h2>
					<UsageDashboard />
				</FadeIn>
			</div>
		</div>
	);
}
