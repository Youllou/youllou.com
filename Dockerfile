# 1. Build stage
FROM node:25-alpine AS builder

WORKDIR /app

# Install dependencies (separately to leverage cache)
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the Nuxt app
RUN npm run build

# 2. Production image
FROM node:25-alpine AS runner

WORKDIR /app

# Install only prod dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.output ./.output

# Add a non-root user
RUN addgroup -S nuxt && adduser -S nuxt -G nuxt
USER nuxt

EXPOSE 3000
ENV NITRO_PORT=3000
ENV HOST=0.0.0.0

CMD ["node", ".output/server/index.mjs"]
