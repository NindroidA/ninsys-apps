/**
 * Pluginator Header - Coming Soon Mode
 *
 * This file replaces Header.tsx on the production branch.
 * Disables auth buttons and shows "Coming Soon" badges.
 */

import { ScrollLink } from "@ninsys/ui/components/navigation";
import { Badge } from "@ninsys/ui/components";
import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Coffee, Menu, Scale, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Pricing", href: "/pricing" },
	{ name: "Download", href: "/download" },
	{ name: "Docs", href: "/docs" },
];

const legalLinks = [
	{ name: "Privacy Policy", href: "/privacy" },
	{ name: "Terms of Service", href: "/terms" },
	{ name: "Contact", href: "/contact" },
];

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/nindroida";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [legalDropdownOpen, setLegalDropdownOpen] = useState(false);
	const legalDropdownRef = useRef<HTMLDivElement>(null);
	const location = useLocation();

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (legalDropdownRef.current && !legalDropdownRef.current.contains(event.target as Node)) {
				setLegalDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
			<nav className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo */}
				<ScrollLink to="/" className="flex items-center gap-2">
					<div className="h-8 w-8 rounded-xl pluginator-gradient flex items-center justify-center">
						<span className="text-2xl">🔌</span>
					</div>
					<span className="font-semibold text-lg hidden sm:block">Pluginator</span>
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

					{/* Legal Dropdown */}
					<div className="relative" ref={legalDropdownRef}>
						<button
							type="button"
							onClick={() => setLegalDropdownOpen(!legalDropdownOpen)}
							className={cn(
								"flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
								legalLinks.some((link) => location.pathname === link.href)
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:text-foreground hover:bg-muted",
							)}
						>
							<Scale className="h-4 w-4" />
							Legal
							<ChevronDown className={cn("h-3 w-3 transition-transform", legalDropdownOpen && "rotate-180")} />
						</button>

						<AnimatePresence>
							{legalDropdownOpen && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.15 }}
									className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-background shadow-lg overflow-hidden z-50"
								>
									{legalLinks.map((link) => (
										<ScrollLink
											key={link.name}
											to={link.href}
											onClick={() => setLegalDropdownOpen(false)}
											className={cn(
												"block px-4 py-2.5 text-sm transition-colors",
												location.pathname === link.href
													? "bg-primary/10 text-primary"
													: "text-muted-foreground hover:text-foreground hover:bg-muted",
											)}
										>
											{link.name}
										</ScrollLink>
									))}
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Right side */}
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

					{/* Mobile menu button */}
					<button
						type="button"
						className="md:hidden p-2 rounded-lg hover:bg-muted"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>

					{/* Coming Soon Auth Buttons */}
					<div className="hidden sm:flex items-center gap-2">
						<Badge variant="secondary" className="text-xs">
							Coming Soon
						</Badge>
					</div>
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

							{/* Legal links in mobile */}
							<div className="pt-2 border-t border-border mt-2">
								<p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Legal</p>
								{legalLinks.map((link) => (
									<ScrollLink
										key={link.name}
										to={link.href}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											"block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
											location.pathname === link.href
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:text-foreground hover:bg-muted",
										)}
									>
										{link.name}
									</ScrollLink>
								))}
							</div>

							{/* Coming Soon Badge for Mobile */}
							<div className="pt-4 border-t border-border mt-2">
								<div className="px-4 py-3 rounded-lg bg-muted/50 text-center">
									<Badge variant="secondary" className="text-xs">
										Sign Up Coming Soon
									</Badge>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
