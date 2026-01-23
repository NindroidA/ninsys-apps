import { Button } from "@ninsys/ui/components";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

interface ErrorMessage {
	title: string;
	description: string;
}

const errorMessages: Record<string, ErrorMessage> = {
	token_exchange_failed: {
		title: "Authentication Failed",
		description:
			"We couldn't complete the sign-in process. The authentication provider may be temporarily unavailable.",
	},
	email_not_found: {
		title: "Email Not Found",
		description:
			"We couldn't retrieve your email address from the authentication provider. Please ensure your email is public or try a different sign-in method.",
	},
	oauth_failed: {
		title: "Sign In Failed",
		description: "Something went wrong during the authentication process. Please try again.",
	},
	invalid_state: {
		title: "Session Expired",
		description: "Your authentication session has expired. Please start the sign-in process again.",
	},
	default: {
		title: "Authentication Error",
		description: "An unexpected error occurred during sign-in. Please try again.",
	},
};

const defaultError: ErrorMessage = {
	title: "Authentication Error",
	description: "An unexpected error occurred during sign-in. Please try again.",
};

export function AuthErrorPage() {
	const [searchParams] = useSearchParams();
	const messageKey = searchParams.get("message") || "default";
	const error = errorMessages[messageKey] ?? defaultError;

	return (
		<div className="min-h-screen flex items-center justify-center py-20">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="max-w-md mx-auto text-center px-4"
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ type: "spring", stiffness: 200, damping: 15 }}
					className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6"
				>
					<AlertCircle className="h-10 w-10 text-destructive" />
				</motion.div>

				<h1 className="text-2xl font-bold mb-3">{error.title}</h1>
				<p className="text-muted-foreground mb-8">{error.description}</p>

				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Button variant="primary" asChild>
						<Link to="/login">
							<RefreshCw className="h-4 w-4 mr-2" />
							Try Again
						</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link to="/">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Go Home
						</Link>
					</Button>
				</div>

				<p className="text-sm text-muted-foreground mt-8">
					Need help?{" "}
					<Link to="/contact" className="text-primary hover:underline">
						Contact support
					</Link>
				</p>
			</motion.div>
		</div>
	);
}
