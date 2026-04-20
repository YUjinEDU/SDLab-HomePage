FROM node:20-alpine3.21 AS base
RUN corepack enable pnpm

FROM base AS builder
WORKDIR /app
# .npmrc must be copied BEFORE pnpm install to apply node-linker=hoisted
COPY frontend/.npmrc ./
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ .
ARG DATABASE_URL
ARG AUTH_SECRET
ARG AUTH_URL
# ARG → ENV 변환: pnpm build 실행 시 환경변수로 노출
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_URL=$AUTH_URL
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ── LibreOffice for Office document → PDF conversion ─────────────────────────
RUN apk add --no-cache libreoffice font-noto font-noto-cjk ttf-freefont \
  && mkdir -p /tmp/nas-preview-cache \
  && chown nextjs:nodejs /tmp/nas-preview-cache

# LibreOffice needs a writable HOME
ENV HOME=/tmp

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENTRYPOINT []
CMD ["node", "server.js"]
