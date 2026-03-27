import { setToken } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function AuthCallbackPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const errorParam = searchParams.get("error");
		const tokenParam = searchParams.get("token");

		// Clear any query params from URL immediately
		window.history.replaceState({}, "", "/auth/callback");

		// Store JWT token from OAuth redirect
		if (tokenParam) {
			setToken(tokenParam);
		}

		if (errorParam) {
			const errorMessages: Record<string, string> = {
				access_denied: "Access was denied",
				invalid_state: "Authentication session expired",
				no_token: "No authentication token received",
				server_error: "An internal error occurred",
			};
			setStatus("error");
			setError(errorMessages[errorParam] ?? "Authentication failed");
			setTimeout(() => navigate("/login?error=auth_failed"), 2000);
			return;
		}

		// Token was stored above from the OAuth redirect query param.
		// Verify the session is valid, then redirect to dashboard.
		getSession().then((session) => {
			if (session) {
				queryClient.removeQueries({ queryKey: ["auth"] });
				setStatus("success");
				setTimeout(() => {
					navigate("/dashboard", { replace: true });
				}, 1500);
			} else {
				setStatus("error");
				setError("Authentication session not found");
				setTimeout(() => navigate("/login?error=no_session"), 2000);
			}
		});
	}, [searchParams, navigate, queryClient]);

	return (
		<div className="min-h-screen flex items-center justify-center py-20">
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				className="text-center"
			>
				{status === "processing" && (
					<>
						<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
						<h1 className="text-2xl font-bold mb-2">Completing Sign In</h1>
						<p className="text-muted-foreground">Please wait...</p>
					</>
				)}

				{status === "success" && (
					<>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 200, damping: 15 }}
						>
							<CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
						</motion.div>
						<h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
						<p className="text-muted-foreground">Redirecting to dashboard...</p>
					</>
				)}

				{status === "error" && (
					<>
						<div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
							<span className="text-3xl">!</span>
						</div>
						<h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
						<p className="text-muted-foreground">{error || "An error occurred"}</p>
						<p className="text-sm text-muted-foreground mt-2">Redirecting to login...</p>
					</>
				)}
			</motion.div>
		</div>
	);
}
