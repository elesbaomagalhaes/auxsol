FROM node:20-slim AS builder

# Instala ferramentas nativas necessárias
RUN apt-get update && apt-get install -y \
  python3 make g++ openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma

# Instala dependências (incluindo devDependencies para o build)
RUN npm ci && npm cache clean --force

# Gera o cliente Prisma
RUN npx prisma generate

# Copia o código fonte
COPY . .

# Build da aplicação com mais memória
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Etapa de produção
FROM node:20-slim AS runner

# Instala OpenSSL para Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cria usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --home /home/nextjs --shell /bin/bash nextjs
RUN mkdir -p /home/nextjs && chown nextjs:nodejs /home/nextjs

# Copia arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Define permissões corretas
RUN chown -R nextjs:nodejs /app

# Define o usuário
USER nextjs

# Expõe a porta
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando para iniciar a aplicação
CMD ["node", "server.js"]