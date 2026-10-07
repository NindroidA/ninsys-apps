# Changelog

## [1.4.4] - 2026-10-06

Now that the API (ninsys-api 2.20.8) returns real rows for the Active lists and accepts the dashboard's requests, several pages still showed buttons that could never apply, crashed, or sent values the API rejected. The dashboard now follows the bot's statuses and the API's shapes.

### Fixed

- **Tickets → Active**: Close and Assign show on every open ticket (the bot's `opened`, `created` and workflow statuses), not just on one status that never occurs. The filter defaults to Active, and "All Status" includes closed tickets. Status badges read Open / Admin Only.
- **Tickets → Restrictions**: the "All types" option is gone (the bot stores restrictions per type), so a restriction needs a ticket type.
- **Applications → Active**: Approve and Deny show until an application is accepted, rejected or archived. Opening an application no longer breaks the panel. The filter defaults to Pending, and "All Status" now really lists everything.
- **Memory**: the status and category controls appear again. Changing an item's status works and highlights the current one. The Channel column shows the channel name. The create form drops the Status choice (new items always start as Open) and applies the category you pick. Renaming a tag refreshes the tag list.
- **Reaction Roles → Create Menu** needs a target channel, so Create stays disabled until you pick one (the bot posts the menu there).
- **Archive Viewer**: the header shows the server ID when the archive has no server name (older bot exports don't include one).

### Added

- **Tests**: unit tests for the ticket and application status rules and the memory tags response.

## [1.4.3] - 2026-10-06

The Bait Channel pages had drifted from what the API (ninsys-api 2.20.8) and the bot send and accept, so the Stats tab showed wrong numbers, Logs and Join Events were empty or blank, and several settings never saved while the page said they had.

### Fixed

- **Stats**: the override rate no longer shows 100 times too high (the bot already sends a percentage), and Total Detections shows the real count. The Avg Suspicion Score card and the Detections by Day chart are gone, because the bot doesn't compute them. An Overridden count takes their place.
- **Logs**: the Action column, the flag count and the detail panel's flags show again. The list is newest first, and the "Log Only" filter finds log-only detections. Override shows only where the row is known to be the user's newest detection (the first row per user on the unfiltered first page), because the bot overrides a user's most recent detection, and never on raid-mode rows. A failed override shows the bot's reason.
- **Join Events** lists joins again, and **Keywords** shows who added each keyword and when (no more "Invalid Date").
- **Config and Whitelist**: test mode, escalation, weekly summary, DM-before-action and the whitelist now save. A save sends only the settings you changed. If the API can't load the settings (for example, the bot is offline), the tab shows an error and a retry button instead of a form of defaults that would overwrite your settings. A server without a bait channel shows how to set one up on both tabs.
- **Config**: the grace period is capped at 60 seconds, like `/baitchannel setup`. An emptied ban reason or warning saves as the bot's default text and the box shows that text again; Reset restores it too. Bot Configuration → "Reset all custom messages" now works for the bait messages.

### Changed

- **Config**: the Additional Bait Channels section is removed until the bot can save extra channels from the dashboard. Before, it showed "saved" but nothing was stored.

### Added

- **Tests**: unit tests for the stats mapper, the flag list, the changed-settings diff and the API client's error handling on bait routes.

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
