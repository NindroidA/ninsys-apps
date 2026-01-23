import { ParallaxElement } from "@ninsys/ui/components/scroll";
import { Button } from "@ninsys/ui/components";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center py-32 px-4 relative overflow-hidden">
			{/* Floating Background Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
				<ParallaxElement speed={0.15} className="absolute" style={{ top: '20%', left: '15%' }}>
					<motion.div
						animate={{
							y: [0, -30, 0],
							rotate: [0, 5, 0],
						}}
						transition={{
							duration: 6,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						className="rounded-full blur-3xl"
						style={{
							width: '300px',
							height: '300px',
							background: 'oklch(0.627 0.265 303.9 / 0.15)',
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={-0.1} className="absolute" style={{ bottom: '25%', right: '20%' }}>
					<motion.div
						animate={{
							y: [0, 20, 0],
							scale: [1, 1.1, 1],
						}}
						transition={{
							duration: 5,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: 1,
						}}
						className="rounded-full blur-3xl"
						style={{
							width: '250px',
							height: '250px',
							background: 'oklch(0.70 0.20 290 / 0.12)',
						}}
					/>
				</ParallaxElement>
				<ParallaxElement speed={0.2} className="absolute" style={{ top: '60%', left: '60%' }}>
					<motion.div
						animate={{
							x: [0, 15, 0],
							y: [0, -15, 0],
						}}
						transition={{
							duration: 7,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: 0.5,
						}}
						className="rounded-full blur-2xl"
						style={{
							width: '150px',
							height: '150px',
							background: 'oklch(0.627 0.265 303.9 / 0.1)',
						}}
					/>
				</ParallaxElement>
			</div>

			{/* Main Content */}
			<div className="text-center relative z-10">
				{/* Animated 404 */}
				<motion.div
					initial={{ opacity: 0, scale: 0.5 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{
						duration: 0.8,
						type: "spring",
						stiffness: 100,
					}}
				>
					<motion.h1
						className="text-8xl sm:text-9xl font-bold gradient-text mb-4"
						animate={{
							textShadow: [
								"0 0 20px oklch(0.627 0.265 303.9 / 0)",
								"0 0 40px oklch(0.627 0.265 303.9 / 0.3)",
								"0 0 20px oklch(0.627 0.265 303.9 / 0)",
							],
						}}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					>
						404
					</motion.h1>
				</motion.div>

				{/* Floating Search Icon */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mb-6"
				>
					<motion.div
						animate={{
							y: [0, -10, 0],
							rotate: [0, 10, -10, 0],
						}}
						transition={{
							duration: 3,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
						className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20"
					>
						<Search className="h-8 w-8 text-primary" />
					</motion.div>
				</motion.div>

				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="text-2xl font-semibold mb-4"
				>
					Page Not Found
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="text-muted-foreground mb-8 max-w-md mx-auto"
				>
					The page you're looking for doesn't exist or has been moved. Let's get you back on track.
				</motion.p>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="flex flex-col sm:flex-row items-center justify-center gap-4"
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button variant="primary" asChild>
							<Link to="/">
								<Home className="mr-2 h-4 w-4" />
								Back to Home
							</Link>
						</Button>
					</motion.div>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Button variant="outline" onClick={() => window.history.back()}>
							<ArrowLeft className="mr-2 h-4 w-4" />
							Go Back
						</Button>
					</motion.div>
				</motion.div>

				{/* Fun animated dots */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.8 }}
					className="mt-12 flex justify-center gap-2"
				>
					{[0, 1, 2].map((i) => (
						<motion.div
							key={i}
							className="w-2 h-2 rounded-full bg-primary/50"
							animate={{
								y: [0, -10, 0],
							}}
							transition={{
								duration: 0.6,
								repeat: Number.POSITIVE_INFINITY,
								delay: i * 0.2,
							}}
						/>
					))}
				</motion.div>
			</div>
		</div>
	);
}
