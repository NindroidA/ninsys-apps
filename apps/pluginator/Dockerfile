# ============================================
# Pluginator Webapp - Production Dockerfile
# Multi-stage build for optimal image size
# ============================================

# Stage 1: Install dependencies
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copy workspace files for dependency resolution
COPY package.json bun.lock turbo.json ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/pluginator/package.json ./apps/pluginator/

# Install all dependencies (Bun hoists to root node_modules)
RUN bun install

# ============================================
# Stage 2: Build the application
# ============================================
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage (only root node_modules)
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build only this app (Turborepo handles dependencies)
RUN bun turbo build --filter=@ninsys/pluginator

# ============================================
# Stage 3: Production server
# ============================================
FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/apps/pluginator/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/pluginator/nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
