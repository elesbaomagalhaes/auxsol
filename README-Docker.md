# Docker Setup para AuxSol

Este guia explica como executar a aplicação AuxSol usando Docker e Docker Compose.

## Pré-requisitos

- Docker
- Docker Compose
- Arquivo `.env` configurado (use `.env.example` como base)

## Configuração Inicial

1. **Copie o arquivo de exemplo de variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```

2. **Configure as variáveis de ambiente no arquivo `.env`:**
   - `DATABASE_URL`: Já configurado para usar o PostgreSQL do Docker
   - `NEXTAUTH_SECRET`: Gere uma chave secreta forte
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Sua chave da API do Google Maps
   - Outras configurações conforme necessário

## Executando a Aplicação

### Primeira execução (build e start)
```bash
docker-compose up --build
```

### Execuções subsequentes
```bash
docker-compose up
```

### Executar em background
```bash
docker-compose up -d
```

## Comandos Úteis

### Parar os containers
```bash
docker-compose down
```

### Parar e remover volumes (CUIDADO: apaga dados do banco)
```bash
docker-compose down -v
```

### Ver logs da aplicação
```bash
docker-compose logs app
```

### Ver logs do banco de dados
```bash
docker-compose logs db
```

### Executar comandos Prisma
```bash
# Gerar cliente Prisma
docker-compose exec app npx prisma generate

# Executar migrações
docker-compose exec app npx prisma migrate deploy

# Abrir Prisma Studio
docker-compose exec app npx prisma studio
```

### Acessar o container da aplicação
```bash
docker-compose exec app sh
```

### Rebuild apenas a aplicação
```bash
docker-compose build app
```

## Estrutura dos Serviços

### App (auxsol-app)
- **Porta:** 3000
- **Imagem:** Build local do Dockerfile
- **Dependências:** PostgreSQL
- **Volumes:** Nenhum (modo standalone)

### Database (auxsol-postgres)
- **Porta:** 5432
- **Imagem:** postgres:15-alpine
- **Volume:** postgres_data (persistente)
- **Credenciais:** postgres/postgres
- **Database:** auxsol

## Troubleshooting

### Problema: "relation does not exist"
```bash
# Execute as migrações manualmente
docker-compose exec app npx prisma migrate deploy
```

### Problema: Aplicação não conecta ao banco
1. Verifique se o banco está rodando: `docker-compose logs db`
2. Verifique a variável DATABASE_URL no .env
3. Aguarde o healthcheck do banco passar

### Problema: Erro de build
```bash
# Limpe o cache do Docker
docker system prune -a

# Rebuild sem cache
docker-compose build --no-cache
```

### Problema: Porta já em uso
```bash
# Mude a porta no docker-compose.yml
ports:
  - "3001:3000"  # Usa porta 3001 no host
```

## Desenvolvimento

Para desenvolvimento, você pode preferir rodar apenas o banco no Docker:

```bash
# Rodar apenas o PostgreSQL
docker-compose up db

# Em outro terminal, rodar a aplicação localmente
npm run dev
```

## Produção

Para produção, certifique-se de:

1. Configurar `NEXTAUTH_SECRET` com uma chave forte
2. Usar `NODE_ENV=production`
3. Configurar adequadamente as variáveis de email e APIs
4. Considerar usar um banco de dados externo
5. Configurar HTTPS e domínio próprio

## Backup do Banco de Dados

```bash
# Criar backup
docker-compose exec db pg_dump -U postgres auxsol > backup.sql

# Restaurar backup
docker-compose exec -T db psql -U postgres auxsol < backup.sql
```