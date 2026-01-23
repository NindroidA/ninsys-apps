import { FadeIn } from "@ninsys/ui/components/animations";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function PrivacyPage() {
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
						<Shield className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">Legal</span>
					</div>
					<h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
					<p className="text-muted-foreground">Last updated: January 22, 2025</p>
				</FadeIn>

				{/* Content */}
				<FadeIn>
					<div className="prose prose-neutral dark:prose-invert max-w-none">
						<div className="rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
							<section>
								<h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
								<p className="text-muted-foreground leading-relaxed">
									When you use Pluginator, we may collect certain information to provide and improve
									our services. This includes:
								</p>
								<ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
									<li>Account information (email, username) when you create an account</li>
									<li>Usage data to track your subscription limits</li>
									<li>Technical data such as your browser type and device information</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
								<p className="text-muted-foreground leading-relaxed">
									We use the information we collect to:
								</p>
								<ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
									<li>Provide and maintain our services</li>
									<li>Process payments and manage subscriptions</li>
									<li>Send important updates about our service</li>
									<li>Improve and develop new features</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
								<p className="text-muted-foreground leading-relaxed">
									We implement appropriate security measures to protect your personal information.
									All data is transmitted securely using SSL/TLS encryption.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
								<p className="text-muted-foreground leading-relaxed">
									We use trusted third-party services to help operate Pluginator:
								</p>
								<ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
									<li>Stripe for payment processing</li>
									<li>Google/GitHub for OAuth authentication</li>
								</ul>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
								<p className="text-muted-foreground leading-relaxed">
									You have the right to access, update, or delete your personal information at any
									time. Contact us at the email below for any privacy-related requests.
								</p>
							</section>

							<section>
								<h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
								<p className="text-muted-foreground leading-relaxed">
									If you have any questions about this Privacy Policy, please{" "}
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
