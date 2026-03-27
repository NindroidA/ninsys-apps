import { useAuth } from "@/hooks/useAuth";
import { API_REDIRECT_URL } from "@/lib/api";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { SiDiscord } from "react-icons/si";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";

const ERROR_MESSAGES: Record<string, string> = {
	access_denied: "You denied the Discord authorization.",
	invalid_state: "Session expired. Please try again.",
	no_guilds: "No servers found where you're an admin.",
	server_error: "Something went wrong. Please try again.",
};

export function LoginPage() {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();
	const [searchParams] = useSearchParams();

	const errorCode = searchParams.get("error");
	const errorMessage = errorCode
		? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.server_error)
		: null;

	const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
	const from = rawFrom?.startsWith("/dashboard") ? rawFrom : "/dashboard";

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to={from} replace />;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			{/* Background gradient orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
				<div
					className="absolute rounded-full blur-3xl opacity-20"
					style={{
						top: "20%",
						left: "30%",
						width: "300px",
						height: "300px",
						background: "oklch(0.55 0.12 240)",
					}}
				/>
				<div
					className="absolute rounded-full blur-3xl opacity-15"
					style={{
						bottom: "20%",
						right: "25%",
						width: "250px",
						height: "250px",
						background: "oklch(0.72 0.14 75)",
					}}
				/>
			</div>

			<FadeIn>
				<div className="relative max-w-sm w-full">
					<div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-8 shadow-xl">
						{/* Logo */}
						<div className="flex justify-center mb-6">
							<img
								src="/cogworks-bot-icon.png"
								alt="Cogworks"
								className="h-16 w-16 rounded-2xl shadow-lg"
							/>
						</div>

						{/* Heading */}
						<h1 className="text-2xl font-bold text-center mb-1">Welcome to Cogworks</h1>
						<p className="text-center text-muted-foreground mb-8">
							Sign in to manage your Discord server
						</p>

						{/* Error message */}
						{errorMessage && (
							<div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
								{errorMessage}
							</div>
						)}

						{/* Login button */}
						<Button
							className="w-full flex items-center justify-center gap-2"
							onClick={() => {
								window.location.href = `${API_REDIRECT_URL}/auth/discord/login`;
							}}
						>
							<SiDiscord className="h-5 w-5" />
							Login with Discord
						</Button>

						<p className="text-xs text-muted-foreground text-center mt-6">
							You'll be redirected to Discord to authorize access.
							<br />
							We only request access to servers you manage.
						</p>
					</div>
				</div>
			</FadeIn>
		</div>
	);
}
