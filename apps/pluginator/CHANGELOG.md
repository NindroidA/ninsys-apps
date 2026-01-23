# Changelog

All notable changes to Pluginator Web will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-22

### Added
- **Tiered Subscription System**: Full Stripe integration for subscription management
  - Four tiers: Free, Plus ($14.99 one-time), Pro ($4.99/mo), Max ($9.99/mo)
  - Plus discount: permanent 40% off Pro, 20% off Max
  - Daily usage limits displayed per tier
- **New Pages**:
  - `/checkout` - Stripe checkout redirect
  - `/payment/success` - Post-payment success confirmation
  - `/payment/cancel` - Payment cancellation handling
  - `/account` - Account and subscription management
- **New Components**:
  - `PricingCard` - Subscription tier display with discount calculations
  - `SubscriptionBadge` - User tier indicator badge
  - `UsageDashboard` - Usage statistics with progress bars
  - `ProtectedRoute` - Auth-required route wrapper
  - `OAuthButtons` - Google/GitHub login buttons
- **API Hooks**:
  - `useSubscription` - Subscription state and checkout creation
  - `useUsage` - Usage data fetching and tracking
- **Types**:
  - `src/types/tier.ts` - Tier types and constants
  - `src/config/pricing.ts` - Pricing configuration

### Technical Details
- Stripe Checkout (hosted) integration - no custom payment forms
- JWT-based authentication with 24h expiry
- Environment variables: `VITE_API_URL`, `VITE_STRIPE_PUBLISHABLE_KEY`

## [0.1.0] - 2025-01-21

### Added
- Initial release of Pluginator web application
- Homepage with feature overview
- Pricing page (static, no payments)
- Download page for CLI
- Basic authentication (login/signup)
- Dashboard placeholder
- Blue/cyan theme integration with @ninsys/ui
