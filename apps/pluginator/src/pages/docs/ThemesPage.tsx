/**
 * Themes Documentation Page
 *
 * Explains the theme system, how to use themes, and tier availability
 */

import { CodeBlock, DocsLayout } from "@/components/docs";
import { THEME_TIER_INFO, THEME_TYPE_INFO } from "@/types/theme";
import { Badge, Card } from "@ninsys/ui/components";
import { Brush, Check, Command, Crown, Moon, Palette, Sparkles, Sun, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

const tierFeatures = [
	{
		tier: "free",
		themes: 5,
		features: ["Default themes", "Basic color schemes", "Dark & light modes"],
	},
	{
		tier: "plus",
		themes: 10,
		features: ["Designer themes", "Accessibility themes", "All Free features"],
	},
	{
		tier: "pro",
		themes: 15,
		features: ["Seasonal themes", "Premium color palettes", "All Plus features"],
	},
	{
		tier: "max",
		themes: 22,
		features: ["Community themes", "Gradient effects", "Animated elements", "All Pro features"],
	},
];

const cliExamples = {
	listThemes: `pluginator theme list

Available Themes:
  default              Default dark theme
  light                Light mode theme
  ocean                Deep ocean blues
  forest               Forest greens
  ...

Use 'pluginator theme set <name>' to change your theme`,
	setTheme: `pluginator theme set ocean

✓ Theme changed to 'ocean'
  Restart Pluginator to see the changes`,
	previewTheme: `pluginator theme preview sunset

╭─────────────────────────────────────╮
│  Sunset Theme Preview               │
├─────────────────────────────────────┤
│  Primary:   #FF6B6B                 │
│  Accent:    #FFE66D                 │
│  Success:   #4ECDC4                 │
│  Warning:   #FFE66D                 │
│  Error:     #FF6B6B                 │
╰─────────────────────────────────────╯`,
	currentTheme: `pluginator theme current

Current Theme: ocean
Type: dark
Tier: free

Colors:
  Background: #0A1929
  Foreground: #E3F2FD
  Primary:    #42A5F5
  Accent:     #26C6DA`,
};

export function ThemesPage() {
	return (
		<DocsLayout title="Themes" description="Customize the look and feel of your Pluginator CLI">
			<div className="prose prose-invert max-w-none">
				{/* Introduction */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<Palette className="h-6 w-6 text-primary" />
						Introduction
					</h2>
					<p className="text-muted-foreground mb-4">
						Pluginator's theme system lets you customize the visual appearance of the CLI to match
						your preferences. From dark developer themes to accessibility-focused high contrast
						options, there's a theme for everyone.
					</p>
					<div className="flex flex-wrap gap-4">
						<Link
							to="/marketplace/themes"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
						>
							<Palette className="h-4 w-4" />
							Browse Theme Gallery
						</Link>
					</div>
				</section>

				{/* Quick Start */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<Command className="h-6 w-6 text-primary" />
						Quick Start
					</h2>
					<div className="space-y-6">
						<div>
							<h3 className="text-lg font-semibold mb-2">List Available Themes</h3>
							<CodeBlock code={cliExamples.listThemes} language="bash" />
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2">Set a Theme</h3>
							<CodeBlock code={cliExamples.setTheme} language="bash" />
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2">Preview a Theme</h3>
							<CodeBlock code={cliExamples.previewTheme} language="bash" />
						</div>
						<div>
							<h3 className="text-lg font-semibold mb-2">Check Current Theme</h3>
							<CodeBlock code={cliExamples.currentTheme} language="bash" />
						</div>
					</div>
				</section>

				{/* Theme Types */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<Sun className="h-6 w-6 text-primary" />
						Theme Types
					</h2>
					<p className="text-muted-foreground mb-4">
						Themes come in two types to suit different preferences and environments:
					</p>
					<div className="grid sm:grid-cols-2 gap-4">
						<Card className="p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="h-10 w-10 rounded-lg bg-gray-900 flex items-center justify-center">
									<Moon className="h-5 w-5 text-gray-100" />
								</div>
								<div>
									<h3 className="font-semibold">{THEME_TYPE_INFO.dark.name}</h3>
									<p className="text-sm text-muted-foreground">
										Optimized for low-light environments
									</p>
								</div>
							</div>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• Easier on the eyes in low-light environments</li>
								<li>• Popular among developers</li>
								<li>• Most themes are dark by default</li>
							</ul>
						</Card>
						<Card className="p-6">
							<div className="flex items-center gap-3 mb-3">
								<div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
									<Sun className="h-5 w-5 text-gray-900" />
								</div>
								<div>
									<h3 className="font-semibold">{THEME_TYPE_INFO.light.name}</h3>
									<p className="text-sm text-muted-foreground">
										High contrast for bright environments
									</p>
								</div>
							</div>
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• Better visibility in bright environments</li>
								<li>• High contrast for readability</li>
								<li>• Good for presentations</li>
							</ul>
						</Card>
					</div>
				</section>

				{/* Theme Tiers */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<Crown className="h-6 w-6 text-primary" />
						Theme Tiers
					</h2>
					<p className="text-muted-foreground mb-4">
						Different themes are available at different subscription tiers. Browse all themes in the
						gallery, but access depends on your plan:
					</p>
					<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{tierFeatures.map((tier) => {
							const info = THEME_TIER_INFO[tier.tier as keyof typeof THEME_TIER_INFO];
							return (
								<Card key={tier.tier} className="p-4">
									<div className="flex items-center gap-2 mb-3">
										<Badge variant="outline" className={`text-xs ${info.color} border-current`}>
											{info.name}
										</Badge>
										<span className="text-sm text-muted-foreground">{tier.themes} themes</span>
									</div>
									<ul className="text-sm space-y-1">
										{tier.features.map((feature) => (
											<li key={feature} className="flex items-start gap-2">
												<Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
												<span className="text-muted-foreground">{feature}</span>
											</li>
										))}
									</ul>
								</Card>
							);
						})}
					</div>
					<p className="text-sm text-muted-foreground mt-4">
						<Link to="/pricing" className="text-primary hover:underline">
							View pricing plans
						</Link>{" "}
						to upgrade your tier and unlock more themes.
					</p>
				</section>

				{/* Theme Categories */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<Brush className="h-6 w-6 text-primary" />
						Theme Categories
					</h2>
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
						<Card className="p-4">
							<h3 className="font-semibold mb-2">Default</h3>
							<p className="text-sm text-muted-foreground">
								Built-in themes that ship with Pluginator. Clean, functional, and suitable for
								everyday use.
							</p>
						</Card>
						<Card className="p-4">
							<h3 className="font-semibold mb-2">Designer</h3>
							<p className="text-sm text-muted-foreground">
								Professionally crafted themes with carefully curated color palettes and visual
								polish.
							</p>
						</Card>
						<Card className="p-4">
							<h3 className="font-semibold mb-2">Accessibility</h3>
							<p className="text-sm text-muted-foreground">
								High contrast themes designed for users with visual impairments. WCAG compliant
								color ratios.
							</p>
						</Card>
						<Card className="p-4">
							<h3 className="font-semibold mb-2">Seasonal</h3>
							<p className="text-sm text-muted-foreground">
								Holiday and seasonal themes for festive occasions. Available during their respective
								seasons.
							</p>
						</Card>
						<Card className="p-4">
							<h3 className="font-semibold mb-2">Community</h3>
							<p className="text-sm text-muted-foreground">
								Themes created by the Pluginator community. Submit your own via GitHub!
							</p>
						</Card>
					</div>
				</section>

				{/* CLI Commands Reference */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<Terminal className="h-6 w-6 text-primary" />
						CLI Commands Reference
					</h2>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-border">
									<th className="text-left py-3 px-4 font-semibold">Command</th>
									<th className="text-left py-3 px-4 font-semibold">Description</th>
								</tr>
							</thead>
							<tbody>
								<tr className="border-b border-border">
									<td className="py-3 px-4">
										<code className="text-xs bg-muted px-2 py-1 rounded">
											pluginator theme list
										</code>
									</td>
									<td className="py-3 px-4 text-muted-foreground">
										List all available themes for your tier
									</td>
								</tr>
								<tr className="border-b border-border">
									<td className="py-3 px-4">
										<code className="text-xs bg-muted px-2 py-1 rounded">
											pluginator theme set &lt;name&gt;
										</code>
									</td>
									<td className="py-3 px-4 text-muted-foreground">
										Set a theme as your active theme
									</td>
								</tr>
								<tr className="border-b border-border">
									<td className="py-3 px-4">
										<code className="text-xs bg-muted px-2 py-1 rounded">
											pluginator theme preview &lt;name&gt;
										</code>
									</td>
									<td className="py-3 px-4 text-muted-foreground">
										Preview a theme's color palette
									</td>
								</tr>
								<tr className="border-b border-border">
									<td className="py-3 px-4">
										<code className="text-xs bg-muted px-2 py-1 rounded">
											pluginator theme current
										</code>
									</td>
									<td className="py-3 px-4 text-muted-foreground">
										Show the currently active theme
									</td>
								</tr>
								<tr className="border-b border-border">
									<td className="py-3 px-4">
										<code className="text-xs bg-muted px-2 py-1 rounded">
											pluginator theme reset
										</code>
									</td>
									<td className="py-3 px-4 text-muted-foreground">Reset to the default theme</td>
								</tr>
							</tbody>
						</table>
					</div>
				</section>

				{/* Premium Features */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
						<Sparkles className="h-6 w-6 text-primary" />
						Premium Features
					</h2>
					<p className="text-muted-foreground mb-4">
						Max tier themes unlock exclusive visual enhancements:
					</p>
					<div className="grid sm:grid-cols-2 gap-4">
						<Card className="p-4 border-yellow-500/30">
							<h3 className="font-semibold mb-2 flex items-center gap-2">
								<span className="h-4 w-4 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
								Gradient Effects
							</h3>
							<p className="text-sm text-muted-foreground">
								Smooth color transitions in headers, progress bars, and UI accents. Create a more
								dynamic and modern look.
							</p>
						</Card>
						<Card className="p-4 border-yellow-500/30">
							<h3 className="font-semibold mb-2 flex items-center gap-2">
								<Sparkles className="h-4 w-4 text-yellow-500" />
								Animated Elements
							</h3>
							<p className="text-sm text-muted-foreground">
								Subtle animations on spinners, progress bars, and status indicators. Configurable
								animation speed or can be disabled.
							</p>
						</Card>
					</div>
				</section>

				{/* Tips */}
				<section>
					<h2 className="text-2xl font-bold mb-4">Tips</h2>
					<ul className="space-y-2 text-muted-foreground">
						<li className="flex items-start gap-2">
							<Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
							<span>
								Use <code className="text-xs bg-muted px-1 rounded">theme preview</code> to try
								themes before committing
							</span>
						</li>
						<li className="flex items-start gap-2">
							<Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
							<span>Accessibility themes are great for outdoor use or bright environments</span>
						</li>
						<li className="flex items-start gap-2">
							<Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
							<span>
								Your theme preference is stored in{" "}
								<code className="text-xs bg-muted px-1 rounded">config.json</code>
							</span>
						</li>
						<li className="flex items-start gap-2">
							<Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
							<span>
								Browse the{" "}
								<Link to="/marketplace/themes" className="text-primary hover:underline">
									Theme Gallery
								</Link>{" "}
								to see visual previews of all themes
							</span>
						</li>
					</ul>
				</section>
			</div>
		</DocsLayout>
	);
}
