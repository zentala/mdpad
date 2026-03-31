# Stage 1: Build
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

# Copy repo structure needed for build-content.ts
COPY prototype/package.json prototype/pnpm-lock.yaml prototype/
COPY prototype/scripts prototype/scripts
COPY prototype/src prototype/src
COPY prototype/tsconfig.json prototype/
COPY prototype/vite.config.ts prototype/
COPY prototype/public prototype/public
COPY prototype/index.html prototype/

# Copy root-level markdown and config files for content generation
COPY *.md ./
COPY .arch .arch
COPY .plan .plan
COPY catalog-info.yaml* ./

# Use MDPAD_CONTENT_DIR instead of git-based repo root detection
ENV MDPAD_CONTENT_DIR=/app

# Install dependencies and build
WORKDIR /app/prototype
RUN pnpm install --frozen-lockfile
RUN pnpm build

# Stage 2: Serve
FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/prototype/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
