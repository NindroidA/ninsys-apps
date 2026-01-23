import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function AuthCallbackPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const token = searchParams.get("token");
		const errorParam = searchParams.get("error");

		if (errorParam) {
			setStatus("error");
			setError(errorParam);
			setTimeout(() => navigate(`/login?error=${encodeURIComponent(errorParam)}`), 2000);
			return;
		}

		if (!token) {
			setStatus("error");
			setError("No authentication token received");
			setTimeout(() => navigate("/login?error=no_token"), 2000);
			return;
		}

		// Store the token
		localStorage.setItem("pluginator_token", token);

		// Show success briefly, then redirect
		setStatus("success");
		setTimeout(() => {
			navigate("/dashboard", { replace: true });
		}, 1500);
	}, [searchParams, navigate]);

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
