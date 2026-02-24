# Changelog

## 0.9.0

### Minor Changes

- c5bc7f0: Security hardening, code splitting, and error boundary

### Patch Changes

- Updated dependencies [c5bc7f0]
  - @ninsys/ui@1.0.1

All notable changes to Pluginator Web will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-24

### Added

- **Super Admin Dashboard**: Full admin panel with role-based access control (`/admin`)
  - **Overview Page**: Platform stats (total users, active sessions, revenue), recent tier changes, and audit log
  - **Users Page**: Searchable user list with pagination, click-through to user detail
  - **User Detail Page**: Full user profile with admin actions (change tier, change role, deactivate, revoke sessions)
  - **Sessions Page**: All active sessions across the platform
  - **Tier History Page**: Tier change history with user filtering and pagination
  - **Audit Log Page**: Read-only audit trail with pagination
  - **AdminRoute**: Role-based route guard for admin/super_admin roles
  - **AdminLayout**: Sidebar navigation with mobile bottom tabs
  - **TwoFAVerifyDialog**: Reusable 2FA verification for sensitive admin actions
- **Two-Factor Authentication (TOTP)**: Full 2FA lifecycle
  - **Account Setup**: 3-step flow (QR code, verify code, recovery codes) via TwoFactorSetupDialog
  - **Account Disable**: TOTP code verification to disable 2FA
  - **Login Challenge**: 6-digit code input with auto-advance, auto-submit, paste support, and recovery code fallback
  - **TwoFactorSection**: Account page section showing 2FA status with enable/disable
- **API Token Management (PATs)**: Personal Access Token CRUD
  - **TokensSection**: List tokens with name, prefix, created/last used dates
  - **TokenCreateDialog**: Create tokens with copy-once plaintext display and safety warning
  - Max 2 tokens enforced in UI
- **Session Management**: Active session visibility and control
  - **SessionsSection**: List sessions with device name, auth method, last activity
  - Revoke non-current sessions with tier-based session limits display
- **User Profile Enhancements**:
  - Avatar display (image or initials fallback) on Account page
  - Bio field with 160 character limit
  - Role badge display (developer, admin, super_admin) on Account page header
- **Subscription Expiry Banner**: Dashboard warnings for expiring/expired subscriptions
  - Warning banner when subscription is set to cancel with end date
  - Info banner after downgrade with link to resubscribe
- **Admin Link in Header**: Shield icon link to admin panel in desktop dropdown and mobile menu (admin/super_admin only)

### New Hooks

- `useTokens()`, `useCreateToken()`, `useDeleteToken()` — PAT management
- `useSessions()`, `useRevokeSession()` — Session management
- `useSetup2FA()`, `useConfirm2FA()`, `useDisable2FA()` — 2FA lifecycle
- `useAdminUsers()`, `useAdminUserDetail()`, `useAdminOverview()` — Admin data
- `useAdminChangeTier()`, `useAdminChangeRole()`, `useAdminDeactivateUser()`, `useAdminRevokeSessions()` — Admin actions
- `useAdminSessions()`, `useAdminTierHistory()`, `useAdminAuditLog()` — Admin views

### New Routes

| Path | Page | Auth | Role |
|------|------|------|------|
| `/admin` | AdminDashboardPage | Yes | admin/super_admin |
| `/admin/users` | AdminUsersPage | Yes | admin/super_admin |
| `/admin/users/:id` | AdminUserDetailPage | Yes | admin/super_admin |
| `/admin/sessions` | AdminSessionsPage | Yes | admin/super_admin |
| `/admin/tier-history` | AdminTierHistoryPage | Yes | admin/super_admin |
| `/admin/audit-log` | AdminAuditLogPage | Yes | admin/super_admin |

### Changed

- **Auth Library**: Extended `User` type with `bio`, `totpEnabled`, `role` fields; `login()` now returns `LoginResult` supporting 2FA challenge flow
- **Account Page**: Added 3 new sections (Tokens, Sessions, 2FA) between Connections and Usage; enhanced Profile section with avatar and bio
- **Dashboard Page**: Added subscription expiry/downgrade banners with tier display names
- **Header**: Added admin link for admin/super_admin users
- **SubscriptionInfo Type**: Added `tierExpiresAt` and `downgradeToTier` fields
- **useUpdateProfile**: Now accepts `avatarUrl` and `bio` in addition to `name`

## [0.9.0] - 2026-02-13

### Added

- **Error Boundary**: Global `ErrorBoundary` component wrapping the app in `main.tsx` for graceful crash recovery with refresh button
- **Route-Based Code Splitting**: All non-acquisition routes lazy-loaded with `React.lazy()` and `Suspense`
  - Eagerly loaded: Home, Pricing, Download, Login, Signup (acquisition funnel)
  - Lazy loaded: 25+ remaining routes (docs, marketplace, dashboard, account, etc.)
- **Vite Manual Chunks**: Configured `rollupOptions.manualChunks` for vendor, query, motion, and markdown bundles
- **Nginx Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS, CSP

### Fixed

- **Critical: Checkout Infinite Re-render** (C1): Added `useRef` guard in `CheckoutPage` to prevent duplicate Stripe sessions from `useEffect` re-firing
- **Critical: Hardcoded Dev Bypass Secret** (C2): `api.ts` now reads bypass secret from `VITE_DEV_BYPASS_SECRET` env var instead of hardcoded value
- **Critical: Dev Auth Bypass Always Active** (C3): `useAuth.ts` now requires explicit `VITE_ENABLE_AUTH_BYPASS=true` to enable dev bypass; `DEV_SESSION` changed to function for fresh `expiresAt`
- **Unhandled Mutation Errors** (H1): `UsageDashboard` and `PricingPage` mutation calls wrapped in try/catch
- **Auth Token Leak in URL** (H2): `AuthCallbackPage` clears token/error from URL with `history.replaceState`
- **Raw Error Reflection** (H2/M2): Auth error codes mapped to predefined safe messages instead of reflecting URL params
- **Unsafe Tier Cast** (H4): `PaymentSuccessPage` validates tier param against allowlist before casting
- **Non-JSON Response Crash** (H5): `auth.ts` login/register check `Content-Type` before calling `.json()`
- **Token Not Cleared on Logout Failure** (H6): `localStorage.removeItem` moved before fetch in `logout()` with try/catch
- **Payment Success Not Protected** (M1): `/payment/success` route wrapped in `ProtectedRoute`
- **Open Redirect via Login State** (M3): `LoginPage` validates redirect path starts with `/` and not `//`
- **ConfirmDialog Accessibility** (M4): Added `role="dialog"`, `aria-modal`, `aria-labelledby`, and body scroll lock
- **Redundant Ternary** (M5): Fixed `originalPrice ? "mt-2" : "mt-2"` → `"mt-2"` in `PricingCard`
- **Unstable onCancel Reference** (M7): `ConfirmDialog` stabilizes callback with `useRef`/`useCallback` pattern

### Removed

- **`Header.full.tsx`**: Deleted orphaned file with no imports
- **`PricingTier` type alias**: Removed redundant `export type PricingTier = Tier` from `PricingCard` and re-export from `pluginator/index.ts`
- **`TierPricing` interface**: Removed unused interface from `types/tier.ts`

### Performance

- **Bundle size**: Main chunk reduced from 1,177 KB to 425 KB with code splitting
- Build produces optimized vendor (React/Router), query, motion, and markdown chunks

## [0.8.0] - 2026-02-11

### Added

- **Account Page Rebuild**: Full profile management with 6 sections
  - **Profile**: Inline name editing with pencil icon, member since date, read-only email
  - **Password**: Change password form with current/new/confirm fields, visibility toggles, client-side validation
  - **Connected Accounts**: Google and GitHub OAuth connection status with connect buttons
  - **Danger Zone**: Red-tinted delete account section requiring "DELETE" typed confirmation
- **Account Management Hooks**: New `useAccount.ts` with `useUpdateProfile()`, `useChangePassword()`, `useConnections()`, `useDeleteAccount()`

### Changed

- **Frosted Glass Subscription Badges**: Plus/Pro/Max badges now use translucent gradient effects matching the established frosted glass pattern (SubscriptionBadge and PricingCard tier labels)
- **PricingCard Downgrade Button**: Changed from barely-visible ghost variant to outline with `text-foreground/70` for better visibility
- **Account Page Layout**: Switched from 2-column grid to single-column `max-w-3xl` with distinct Card sections

### Fixed

- **Non-JSON API Response Handling**: `api.ts` now checks Content-Type before parsing as JSON, preventing `SyntaxError` crashes when API returns HTML error pages (e.g. 404)

## [0.7.0] - 2026-02-10

### Added

- **Header User Menu**: Replaced single "Dashboard" button with dropdown menu showing Dashboard, Account, and Sign Out links when authenticated
- **Mobile Account Access**: Added Account and Sign Out buttons to mobile navigation menu
- **Dynamic Pricing Page CTAs**: Pricing cards now show context-aware button states based on user's current subscription
  - "Current Plan" for active tier (disabled)
  - "Upgrade" for higher tiers
  - "Downgrade" for lower tiers with confirmation dialogs
  - "Get Plus" / "Purchased" for Plus add-on (independent of subscription tier)
  - Free card disabled when user has Plus (can't go below Plus)
- **Plus as Independent Purchase**: Pro/Max subscribers can now purchase Plus add-on for permanent discounts
- **Plan Change Support**: Added `useChangePlan()` hook for switching between subscription tiers (e.g. Max to Pro) with Stripe proration
- **Downgrade Confirmation Dialogs**: Cancel and plan-change flows on pricing page with appropriate messaging

### Changed

- **PricingCard**: Added `ctaStyle` prop for visual differentiation of downgrade buttons (ghost style)

### Fixed

- **Tier Badge Not Updating**: DashboardPage now uses `useSubscription()` data for tier badge instead of stale auth session data
- **Post-Payment Cache**: PaymentSuccessPage now also invalidates `auth/session` cache so tier updates immediately

## [0.6.0] - 2026-02-10

### Added

- **Stripe Checkout Integration**: Pricing page CTAs now trigger real Stripe Checkout sessions
  - Logged out users directed to login with returnTo for seamless flow
  - Logged in users on Free tier see upgrade buttons that redirect to Stripe
  - Current plan shown as disabled "Current Plan" button
  - Loading spinner on button while checkout session is created
  - Plus discount automatically applied to Pro/Max pricing display
- **Payment Routes**: Enabled checkout, success, and cancel page routes
  - `/checkout` — creates Stripe session and redirects (protected route)
  - `/payment/success` — confirms payment, invalidates subscription cache
  - `/payment/cancel` — user-friendly cancel message with retry option
- **Billing Management on Account Page**: Full subscription lifecycle UI
  - **Free tier**: "Upgrade Plan" button to pricing page
  - **Plus only**: Plus discount active notice, link to subscribe to Pro/Max
  - **Active subscription**: Shows price, next billing date, with "Change Plan", "Manage Billing" (Stripe portal), and "Cancel" actions
  - **Canceling**: Warning banner with end date and "Reactivate" button
  - **Past due**: Error banner with "Update Payment Method" button (Stripe portal)
- **Cancel/Reactivate Subscription Hooks**: `useCancelSubscription()` and `useReactivateSubscription()` in useSubscription.ts
- **ConfirmDialog Component**: Animated modal overlay for destructive action confirmations (used for cancel subscription)
- **Extended SubscriptionInfo Type**: Added `status`, `cancelAtPeriodEnd`, `currentPeriodEnd`, `priceFormatted` fields
- **PricingCard Enhancements**: Added `ctaDisabled` and `ctaLoading` props with loading spinner

### Changed

- App.tsx: Removed "Coming Soon" payment route redirects, replaced with real page components
- PricingPage: Dynamic CTA text and behavior based on auth state and current subscription tier

## [0.5.1] - 2026-02-10

### Style

- **Frosted glass accent cards**: Full frosted glass effect across all accent cards
  - Cards use gradient backgrounds (`bg-gradient-to-br`) with `/25` opacity and `backdrop-blur-sm`
  - Color spans the entire card area with matching `/40` borders and glow shadows
  - Pricing cards: blue (Plus), purple (Pro), amber (Max) frosted glass
  - Plugin detail: purple (Quick Install), red (Conflicts), blue (Notes)
  - Theme detail: purple (Use This Theme), amber (Premium Features)
  - Homepage beta notice + Pricing beta banner: amber frosted glass
  - Docs security warning: yellow frosted glass
- **Hero badge**: "Open Beta" badge on homepage uses amber gradient frosted glass
- **Navbar BETA badge**: Uses matching amber gradient frosted glass pill
- **Footer version badge**: Blue/indigo/purple gradient pill showing "v{version} beta"

### Fixed

- Download page: Windows card no longer permanently highlighted over macOS/Linux
- Route transitions no longer scroll current page to top before navigating
  - `ScrollLink` default `scrollToTop` changed to `false`
  - `PageTransition` handles scroll-to-top on new page mount (correct timing)

## [0.5.0] - 2026-02-09

### Added

- **Beta Launch**: Full transition from "Coming Soon" to public beta
  - Auth enabled (login, signup, dashboard, account)
  - Payment/checkout routes disabled with redirects to pricing
  - Beta badges throughout the app (header, hero, signup)
  - Beta pricing banner on pricing page with real tier cards
  - Beta disclaimer section on homepage with GitHub Issues link
- **Pricing Page**: Full rewrite with 4 tier cards (Free, Plus, Pro, Max)
  - All purchase CTAs show "Coming Soon" (disabled)
  - Feature comparison table
  - Beta pricing notice
- **Marketplace Routes**: Plugin registry, theme gallery, plugin detail pages
- **Documentation Improvements**:
  - Themes and Security added to docs sidebar navigation
  - "Coming Soon" placeholder for docs not yet published
  - Theme names clickable to copy to clipboard on User Files page
  - Auto-regeneration info added to User Files docs

### Changed

- Header: switched to full auth header with BETA badge, login/signup buttons
- Footer: fixed GitHub repo URL, added bug report link, Buy Me a Coffee URL
- Homepage: hero badge → "Open Beta", CTA subhead → community-focused text
- Homepage: "Secure" highlight → "Smart Backups" to match feature description
- Homepage: improved feature card scroll animation timing
- Download page: platform icons updated (Windows, Apple, Linux brand logos)
- Download page: "Secure" badge → "Smart Backups"
- Minecraft versions: updated to 1.21.4 across registry and version filters
- Cursor: added pointer cursor to theme toggle, hamburger menu, legal dropdown
- Signup page: changed trial badge to "Public Beta"
- Account page: upgrade button shows "Coming Soon" placeholder

### Fixed

- GitHub repo URL: corrected from `pluginator-public` to `pluginator` across all files
- Documentation fetch: removed non-existent `quick-reference/` paths from DOC_PATHS
- Documentation pages that can't fetch content now show helpful "Coming Soon" messages
- Contact page: removed non-existent Discord card, added beta feedback note
- Plugin cards: fixed "0" rendering bug when download count is zero (JSX falsy number issue)
- "Smart Backups" icon: replaced Shield with Archive icon for better visual clarity
- Feature cards: replaced scroll-driven animation with smooth `whileInView` reveal (fixes glitchy/slow cards)
- Header: swapped "Sign in" / "Get Started" button order (primary action first)
- Download cards: consistent height across all OS cards regardless of description length

## [0.3.0] - 2025-01-23

### Added

- **User Files Documentation Page**: Comprehensive guide for Pluginator CLI user files
  - New route: `/docs/user-files`
  - Six documentation sections:
    - Overview of user files location and structure
    - Config file documentation (settings, authentication)
    - Plugin registry file format
    - Sources configuration (Modrinth, Spigot, etc.)
    - Theme customization options
    - Tips and best practices
- **New Components**:
  - `CodeBlock` - JSON syntax highlighting with copy-to-clipboard functionality
  - Responsive card-based documentation layout

### Technical Details

- Uses `react-markdown` with `rehype-highlight` for syntax highlighting
- Accessible code blocks with copy button
- Mobile-responsive layout

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
