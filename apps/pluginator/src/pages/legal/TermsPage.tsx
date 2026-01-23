import { FadeIn } from "@ninsys/ui/components/animations";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function TermsPage() {
	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4 max-w-3xl">
				{/* Back link */}
				<FadeIn className="mb-6">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Home
					</Link>
				</FadeIn>

				{/* Header */}
				<FadeIn className="mb-8">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
						<FileText className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">Legal</span>
					</div>
					<h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
					<p className="text-muted-foreground">Last updated: January 22, 2025</p>
				</FadeIn>

				{/* Content */}
				<FadeIn>
					<div className="prose prose-neutral dark:prose-invert max-w-none">
						<div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
							<section>
								<h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
								<p className="text-muted-foreground leading-relaxed">
									By accessing and using Pluginator, you agree to be bound by these Terms of
									Service. If you do not agree to these terms, please do not use our service.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
								<p className="text-muted-foreground leading-relaxed">
									Pluginator is a Minecraft server plugin management tool that helps you manage,
									update, and sync plugins across your servers. We offer both free and paid tiers
									with varying features and usage limits.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
								<p className="text-muted-foreground leading-relaxed">
									To use certain features, you must create an account. You are responsible for:
								</p>
								<ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
									<li>Maintaining the security of your account</li>
									<li>All activities that occur under your account</li>
									<li>Providing accurate and complete information</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">4. Subscription and Payments</h2>
								<p className="text-muted-foreground leading-relaxed">
									Paid subscriptions are billed according to the plan you select. Subscriptions
									automatically renew unless cancelled. Refunds are handled on a case-by-case basis.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">5. Acceptable Use</h2>
								<p className="text-muted-foreground leading-relaxed">You agree not to:</p>
								<ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
									<li>Use the service for any illegal purpose</li>
									<li>Attempt to gain unauthorized access to any systems</li>
									<li>Interfere with or disrupt the service</li>
									<li>Share your account credentials with others</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
								<p className="text-muted-foreground leading-relaxed">
									The Pluginator service, including its original content, features, and
									functionality, is owned by its creators and is protected by copyright, trademark,
									and other laws.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
								<p className="text-muted-foreground leading-relaxed">
									Pluginator is provided "as is" without warranties of any kind. We are not liable
									for any damages arising from your use of the service, including but not limited to
									data loss or server issues.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">8. Changes to Terms</h2>
								<p className="text-muted-foreground leading-relaxed">
									We reserve the right to modify these terms at any time. We will notify users of
									significant changes via email or through the service. Continued use after changes
									constitutes acceptance of the new terms.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">9. Contact</h2>
								<p className="text-muted-foreground leading-relaxed">
									If you have any questions about these Terms, please{" "}
									<Link to="/contact" className="text-primary hover:underline">
										contact us
									</Link>
									.
								</p>
							</section>
						</div>
					</div>
				</FadeIn>
			</div>
		</div>
	);
}
