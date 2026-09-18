ARG NODE_VERSION=24.13.0-slim

# Stage 1: dependencies

FROM node:${NODE_VERSION} AS dependencies

WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./

RUN npm ci --no-audit --no-fund

# Stage 2: development

FROM dependencies AS development

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 3: build

FROM node:${NODE_VERSION} AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

ENV NODE_ENV=production

RUN npm run build

# Stage 4: production

FROM node:${NODE_VERSION} AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]