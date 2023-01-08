# Install dependencies only when needed
FROM node:16-alpine AS deps
# Args are provided at build time from github action secrets, those get transfered to envs
ARG DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG STORAGE_SASTOKEN
ARG STORAGE_RESOURCE_NAME
ARG JWT_SECRET
ENV DATABASE_URL ${DATABASE_URL}
ENV NEXTAUTH_SECRET ${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL ${NEXTAUTH_URL}
ENV STORAGE_SASTOKEN ${STORAGE_SASTOKEN}
ENV STORAGE_RESOURCE_NAME ${STORAGE_RESOURCE_NAME}
ENV JWT_SECRET ${JWT_SECRET}

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock ./ 
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY next.config.js ./
COPY package.json yarn.lock ./ 
COPY --from=deps /app/node_modules ./node_modules

COPY .env.staging ./.env

COPY . .

RUN yarn build:staging

# Prodcution image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]