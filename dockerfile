# syntax=docker/dockerfile:1

############################
# 1) Build stage
############################
FROM node:24-alpine AS build

WORKDIR /app

# Install deps (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy app sources/config needed for the build
COPY svelte.config.* vite.config.* tsconfig*.json ./
COPY src ./src
COPY static ./static

# ensure .svelte-kit/* is generated
RUN npx svelte-kit sync

RUN npm run build

# Prune dev dependencies
RUN npm prune --omit=dev


############################
# 2) Runtime stage
############################
FROM node:24-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copy only what’s needed to run
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build

# SvelteKit node server defaults to 3000 unless you override PORT
ENV PORT=3000
EXPOSE 3000

ENV HOST=0.0.0.0

CMD ["node", "build"]
