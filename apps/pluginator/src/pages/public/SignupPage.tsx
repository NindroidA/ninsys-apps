import { ParallaxElement } from "@ninsys/ui/components/scroll";
import { OAuthButtons } from "@/components/auth";
import { Button, Input } from "@ninsys/ui/components";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function SignupPage() {
	const navigate = useNavigate();
	const { registerAsync, isRegistering, registerError } = useAuth();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const result = await registerAsync({ email, password, name: name || undefined });
		if (result.success) {
			navigate("/dashboard", { replace: true });
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
			{/* Floating Background Orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
				<ParallaxElement speed={0.12} className="absolute" style={{ top: '10%', right: '15%' }}>
					<motion.div
						animate={{
							y: [0, -25, 0],
							scale: [1, 1.08, 1],
						}}
						transition={{
							duration: 7,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						className="rounded-full blur-3xl"
						style={{
							width: '350px',
							height: '350px',
							background: 'oklch(0.627 0.265 303.9 / 0.18)',
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={-0.08} className="absolute" style={{ bottom: '15%', left: '5%' }}>
					<motion.div
						animate={{
							y: [0, 20, 0],
							x: [0, 10, 0],
						}}
						transition={{
							duration: 6,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: 0.5,
						}}
						className="rounded-full blur-3xl"
						style={{
							width: '280px',
							height: '280px',
							background: 'oklch(0.70 0.20 290 / 0.14)',
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={0.18} className="absolute" style={{ top: '45%', left: '70%' }}>
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
							opacity: [0.8, 1, 0.8],
						}}
						transition={{
							duration: 5,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: 1,
						}}
						className="rounded-full blur-2xl"
						style={{
							width: '180px',
							height: '180px',
							background: 'oklch(0.627 0.265 303.9 / 0.12)',
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
							<motion.div
								className="h-10 w-10 rounded-xl pluginator-gradient flex items-center justify-center"
								whileHover={{ scale: 1.1, rotate: -5 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<span className="text-2xl">🔌</span>
							</motion.div>
							<span className="font-bold text-xl">Pluginator</span>
						</Link>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.25 }}
						className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
					>
						<Sparkles className="h-3.5 w-3.5 text-primary" />
						<span className="text-xs font-medium text-primary">14-day Pro trial included</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="text-2xl font-bold"
					>
						Create your account
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="text-muted-foreground mt-2"
					>
						Get started with Pluginator Pro features
					</motion.p>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-xl"
				>
					<OAuthButtons mode="signup" />

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
								type="text"
								label="Name (optional)"
								placeholder="Your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: 0.6 }}
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
							transition={{ duration: 0.4, delay: 0.7 }}
						>
							<Input
								type="password"
								label="Password"
								placeholder="••••••••"
								hint="At least 8 characters"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								minLength={8}
								required
							/>
						</motion.div>

						{registerError && (
							<motion.p
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="text-sm text-error"
							>
								{registerError.message}
							</motion.p>
						)}

						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.8 }}
						>
							<Button type="submit" variant="primary" className="w-full" disabled={isRegistering}>
								{isRegistering ? "Creating account..." : "Create account"}
							</Button>
						</motion.div>
					</form>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4, delay: 0.9 }}
						className="text-center text-sm text-muted-foreground mt-6"
					>
						Already have an account?{" "}
						<Link to="/login" className="text-primary hover:underline">
							Sign in
						</Link>
					</motion.p>

					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4, delay: 1 }}
						className="text-center text-xs text-muted-foreground mt-4"
					>
						By signing up, you agree to our{" "}
						<Link to="/terms" className="underline hover:text-primary transition-colors">
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link to="/privacy" className="underline hover:text-primary transition-colors">
							Privacy Policy
						</Link>
					</motion.p>
				</motion.div>
			</motion.div>
		</div>
	);
}
