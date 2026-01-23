# Nindroid Systems Apps

A monorepo containing Nindroid Systems web applications with shared UI components.

## Apps

| App | Description | Port |
|-----|-------------|------|
| [Cogworks](./apps/cogworks) | Cogworks Bot companion website | 5175 |
| [Pluginator](./apps/pluginator) | Minecraft plugin manager | 5174 |

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: React 19
- **Styling**: Tailwind CSS v4
- **Build**: Vite + Turborepo
- **Language**: TypeScript
- **Linting**: Biome
- **Containers**: Docker + Nginx

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Docker](https://www.docker.com/) (for containerized deployment)

### Development

```bash
# Start all apps
bun dev

# Start a specific app
bun turbo dev --filter=@ninsys/cogworks
bun turbo dev --filter=@ninsys/pluginator
```

### Linting

```bash
bun lint
bun biome check --write
```

## Project Structure

```
ninsys-apps/
├── apps/
│   ├── cogworks/          # Discord bot landing page
│   └── pluginator/        # Plugin manager webapp
├── packages/
│   └── ui/                # Shared components (@ninsys/ui)
├── .github/workflows/     # CI/CD
├── docker-compose.yml
└── turbo.json
```

## License

[MIT](./LICENSE)

## Development

This project's development has been accelerated through the use of AI-assisted development tools, including GitHub Copilot, Claude Code, and other AI programming assistants. These tools have enhanced productivity while maintaining code quality and best practices. All AI-generated code has been reviewed, tested, and refined to ensure reliability.