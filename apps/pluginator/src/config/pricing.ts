/**
 * Pricing configuration for Pluginator tiers
 */

import type { Tier } from "@/types/tier";

export interface PricingTierConfig {
	tier: Tier;
	name: string;
	price: string;
	originalPrice?: string;
	priceSubtext?: string;
	description: string;
	features: string[];
	highlighted?: boolean;
	ctaText: string;
	// Annual billing (Pro/Max only)
	annualPrice?: string;
	annualOriginalPrice?: string;
	annualPriceSubtext?: string;
	annualSavings?: string;
}

export function getPricingTiers(hasPlusDiscount: boolean): PricingTierConfig[] {
	return [
		{
			tier: "free",
			name: "Free",
			price: "$0",
			description: "Get started with basic plugin management.",
			features: [
				"Home, Plugins, Updates tabs",
				"1 update check per day",
				"5 plugin downloads per day",
				"1 server sync per day",
				"1 theme (Default Dark)",
				"Basic keyboard navigation",
				"Plugin scanning & JAR detection",
			],
			ctaText: "Current Plan",
		},
		{
			tier: "plus",
			name: "Plus",
			price: "$9.99",
			priceSubtext: "one-time",
			description: "Unlock the full toolkit with a one-time purchase.",
			features: [
				"All tabs unlocked (Servers, Logs, Stats)",
				"Command palette",
				"10 update checks, 50 downloads per day",
				"5 syncs, 3 migrations per day",
				"10+ themes (Catppuccin, Dracula, High Contrast)",
				"Advanced navigation (gg/G, Ctrl+U/D, page jump)",
				"Select all/none/invert",
				"Forward search (/)",
				"Tags & Groups management",
				"Config/Source editors",
				"Plugin registry browser",
				"Rollback support",
				"Keybinding editor",
				"$1.00/mo off Pro, $1.00/mo off Max",
			],
			ctaText: "Buy Now",
		},
		{
			tier: "pro",
			name: "Pro",
			price: hasPlusDiscount ? "$1.99" : "$2.99",
			...(hasPlusDiscount && { originalPrice: "$2.99" }),
			priceSubtext: "/month",
			description: "For power users who need more.",
			highlighted: true,
			features: [
				"Everything in Plus",
				"Full Vim mode (hjkl, motions, marks)",
				"Macro recording & playback",
				"Quick Actions & Jump List navigation",
				"Export/Import configurations",
				"Plugin Profiles & Dependency Graph",
				"Update scheduling (hourly, daily, weekly, custom)",
				"Health Dashboard & Recommendations",
				"25 update checks, 150 downloads per day",
				"15 syncs, 10 migrations per day",
				"Pro themes (Nord, Tokyo Night, Gruvbox, Solarized)",
				"Widget Dashboard",
			],
			ctaText: "Subscribe to Pro",
			annualPrice: hasPlusDiscount ? "$19.99" : "$24.99",
			...(hasPlusDiscount && { annualOriginalPrice: "$24.99" }),
			annualPriceSubtext: "/year",
			annualSavings: hasPlusDiscount ? "Save $3.89/yr" : "Save $10.89/yr",
		},
		{
			tier: "max",
			name: "Max",
			price: hasPlusDiscount ? "$3.99" : "$4.99",
			...(hasPlusDiscount && { originalPrice: "$4.99" }),
			priceSubtext: "/month",
			description: "Unlimited access for professionals.",
			features: [
				"Everything in Pro",
				"Unlimited update checks & downloads",
				"Unlimited syncs & migrations",
				"Full Accessibility (Sticky Keys, Slow Keys)",
				"Animated themes (Synthwave '84, Cyberpunk 2077)",
				"Theme Marketplace access",
				"Priority support",
			],
			ctaText: "Subscribe to Max",
			annualPrice: hasPlusDiscount ? "$39.99" : "$44.99",
			...(hasPlusDiscount && { annualOriginalPrice: "$44.99" }),
			annualPriceSubtext: "/year",
			annualSavings: hasPlusDiscount ? "Save $8.89/yr" : "Save $14.89/yr",
		},
	];
}

export const COMPARISON_FEATURES = [
	// --- Limits ---
	{
		name: "Update checks/day",
		free: "1",
		plus: "10",
		pro: "25",
		max: "Unlimited",
	},
	{
		name: "Plugin downloads/day",
		free: "5",
		plus: "50",
		pro: "150",
		max: "Unlimited",
	},
	{
		name: "Server syncs/day",
		free: "1",
		plus: "5",
		pro: "15",
		max: "Unlimited",
	},
	{
		name: "Prod migrations/day",
		free: "0",
		plus: "3",
		pro: "10",
		max: "Unlimited",
	},
	// --- Features ---
	{
		name: "All tabs (Servers, Logs, Stats)",
		free: false,
		plus: true,
		pro: true,
		max: true,
	},
	{ name: "Command palette", free: false, plus: true, pro: true, max: true },
	{ name: "Tags & Groups", free: false, plus: true, pro: true, max: true },
	{
		name: "Plugin registry browser",
		free: false,
		plus: true,
		pro: true,
		max: true,
	},
	{ name: "Rollback support", free: false, plus: true, pro: true, max: true },
	{ name: "Keybinding editor", free: false, plus: true, pro: true, max: true },
	{ name: "Full Vim mode", free: false, plus: false, pro: true, max: true },
	{ name: "Macro recording", free: false, plus: false, pro: true, max: true },
	{ name: "Plugin Profiles", free: false, plus: false, pro: true, max: true },
	{ name: "Dependency Graph", free: false, plus: false, pro: true, max: true },
	{ name: "Update scheduling", free: false, plus: false, pro: true, max: true },
	{ name: "Health Dashboard", free: false, plus: false, pro: true, max: true },
	{ name: "Widget Dashboard", free: false, plus: false, pro: true, max: true },
	{
		name: "Accessibility features",
		free: false,
		plus: false,
		pro: false,
		max: true,
	},
	{ name: "Animated themes", free: false, plus: false, pro: false, max: true },
	{
		name: "Theme Marketplace",
		free: false,
		plus: false,
		pro: false,
		max: true,
	},
	// --- Themes ---
	{
		name: "Themes",
		free: "1",
		plus: "10+",
		pro: "15+",
		max: "All + Marketplace",
	},
	// --- Support ---
	{ name: "Priority support", free: false, plus: false, pro: false, max: true },
];
