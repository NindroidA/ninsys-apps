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
        "3 update checks/day",
        "15 plugin downloads/day",
        "2 server syncs/day",
        "1 prod migration/day",
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
        "10 update checks/day",
        "50 plugin downloads/day",
        "5 server syncs/day",
        "3 prod migrations/day",
        "Backup & restore tools",
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
        "25 update checks/day",
        "150 plugin downloads/day",
        "15 server syncs/day",
        "10 prod migrations/day",
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
        "Unlimited migrations",
        "White-glove onboarding",
      ],
      ctaText: "Subscribe to Max",
    },
  ];
}

export const COMPARISON_FEATURES = [
  {
    name: "Update checks/day",
    free: "3",
    plus: "10",
    pro: "25",
    max: "Unlimited",
  },
  {
    name: "Plugin downloads/day",
    free: "15",
    plus: "50",
    pro: "150",
    max: "Unlimited",
  },
  {
    name: "Server syncs/day",
    free: "2",
    plus: "5",
    pro: "15",
    max: "Unlimited",
  },
  {
    name: "Prod migrations/day",
    free: "1",
    plus: "3",
    pro: "10",
    max: "Unlimited",
  },
  { name: "Backup tools", free: false, plus: true, pro: true, max: true },
  { name: "Priority support", free: false, plus: false, pro: true, max: true },
];
