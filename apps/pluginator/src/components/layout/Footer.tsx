import { ScrollLink } from "@ninsys/ui/components/navigation";
import { Bug, Coffee, Github, MessageCircle } from "lucide-react";
import { version } from "../../../package.json";

const GITHUB_REPO = "https://github.com/NindroidA/pluginator";
const GITHUB_ISSUES = "https://github.com/NindroidA/pluginator/issues";
const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/nindroida";

const DISCORD_INVITE = "https://discord.gg/nkwMUaVSYH";

const footerLinks = {
  product: [
    { name: "Pricing", href: "/pricing" },
    { name: "Download", href: "/download" },
    { name: "Documentation", href: "/docs" },
  ],
  resources: [
    { name: "CLI Commands", href: "/docs/cli" },
    { name: "Configuration", href: "/docs/config" },
    { name: "User Guide", href: "/docs/user-guide" },
    { name: "Changelog", href: "/changelog" },
    {
      name: "Report a Bug",
      href: GITHUB_ISSUES,
      external: true,
    },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <ScrollLink to="/" className="flex items-center gap-2 mb-3">
              <img src="/favicon.svg" alt="Pluginator" className="h-8 w-8" />
              <span className="font-semibold text-lg">Pluginator</span>
            </ScrollLink>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your Minecraft server plugins with ease.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href={GITHUB_ISSUES}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Report a Bug"
              >
                <Bug className="h-5 w-5" />
              </a>
              <a
                href={DISCORD_INVITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
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

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-2 text-sm">Product</h3>
            <ul className="space-y-1.5">
              {footerLinks.product.map((link) => (
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
                "external" in link && link.external ? (
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
                )
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
            <span>&copy; {currentYear} Pluginator by Andrew Curtis</span>
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
          </p>
          <div className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-indigo-500/30">
            <p className="font-medium text-xs text-indigo-400">v{version}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
