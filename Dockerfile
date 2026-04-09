FROM mirror.gcr.io/library/node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./

FROM base AS development
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]

FROM base AS builder
ENV NODE_ENV=production
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS deps
ENV NODE_ENV=production
RUN pnpm install --prod --frozen-lockfile

FROM builder AS production
ENV NODE_ENV=production
EXPOSE 3000
ENV PORT=3000
CMD ["pnpm", "preview", "--host", "--port", "3000"]
