# Stage 1: Build stage
FROM node:lts-alpine AS build

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Copy dependency manifests
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# ... (rest of the top of Dockerfile remains the same)

# Copy the rest of the application source code
COPY . .

# 🚨 THE FIX: Inject ALL required Vite build arguments here
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

ARG VITE_SUPABASE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL

ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Compile production assets
RUN pnpm build

# ... (rest of the bottom of Dockerfile remains the same)

# Stage 2: Production server stage
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 3000