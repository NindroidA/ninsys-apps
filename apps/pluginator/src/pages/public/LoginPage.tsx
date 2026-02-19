import { OAuthButtons } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button, Input } from "@ninsys/ui/components";
import { ParallaxElement } from "@ninsys/ui/components/scroll";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { loginAsync, isLoggingIn, loginError } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const rawFrom = (location.state as { from?: Location })?.from?.pathname || "/dashboard";
	const from = rawFrom.startsWith("/") && !rawFrom.startsWith("//") ? rawFrom : "/dashboard";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await loginAsync({ email, password });
		if (result.success) {
			navigate(from, { replace: true });
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
			{/* Floating Background Orbs */}
			<div
				className="absolute inset-0 overflow-hidden pointer-events-none"
				style={{ zIndex: 0 }}
				aria-hidden="true"
			>
				<ParallaxElement speed={0.1} className="absolute" style={{ top: "15%", left: "10%" }}>
					<motion.div
						animate={{
							y: [0, -20, 0],
							scale: [1, 1.05, 1],
						}}
						transition={{
							duration: 6,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						className="rounded-full blur-3xl"
						style={{
							width: "300px",
							height: "300px",
							background: "oklch(0.627 0.265 303.9 / 0.15)",
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={-0.1} className="absolute" style={{ bottom: "20%", right: "10%" }}>
					<motion.div
						animate={{
							y: [0, 15, 0],
							scale: [1, 0.95, 1],
						}}
						transition={{
							duration: 5,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: 1,
						}}
						className="rounded-full blur-3xl"
						style={{
							width: "250px",
							height: "250px",
							background: "oklch(0.70 0.20 290 / 0.12)",
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={0.15} className="absolute" style={{ top: "60%", left: "60%" }}>
					<motion.div
						animate={{
							x: [0, 10, 0],
							y: [0, -10, 0],
						}}
						transition={{
							duration: 7,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: 0.5,
						}}
						className="rounded-full blur-2xl"
						style={{
							width: "150px",
							height: "150px",
							background: "oklch(0.627 0.265 303.9 / 0.1)",
						}}
					/>
				</ParallaxElement>
			</div>

			{/* Main Content */}
			<motion.div
				initial={{ opacity: 0, y: 40, scale: 0.95 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full max-w-md relative z-10"
			>
				<div className="text-center mb-8">
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Link to="/" className="inline-flex items-center gap-2 mb-6">
							<motion.img
								src="/favicon.svg"
								alt="Pluginator"
								className="h-10 w-10"
								whileHover={{ scale: 1.1, rotate: 5 }}
								transition={{ type: "spring", stiffness: 300 }}
							/>
							<span className="font-bold text-xl">Pluginator</span>
						</Link>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="text-2xl font-bold"
					>
						Welcome back
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="text-muted-foreground mt-2"
					>
						Sign in to access your dashboard
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-xl"
				>
					<OAuthButtons mode="login" />

					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-card px-2 text-muted-foreground">or continue with email</span>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: 0.5 }}
						>
							<Input
								type="email"
								label="Email"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: 0.6 }}
						>
							<Input
								type="password"
								label="Password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</motion.div>

						{loginError && (
							<motion.p
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-sm text-error"
							>
								{loginError.message}
							</motion.p>
						)}

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.7 }}
						>
							<Button type="submit" variant="primary" className="w-full" disabled={isLoggingIn}>
								{isLoggingIn ? "Signing in..." : "Sign in"}
							</Button>
						</motion.div>
					</form>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4, delay: 0.8 }}
						className="text-center text-sm text-muted-foreground mt-6"
					>
						Don't have an account?{" "}
						<Link to="/signup" className="text-primary hover:underline">
							Sign up
						</Link>
					</motion.p>
				</motion.div>
			</motion.div>
		</div>
	);
}
