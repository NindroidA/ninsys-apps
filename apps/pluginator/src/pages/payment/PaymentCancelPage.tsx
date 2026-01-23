/**
 * Payment cancelled page
 */

import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function PaymentCancelPage() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<FadeIn>
				<div className="max-w-md w-full text-center">
					<XCircle className="h-20 w-20 text-muted-foreground mx-auto mb-6" />

					<h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>

					<p className="text-lg text-muted-foreground mb-6">
						Your payment was cancelled. No charges were made to your account.
					</p>

					<div className="p-6 rounded-xl bg-card border border-border mb-6">
						<p className="text-muted-foreground">
							If you have any questions about our plans or need help choosing
							the right tier, feel free to contact us.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button asChild size="lg">
							<Link to="/pricing">View Plans</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link to="/">Go Home</Link>
						</Button>
					</div>
				</div>
			</FadeIn>
		</div>
	);
}
