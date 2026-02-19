/**
 * Pluginator Header - Beta
 *
 * Full header with auth buttons, user menu, and beta badge.
 */

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@ninsys/ui/components";
import { ScrollLink } from "@ninsys/ui/components/navigation";
import { cn } from "@ninsys/ui/lib";
import { AnimatePresence, motion } from "framer-motion";
import {
	ChevronDown,
	Coffee,
	LayoutDashboard,
	LogOut,
	Menu,
	Scale,
	Settings,
	User,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Plugins", href: "/plugins" },
	{ name: "Marketplace", href: "/marketplace" },
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
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const legalDropdownRef = useRef<HTMLDivElement>(null);
	const userMenuRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const { user, isAuthenticated, logout } = useAuth();

	// Close mobile menu on route change
	useEffect(() => {
		setMobileMenuOpen(false);
		setUserMenuOpen(false);
	}, [location.pathname]);

	// Close dropdowns when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (legalDropdownRef.current && !legalDropdownRef.current.contains(event.target as Node)) {
				setLegalDropdownOpen(false);
			}
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setUserMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl backdrop-saturate-150">
			<nav className="container mx-auto flex h-16 items-center justify-between px-4">
				{/* Logo + Beta Badge */}
				<ScrollLink to="/" className="flex items-center gap-2 shrink-0">
					<img src="/favicon.svg" alt="Pluginator" className="h-8 w-8" />
					<span className="font-semibold text-lg hidden sm:block">Pluginator</span>
					<span className="text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25 backdrop-blur-sm border border-amber-500/40 text-amber-500 font-semibold">
						BETA
					</span>
				</ScrollLink>

				{/* Desktop Navigation */}
				<div className="hidden lg:flex items-center gap-1">
					{navigation.map((item) => {
						const isActive =
							item.href === "/"
								? location.pathname === "/"
								: location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

						return (
							<ScrollLink
								key={item.name}
								to={item.href}
								className={cn(
									"px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
									isActive
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:text-foreground hover:bg-muted",
								)}
							>
								{item.name}
							</ScrollLink>
						);
					})}

					{/* Legal Dropdown */}
					<div className="relative" ref={legalDropdownRef}>
						<button
							type="button"
							onClick={() => setLegalDropdownOpen(!legalDropdownOpen)}
							className={cn(
								"flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
								legalLinks.some((link) => location.pathname === link.href)
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:text-foreground hover:bg-muted",
							)}
						>
							<Scale className="h-4 w-4" />
							Legal
							<ChevronDown
								className={cn("h-3 w-3 transition-transform", legalDropdownOpen && "rotate-180")}
							/>
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
				<div className="flex items-center gap-2 shrink-0">
					<ThemeToggle />

					{/* Coffee - desktop only */}
					<a
						href={BUY_ME_A_COFFEE_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
						aria-label="Buy Me a Coffee"
					>
						<Coffee className="h-4 w-4" />
						<span className="hidden xl:inline">Support</span>
					</a>

					{/* Auth buttons - desktop only */}
					{isAuthenticated ? (
						<div className="hidden lg:block relative" ref={userMenuRef}>
							<button
								type="button"
								onClick={() => setUserMenuOpen(!userMenuOpen)}
								className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer"
							>
								<div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
									<User className="h-3.5 w-3.5 text-primary" />
								</div>
								<span className="text-sm font-medium max-w-[120px] truncate">
									{user?.name || user?.email?.split("@")[0] || "Account"}
								</span>
								<ChevronDown
									className={cn("h-3 w-3 transition-transform", userMenuOpen && "rotate-180")}
								/>
							</button>

							<AnimatePresence>
								{userMenuOpen && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.15 }}
										className="absolute top-full right-0 mt-1 w-48 rounded-lg border border-border bg-background shadow-lg overflow-hidden z-50"
									>
										{user?.email && (
											<div className="px-4 py-2.5 border-b border-border">
												<p className="text-xs text-muted-foreground truncate">{user.email}</p>
											</div>
										)}
										<ScrollLink
											to="/dashboard"
											onClick={() => setUserMenuOpen(false)}
											className={cn(
												"flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
												location.pathname === "/dashboard"
													? "bg-primary/10 text-primary"
													: "text-muted-foreground hover:text-foreground hover:bg-muted",
											)}
										>
											<LayoutDashboard className="h-4 w-4" />
											Dashboard
										</ScrollLink>
										<ScrollLink
											to="/account"
											onClick={() => setUserMenuOpen(false)}
											className={cn(
												"flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
												location.pathname === "/account"
													? "bg-primary/10 text-primary"
													: "text-muted-foreground hover:text-foreground hover:bg-muted",
											)}
										>
											<Settings className="h-4 w-4" />
											Account
										</ScrollLink>
										<button
											type="button"
											onClick={() => {
												setUserMenuOpen(false);
												logout();
											}}
											className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer border-t border-border"
										>
											<LogOut className="h-4 w-4" />
											Sign Out
										</button>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					) : (
						<div className="hidden lg:flex items-center gap-2">
							<Button variant="primary" size="sm" asChild>
								<ScrollLink to="/signup">Get Started</ScrollLink>
							</Button>
							<Button variant="ghost" size="sm" asChild>
								<ScrollLink to="/login">Sign in</ScrollLink>
							</Button>
						</div>
					)}

					{/* Mobile/tablet menu button */}
					<button
						type="button"
						className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</button>
				</div>
			</nav>

			{/* Mobile/Tablet Navigation */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="lg:hidden border-t border-border bg-background overflow-hidden"
					>
						<div className="container mx-auto px-4 py-4 space-y-1">
							{navigation.map((item) => {
								const isActive =
									item.href === "/"
										? location.pathname === "/"
										: location.pathname === item.href ||
											location.pathname.startsWith(`${item.href}/`);

								return (
									<ScrollLink
										key={item.name}
										to={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className={cn(
											"block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
											isActive
												? "bg-primary/10 text-primary"
												: "text-muted-foreground hover:text-foreground hover:bg-muted",
										)}
									>
										{item.name}
									</ScrollLink>
								);
							})}

							{/* Legal links */}
							<div className="pt-2 border-t border-border mt-2">
								<p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
									Legal
								</p>
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

							{/* Bottom actions */}
							<div className="pt-3 border-t border-border mt-2 space-y-3">
								<a
									href={BUY_ME_A_COFFEE_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-white text-sm font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
								>
									<Coffee className="h-4 w-4" />
									Buy Me a Coffee
								</a>

								{isAuthenticated ? (
									<div className="space-y-2">
										<Button variant="outline" className="w-full" asChild>
											<ScrollLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
												<LayoutDashboard className="h-4 w-4 mr-2" />
												Dashboard
											</ScrollLink>
										</Button>
										<Button variant="outline" className="w-full" asChild>
											<ScrollLink to="/account" onClick={() => setMobileMenuOpen(false)}>
												<Settings className="h-4 w-4 mr-2" />
												Account
											</ScrollLink>
										</Button>
										<Button
											variant="ghost"
											className="w-full text-muted-foreground"
											onClick={() => {
												setMobileMenuOpen(false);
												logout();
											}}
										>
											<LogOut className="h-4 w-4 mr-2" />
											Sign Out
										</Button>
									</div>
								) : (
									<div className="flex gap-2">
										<Button variant="primary" className="flex-1" asChild>
											<ScrollLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
												Get Started
											</ScrollLink>
										</Button>
										<Button variant="outline" className="flex-1" asChild>
											<ScrollLink to="/login" onClick={() => setMobileMenuOpen(false)}>
												Sign in
											</ScrollLink>
										</Button>
									</div>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
}
