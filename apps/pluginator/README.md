# Pluginator Web App

The official web application for Pluginator - a CLI tool for managing Minecraft server plugins with ease.

## Features

- **Plugin Management** - Search, install, update, and remove plugins from popular repositories
- **User Authentication** - OAuth login with GitHub and Google
- **Subscription Tiers** - Free, Pro, and Enterprise plans with different feature sets
- **License Management** - Activate and manage your Pluginator license
- **Download Portal** - Get the latest CLI releases for all platforms

## Quick Start

```bash
# From monorepo root
bun install

# Start development server
bun turbo dev --filter=@ninsys/pluginator

# Build for production
bun turbo build --filter=@ninsys/pluginator
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
│   ├── auth/         # ProtectedRoute, OAuthButtons
│   └── pluginator/   # PricingCard, SubscriptionBadge
├── data/             # Static data (pricing, features)
├── hooks/            # useAuth, custom hooks
├── lib/              # Auth utilities, helpers
├── pages/
│   ├── public/       # HomePage, PricingPage, LoginPage, etc.
│   └── dashboard/    # Protected user dashboard
└── styles/           # Global CSS and Pluginator theme
```

## Shared Components

This app uses components from `@ninsys/ui`:

```typescript
import { Button, Card, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
```

## Pages

### Public Pages
- `/` - Home page with features and CTA
- `/pricing` - Subscription tier comparison
- `/download` - CLI download links for all platforms
- `/login` - User authentication
- `/signup` - New user registration

### Protected Pages
- `/dashboard` - User dashboard with license and subscription info

## Environment Variables

```env
VITE_API_URL=https://api.nindroidsystems.com
```

## Docker Deployment

```bash
# Build container
docker-compose build pluginator

# Run container
docker-compose up -d pluginator

# Access at http://localhost:3002
```

## Theme

Pluginator uses a blue/cyan color scheme with OKLCH colors for better color consistency. The theme includes:

- Primary blue gradient
- Pricing tier accent colors (Free, Pro, Enterprise)
- Dark mode optimized with light mode support

## Related Projects

- [Pluginator CLI](https://github.com/NindroidA/pluginator) - The command-line tool
- [NinSys-API](https://github.com/NindroidA/ninsys-api) - Backend API services

## License

MIT - NindroidSystems
