/** Allowed Stripe URL prefixes */
const ALLOWED_STRIPE_DOMAINS = [
  "https://checkout.stripe.com",
  "https://billing.stripe.com",
];

/**
 * Validates that a URL is a legitimate Stripe URL.
 * Used before redirecting or opening Stripe-provided URLs.
 */
export function isValidStripeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ALLOWED_STRIPE_DOMAINS.some(
      (domain) => url.startsWith(domain) && parsed.protocol === "https:"
    );
  } catch {
    return false;
  }
}
