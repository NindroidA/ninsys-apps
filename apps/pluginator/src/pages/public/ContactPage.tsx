import { Button, Card, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Github, Loader2, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const DISCORD_INVITE = "https://discord.gg/cogworks"; // Cogworks Discord community
const GITHUB_ISSUES = "https://github.com/NindroidA/pluginator-public/issues";

export function ContactPage() {
	const [formState, setFormState] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		try {
			const API_URL = import.meta.env.VITE_API_URL || "https://api.nindroidsystems.com";
			const response = await fetch(`${API_URL}/v2/pluginator/contact`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formState),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			setIsSubmitted(true);
			setFormState({ name: "", email: "", subject: "", message: "" });
		} catch {
			setError("Failed to send message. Please try again or contact us directly via email.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormState((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4 max-w-4xl">
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
				<FadeIn className="text-center mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
						<MessageSquare className="h-4 w-4 text-primary" />
						<span className="text-sm font-medium text-primary">Get in Touch</span>
					</div>
					<h1 className="text-4xl font-bold mb-4">Contact Us</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Have questions, feedback, or need support? We'd love to hear from you.
					</p>
				</FadeIn>

				<div className="grid lg:grid-cols-[1fr_300px] gap-8">
					{/* Contact Form */}
					<FadeIn>
						<Card className="p-6 sm:p-8">
							{isSubmitted ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									className="text-center py-8"
								>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{ type: "spring", stiffness: 200, damping: 15 }}
									>
										<CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
									</motion.div>
									<h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
									<p className="text-muted-foreground mb-6">
										Thank you for reaching out. We'll get back to you as soon as possible.
									</p>
									<Button variant="outline" onClick={() => setIsSubmitted(false)}>
										Send Another Message
									</Button>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid sm:grid-cols-2 gap-4">
										<div>
											<label htmlFor="name" className="block text-sm font-medium mb-2">
												Name
											</label>
											<Input
												id="name"
												name="name"
												type="text"
												placeholder="Your name"
												value={formState.name}
												onChange={handleChange}
												required
											/>
										</div>
										<div>
											<label htmlFor="email" className="block text-sm font-medium mb-2">
												Email
											</label>
											<Input
												id="email"
												name="email"
												type="email"
												placeholder="you@example.com"
												value={formState.email}
												onChange={handleChange}
												required
											/>
										</div>
									</div>

									<div>
										<label htmlFor="subject" className="block text-sm font-medium mb-2">
											Subject
										</label>
										<Input
											id="subject"
											name="subject"
											type="text"
											placeholder="What is this about?"
											value={formState.subject}
											onChange={handleChange}
											required
										/>
									</div>

									<div>
										<label htmlFor="message" className="block text-sm font-medium mb-2">
											Message
										</label>
										<textarea
											id="message"
											name="message"
											rows={6}
											placeholder="Tell us more..."
											value={formState.message}
											onChange={handleChange}
											required
											className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
										/>
									</div>

									{error && (
										<div className="p-3 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm">
											{error}
										</div>
									)}

									<Button
										type="submit"
										variant="primary"
										className="w-full"
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Loader2 className="h-4 w-4 mr-2 animate-spin" />
												Sending...
											</>
										) : (
											<>
												<Send className="h-4 w-4 mr-2" />
												Send Message
											</>
										)}
									</Button>
								</form>
							)}
						</Card>
					</FadeIn>

					{/* Sidebar */}
					<FadeIn className="space-y-6">
						{/* Discord */}
						<Card className="p-6">
							<div className="flex items-start gap-4">
								<div className="h-10 w-10 rounded-lg bg-[#5865F2]/10 flex items-center justify-center flex-shrink-0">
									<svg
										className="h-5 w-5 text-[#5865F2]"
										viewBox="0 0 24 24"
										fill="currentColor"
										role="img"
										aria-label="Discord"
									>
										<path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
									</svg>
								</div>
								<div>
									<h3 className="font-semibold mb-1">Discord</h3>
									<p className="text-sm text-muted-foreground mb-2">Join our community</p>
									<a
										href={DISCORD_INVITE}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-primary hover:underline"
									>
										Join Server
									</a>
								</div>
							</div>
						</Card>

						{/* GitHub */}
						<Card className="p-6">
							<div className="flex items-start gap-4">
								<div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
									<Github className="h-5 w-5" />
								</div>
								<div>
									<h3 className="font-semibold mb-1">GitHub Issues</h3>
									<p className="text-sm text-muted-foreground mb-2">
										Report bugs or request features
									</p>
									<a
										href={GITHUB_ISSUES}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-primary hover:underline"
									>
										Open an Issue
									</a>
								</div>
							</div>
						</Card>
					</FadeIn>
				</div>
			</div>
		</div>
	);
}
