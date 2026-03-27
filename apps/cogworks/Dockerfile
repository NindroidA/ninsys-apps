# ============================================
# Cogworks Webapp - Production Dockerfile
# Multi-stage build for optimal image size
# ============================================

# Stage 1: Install dependencies
FROM oven/bun:1-alpine AS deps
WORKDIR /app

# Copy workspace files for dependency resolution
COPY package.json bun.lock turbo.json ./
COPY packages/ui/package.json ./packages/ui/
COPY apps/cogworks/package.json ./apps/cogworks/

# Install all dependencies (Bun hoists to root node_modules)
RUN bun install

# ============================================
# Stage 2: Build the application
# ============================================
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Build args for Vite env vars
ARG VITE_BOT_CLIENT_ID
ENV VITE_BOT_CLIENT_ID=$VITE_BOT_CLIENT_ID

# Copy dependencies from deps stage (only root node_modules)
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build only this app (Turborepo handles dependencies)
RUN bun turbo build --filter=@ninsys/cogworks

# ============================================
# Stage 3: Production server
# ============================================
FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/apps/cogworks/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/cogworks/nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
