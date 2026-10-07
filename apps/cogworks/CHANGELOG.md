# Changelog

## [1.4.2] - 2026-10-06

The API now checks the Super Admin TOTP code itself (ninsys-api 2.20.9): verifying sets a 15-minute grant, and every other admin route needs it. The dashboard now handles the cases where that grant is missing or expired.

### Fixed

- **Super Admin**: when the API asks for TOTP again (its grant expired or is missing), the TOTP form comes back instead of empty admin pages, and you stay logged in. The admin data that failed is reloaded after you verify. The session follows the API's expiry when the API sends one.
- **Super Admin TOTP form**: a verify request that fails (rate limited or a server error) shows the reason and no longer counts as a wrong code toward the 30-second lockout.

### Added

- **Tests**: unit tests for the TOTP rules and the API client's handling of the TOTP 403.

## [1.4.1] - 2026-10-06

### Fixed

- **Delete actions**: deleting or clearing ticket types, restrictions, roles, memory channels and tags, reaction-role menus and options, positions, rules, templates and the status no longer shows an error toast after a successful delete. A success response without `data` now counts as success, so the confirm dialog closes and the row leaves the list.
- **Session refresh**: the 30-minute session refresh no longer sends you to the login page on a rate limit, server error, network error or CSRF hiccup. Only a real expired session (401) redirects.
- **Offline banner**: the "trouble connecting to Cogworks" banner now appears when the bot is offline and clears itself when it comes back. The health check reads the raw `/status` response. An `online: false` with an epoch `lastUpdate` (the API has not heard from the bot since it restarted, or a dev bot that never registers) counts as unknown and does not show the banner.

### Changed

- **Pages with no bot backend**: XP & Levels, Starboard, Events, Onboarding, Ticket SLA, Smart Routing, Incidents and the analytics Config tab are hidden until their bot backend ships. Direct links show a "not in the dashboard yet" page. Each one can be turned back on by removing its line from `UNAVAILABLE_MODULES` in `src/lib/constants.ts`.

### Added

- **Tests**: `bun test` unit tests for `throwOnApiError`, the bot health check and the hidden-module list (`bun run test` in `apps/cogworks`).

## 0.1.2

### Patch Changes

- Updated dependencies [c5bc7f0]
  - @ninsys/ui@1.0.1

All notable changes to the Cogworks Web App will be documented in this file.

## [0.1.1] - January 2026

### Changed

- Migrated API base URL from nindroidsystems.com to api.nindroidsystems.com
- Updated all API endpoint paths from /api/_ to /v2/_

### Migration Notes

- This update requires the ninsys-api v2.0.0 to be deployed
- API subdomain must be configured on server

## [0.1.0] - Initial Release

### Added

- Home page with live bot status and statistics
- Feature showcase with detailed explanations
- Command reference with search and filtering
- Real-time bot status monitoring
- Discord-inspired dark theme with light mode option
- Smooth page transitions and animations
