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
}

export function getPricingTiers(hasPlusDiscount: boolean): PricingTierConfig[] {
	return [
		{
			tier: "free",
			name: "Free",
			price: "$0",
			description: "Perfect for getting started with plugin management.",
			features: [
				"10 update checks/day",
				"5 downloads/day",
				"3 syncs/day",
				"1 server",
				"CLI tool access",
				"Community support",
			],
			ctaText: "Current Plan",
		},
		{
			tier: "plus",
			name: "Plus",
			price: "$14.99",
			priceSubtext: "one-time",
			description: "Unlock more features with a one-time purchase.",
			features: [
				"50 update checks/day",
				"25 downloads/day",
				"15 syncs/day",
				"3 servers",
				"Backup & migration tools",
				"40% off Pro forever",
				"20% off Max forever",
			],
			highlighted: true,
			ctaText: "Get Plus",
		},
		{
			tier: "pro",
			name: "Pro",
			price: hasPlusDiscount ? "$2.99" : "$4.99",
			...(hasPlusDiscount && { originalPrice: "$4.99" }),
			priceSubtext: "/month",
			description: "For power users who need more.",
			features: [
				"100 update checks/day",
				"50 downloads/day",
				"30 syncs/day",
				"10 servers",
				"25GB cloud storage",
				"Custom servers",
				"Priority support",
				],
			ctaText: "Subscribe to Pro",
		},
		{
			tier: "max",
			name: "Max",
			price: hasPlusDiscount ? "$7.99" : "$9.99",
			...(hasPlusDiscount && { originalPrice: "$9.99" }),
			priceSubtext: "/month",
			description: "Unlimited access for professionals.",
			features: [
				"Unlimited update checks",
				"Unlimited downloads",
				"Unlimited syncs",
				"Unlimited servers",
				"50GB cloud storage",
				"Custom servers",
				"API access",
				"White-glove onboarding",
				],
			ctaText: "Subscribe to Max",
		},
	];
}

export const COMPARISON_FEATURES = [
	{ name: "Update checks/day", free: "10", plus: "50", pro: "100", max: "Unlimited" },
	{ name: "Downloads/day", free: "5", plus: "25", pro: "50", max: "Unlimited" },
	{ name: "Syncs/day", free: "3", plus: "15", pro: "30", max: "Unlimited" },
	{ name: "Servers supported", free: "1", plus: "3", pro: "10", max: "Unlimited" },
	{ name: "Cloud storage", free: false, plus: false, pro: "25GB", max: "50GB" },
	{ name: "Custom servers", free: false, plus: false, pro: true, max: true },
	{ name: "API access", free: false, plus: false, pro: false, max: true },
	{ name: "Backup tools", free: false, plus: true, pro: true, max: true },
	{ name: "Priority support", free: false, plus: false, pro: true, max: true },
];
