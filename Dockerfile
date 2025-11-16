# Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy root package.json and install dependencies
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY apps/server/src ./apps/server/src

RUN bun install

# Copy web app source
COPY apps/web ./apps/web

# Build the app
WORKDIR /app/apps/web
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
