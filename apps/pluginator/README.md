# Pluginator Web App

The official web application for Pluginator - a CLI tool for managing Minecraft server plugins with ease.

## Features

- **Plugin Management** - Search, install, update, and remove plugins from popular repositories
- **User Authentication** - OAuth login with GitHub and Google
- **Subscription Tiers** - Free, Plus, Pro, and Max plans with usage limits
- **Plugin Marketplace** - Browse and install plugins from the registry
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
│   ├── ErrorBoundary.tsx  # Global error boundary
│   ├── layout/            # Header, Footer, Layout, ThemeToggle
│   ├── auth/              # ProtectedRoute, OAuthButtons
│   ├── pluginator/        # PricingCard, SubscriptionBadge, UsageDashboard
│   └── ui/                # ConfirmDialog
├── config/                # Pricing configuration
├── data/                  # Static data (features, registry, themes)
├── hooks/                 # useAuth, useSubscription, useAccount, etc.
├── lib/                   # Auth utilities, API client
├── pages/
│   ├── public/            # HomePage, PricingPage, LoginPage, etc.
│   ├── dashboard/         # Protected user dashboard
│   ├── account/           # Account management
│   ├── payment/           # Checkout, success, cancel
│   ├── docs/              # Documentation pages
│   ├── marketplace/       # Plugin & theme browsing
│   ├── auth/              # OAuth callback & error
│   └── legal/             # Privacy, Terms
├── types/                 # TypeScript types (tier, registry, theme)
└── styles/                # Global CSS and Pluginator theme
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
- `/dashboard` - User dashboard with usage stats
- `/account` - Account and subscription management
- `/checkout` - Stripe checkout redirect

## Environment Variables

```env
VITE_API_URL=https://api.nindroidsystems.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_...
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
- Pricing tier accent colors (Free/gray, Plus/blue, Pro/purple, Max/amber)
- Dark mode optimized with light mode support

## Related Projects

- [Pluginator CLI](https://github.com/NindroidA/pluginator) - The command-line tool
- [NinSys-API](https://github.com/NindroidA/ninsys-api) - Backend API services

## License

MIT - Nindroid Systems
