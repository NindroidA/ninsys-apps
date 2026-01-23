import { ScrollLink } from "@ninsys/ui/components/navigation";
import { Button } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, Menu, X } from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Features", href: "/features" },
	{ name: "Commands", href: "/commands" },
	{ name: "Status", href: "/status" },
];

// TODO: Replace with your Buy Me a Coffee link
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/your-username";

// TODO: Replace with your Discord bot invite URL
const DISCORD_INVITE_URL =
	"https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=8&scope=bot%20applications.commands";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
			<nav className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<ScrollLink to="/" className="flex items-center gap-2">
					<img
						src="/cogworks-bot-icon.png"
						alt="Cogworks"
						className="h-8 w-8 rounded-lg"
					/>
					<span className="font-semibold text-lg hidden sm:block">Cogworks</span>
				</ScrollLink>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-1">
					{navigation.map((item) => (
						<ScrollLink
							key={item.name}
							to={item.href}
							className={cn(
								"px-4 py-2 rounded-lg text-sm font-medium transition-colors",
								location.pathname === item.href
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:text-foreground hover:bg-muted",
							)}
						>
							{item.name}
						</ScrollLink>
					))}
				</div>

				{/* Right side - Theme toggle before coffee cup */}
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<a
						href={BUY_ME_A_COFFEE_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
						aria-label="Buy Me a Coffee"
					>
						<Coffee className="h-4 w-4" />
						<span className="hidden lg:inline">Support</span>
					</a>
					<Button variant="primary" size="sm" className="hidden sm:flex" asChild>
						<a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
							<SiDiscord className="mr-1.5 h-4 w-4" />
							Invite
						</a>
					</Button>

					{/* Mobile menu button */}
					<button
						type="button"
						className="md:hidden p-2 rounded-lg hover:bg-muted"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>
			</nav>

			{/* Mobile Navigation */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="md:hidden border-t border-border bg-background"
					>
						<div className="container mx-auto px-4 py-4 space-y-2">
							{navigation.map((item) => (
								<ScrollLink
									key={item.name}
									to={item.href}
									onClick={() => setMobileMenuOpen(false)}
									className={cn(
										"block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
										location.pathname === item.href
											? "bg-primary/10 text-primary"
											: "text-muted-foreground hover:text-foreground hover:bg-muted",
									)}
								>
									{item.name}
								</ScrollLink>
							))}
							<Button variant="primary" className="w-full mt-4" asChild>
								<a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
									<SiDiscord className="mr-2 h-4 w-4" />
									Invite to Discord
								</a>
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
