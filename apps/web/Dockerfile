# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000

# Copy root and workspace package files
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY apps/server/package.json ./apps/server/
COPY apps/server/src/types.ts ./apps/server/src/types.ts

# Install all dependencies (including devDependencies)
RUN bun install

# Copy web app source files
COPY apps/web ./apps/web

# Build the app
WORKDIR /app/apps/web
ENV VITE_API_URL=${VITE_API_URL}
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
