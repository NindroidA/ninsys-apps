# Cogworks Web App

The official website for Cogworks Discord Bot - a powerful server management bot for ticketing, applications, moderation, and more.

**Live at:** cogworks.nindroidsystems.com

## Features

- Home page with live bot status and statistics
- Feature showcase with detailed explanations
- Command reference with search and filtering
- Real-time bot status monitoring
- Discord-inspired dark theme with light mode option
- Smooth page transitions and animations

## Quick Start

```bash
# From monorepo root
bun install

# Start development server
bun turbo dev --filter=@ninsys/cogworks

# Build for production
bun turbo build --filter=@ninsys/cogworks
```

## Tech Stack

- **Runtime**: Bun
- **Build**: Vite 6 + Turborepo
- **Framework**: React 19
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS v4
- **UI Components**: @ninsys/ui (shared package)
- **Linting**: Biome
- **Routing**: React Router v7
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query
- **State**: Zustand

## Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer, Layout, ThemeToggle
│   └── cogworks/     # BotStatusBadge, StatCard, FeatureCard, CommandCard
├── hooks/            # useBotStatus, useBotStats
├── data/             # commands.ts, features.ts
├── pages/            # HomePage, FeaturesPage, CommandsPage, StatusPage
└── styles/           # Discord-themed CSS
```

## Shared Components

This app uses components from `@ninsys/ui`:

```typescript
import { Button, Card, Badge } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { ScrollLink } from "@ninsys/ui/components/navigation";
import { cn } from "@ninsys/ui/lib";
```

## Configuration

Before deploying, update the following:

1. **Discord Bot Invite URL** - Update in `Header.tsx` and `HomePage.tsx`
2. **Buy Me a Coffee Link** - Update in `Header.tsx` and `Footer.tsx`
3. **API URL** - Set `VITE_API_URL` environment variable

## API Endpoints Used

The app expects these endpoints from NinSys-API:

| Endpoint | Purpose |
|----------|---------|
| `GET /v2/cogworks/status` | Bot online status, latency, uptime |
| `GET /v2/cogworks/stats` | Server count, user count, ticket stats |

## License

MIT - NindroidSystems
