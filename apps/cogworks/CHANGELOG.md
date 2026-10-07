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
