FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package.json ./
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN bun install

# Copy server source code
COPY apps/server ./apps/server

WORKDIR /app/apps/server

EXPOSE 5000

CMD ["bun", "run", "src/index.ts"]