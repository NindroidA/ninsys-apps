import type { DiscordUser } from "@/types/auth";
import { Button } from "@ninsys/ui/components";
import { ScrollLink } from "@ninsys/ui/components/navigation";
import { cn } from "@ninsys/ui/lib";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { SiDiscord } from "react-icons/si";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Docs", href: "/docs" },
  { name: "Commands", href: "/commands" },
  { name: "Status", href: "/status" },
];

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/nindroida";
const DISCORD_SERVER_URL = "https://discord.gg/nkwMUaVSYH";
const BOT_CLIENT_ID = import.meta.env.VITE_BOT_CLIENT_ID;
const DISCORD_INVITE_URL = BOT_CLIENT_ID
  ? `https://discord.com/oauth2/authorize?client_id=${BOT_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`
  : undefined;

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  // Subscribe reactively to auth cache without triggering a fetch on public pages
  const { data: user } = useQuery<DiscordUser | null>({
    queryKey: ["auth", "me"],
    queryFn: () => Promise.resolve(null),
    enabled: false,
  });
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <ScrollLink to="/" className="flex items-center gap-2">
          <img
            src="/cogworks-bot-icon.png"
            alt="Cogworks"
            className="h-8 w-8 rounded-lg"
          />
          <span className="font-semibold text-lg hidden sm:block">
            Cogworks
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25 border border-amber-500/40 text-amber-500 font-semibold hidden sm:inline">
            BETA
          </span>
        </ScrollLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <ScrollLink
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.href ||
                  (item.href !== "/" && location.pathname.startsWith(item.href))
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
          {DISCORD_INVITE_URL && (
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiDiscord className="mr-1.5 h-4 w-4" />
                Invite Bot
              </a>
            </Button>
          )}
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-1.5 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <Link to="/login">
                <LogIn className="mr-1.5 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
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
                    location.pathname === item.href ||
                      (item.href !== "/" &&
                        location.pathname.startsWith(item.href))
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </ScrollLink>
              ))}
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-primary bg-primary/10"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Login
                </Link>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href={DISCORD_SERVER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiDiscord className="mr-2 h-4 w-4" />
                    Join Server
                  </a>
                </Button>
                {DISCORD_INVITE_URL && (
                  <Button variant="primary" className="flex-1" asChild>
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SiDiscord className="mr-2 h-4 w-4" />
                      Invite Bot
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
