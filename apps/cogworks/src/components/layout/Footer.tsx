import { ScrollLink } from "@ninsys/ui/components/navigation";
import { Coffee, Github } from "lucide-react";
import { version } from "../../../package.json";

const footerLinks = {
	bot: [
		{ name: "Features", href: "/features" },
		{ name: "Commands", href: "/commands" },
		{ name: "Status", href: "/status" },
	],
	resources: [
		{ name: "Documentation", href: "/docs" },
		{ name: "Admin Guide", href: "/docs/admin-guide" },
		{ name: "GitHub", href: "https://github.com/NindroidA/cogworks-bot", external: true },
	],
	legal: [
		{ name: "Privacy Policy", href: "/docs/privacy" },
		{ name: "Terms of Service", href: "/docs/terms" },
	],
};

// TODO: Replace with your Buy Me a Coffee link
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/your-username";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border bg-card">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
					{/* Brand */}
					<div className="col-span-2 md:col-span-2">
						<ScrollLink to="/" className="flex items-center gap-2 mb-3">
							<div className="h-8 w-8 rounded-lg cogworks-gradient flex items-center justify-center">
								<span className="text-2xl">🤖</span>
							</div>
							<span className="font-semibold text-lg">Cogworks</span>
						</ScrollLink>
						<p className="text-sm text-muted-foreground mb-4">
							Discord server management made simple. Free and open-source.
						</p>
						<div className="flex items-center gap-3">
							<a
								href="https://github.com/NindroidA/cogworks-bot"
								target="_blank"
								rel="noopener noreferrer"
								className="text-muted-foreground hover:text-foreground transition-colors"
								aria-label="GitHub"
							>
								<Github className="h-5 w-5" />
							</a>
							<a
								href={BUY_ME_A_COFFEE_URL}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
								aria-label="Buy Me a Coffee"
							>
								<Coffee className="h-4 w-4" />
								<span>Support</span>
							</a>
						</div>
					</div>

					{/* Bot Links */}
					<div>
						<h3 className="font-semibold mb-2 text-sm">Bot</h3>
						<ul className="space-y-1.5">
							{footerLinks.bot.map((link) => (
								<li key={link.name}>
									<ScrollLink
										to={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</ScrollLink>
								</li>
							))}
						</ul>
					</div>

					{/* Resources */}
					<div>
						<h3 className="font-semibold mb-2 text-sm">Resources</h3>
						<ul className="space-y-1.5">
							{footerLinks.resources.map((link) =>
								link.external ? (
									<li key={link.name}>
										<a
											href={link.href}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</a>
									</li>
								) : (
									<li key={link.name}>
										<ScrollLink
											to={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</ScrollLink>
									</li>
								),
							)}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="font-semibold mb-2 text-sm">Legal</h3>
						<ul className="space-y-1.5">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<ScrollLink
										to={link.href}
										className="text-sm text-muted-foreground hover:text-foreground transition-colors"
									>
										{link.name}
									</ScrollLink>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-border mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
					<p className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2">
						<span>&copy; {currentYear} Cogworks by Andrew Curtis</span>
						<span className="hidden sm:inline text-border">|</span>
						<span>
							A{" "}
							<a
								href="https://nindroidsystems.com"
								target="_blank"
								rel="noopener noreferrer"
								className="hover:text-foreground transition-colors"
							>
								Nindroid Systems
							</a>{" "}
							project
						</span>
						<span className="hidden sm:inline text-border">|</span>
						<span>Open-source under MIT License</span>
					</p>
					<div className="bg-white/5 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
						<p className="font-medium text-xs">v{version}</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
