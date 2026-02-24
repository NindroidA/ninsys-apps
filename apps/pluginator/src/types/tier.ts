/**
 * Pluginator Tier System Types
 */

export type Tier = "free" | "plus" | "pro" | "max";

export interface TierLimits {
  updateChecksPerDay: number;
  downloadsPerDay: number;
  syncsPerDay: number;
  migrationsPerDay: number;
}

export interface UsageStat {
  used: number;
  limit: number; // -1 for unlimited
  remaining: number; // -1 for unlimited
}

export interface UsageReport {
  tier: Tier;
  today: {
    updateChecks: UsageStat;
    downloads: UsageStat;
    syncs: UsageStat;
    migrations: UsageStat;
  };
}

export type SubscriptionStatus = "active" | "canceling" | "past_due" | "none";

export interface SubscriptionInfo {
  tier: Tier;
  limits: TierLimits;
  hasPlusDiscount: boolean;
  status: SubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  priceFormatted: string | null;
  tierExpiresAt: string | null;
  downgradeToTier: Tier | null;
}

export interface LimitCheckResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
}

export const TIER_DISPLAY: Record<Tier, { name: string; color: string }> = {
  free: { name: "Free", color: "gray" },
  plus: { name: "Plus", color: "blue" },
  pro: { name: "Pro", color: "purple" },
  max: { name: "Max", color: "amber" },
};

export const TIER_HIERARCHY: Tier[] = ["free", "plus", "pro", "max"];

export function getTierLevel(tier: Tier): number {
  return TIER_HIERARCHY.indexOf(tier);
}

export function canUpgradeTo(currentTier: Tier, targetTier: Tier): boolean {
  return getTierLevel(targetTier) > getTierLevel(currentTier);
}
