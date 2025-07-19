# 🚀 Deploy na AWS - Guia Completo

Este guia fornece instruções detalhadas para fazer o deploy da aplicação AuxSol em uma instância AWS EC2.

## 📋 Pré-requisitos

- Instância AWS EC2 (Ubuntu 20.04+ recomendado)
- Acesso SSH à instância
- Portas 3000 e 5433 abertas no Security Group
- Git instalado na instância

## 🔧 Configuração Inicial da Instância

### 1. Conectar à instância AWS
```bash
ssh -i sua-chave.pem ubuntu@18.233.8.152
```

### 2. Atualizar sistema e instalar dependências
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget
```

### 3. Instalar Docker e Docker Compose
```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sessão para aplicar permissões
exit
# Conectar novamente
ssh -i sua-chave.pem ubuntu@18.233.8.152
```

## 📦 Deploy da Aplicação

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/auxsol.git
cd auxsol
```

### 2. Executar script de deploy automático
```bash
./deploy-aws.sh
```

### 3. Deploy manual (se necessário)
```bash
# Usar arquivo de produção
cp docker-compose.prod.yml docker-compose.yml

# Verificar sintaxe
docker-compose config

# Build e start
docker-compose build --no-cache
docker-compose up -d
```

## 🔍 Solução de Problemas

### Erro: "yaml: line 13: could not find expected ':'"

**Causa**: Problema de sintaxe YAML ou caracteres invisíveis

**Solução**:
```bash
# Usar arquivo de produção limpo
cp docker-compose.prod.yml docker-compose.yml

# Ou recriar o arquivo manualmente
cat > docker-compose.yml << 'EOF'
version: "3.8"

services:
  app:
    build: .
    container_name: auxsol-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/auxsol
      - NEXTAUTH_URL=http://18.233.8.152:3000
      - AUTH_TRUST_HOST=true
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    command: >
      sh -c "npx prisma migrate deploy &&
             npx prisma generate &&
             node server.js"

  db:
    image: postgres:15-alpine
    container_name: auxsol-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: auxsol
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

volumes:
  postgres_data:
EOF
```

### Erro: "Build failed" ou problemas com OpenAI

**Solução**: Configurar variáveis de ambiente
```bash
cat > .env << 'EOF'
OPENAI_API_KEY=sk-placeholder-key-replace-with-real-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auxsol
NEXTAUTH_SECRET=D2MeSiEeC2zpI7/mbIGaoAoEhmg9k9EHD7k6KDdyB2M=
NEXTAUTH_URL=http://18.233.8.152:3000
NODE_ENV=production
EOF
```

### Erro: "Permission denied"

**Solução**: Configurar permissões Docker
```bash
sudo usermod -aG docker $USER
newgrp docker
# Ou reiniciar sessão SSH
```

## 📊 Monitoramento

### Verificar status dos containers
```bash
docker-compose ps
```

### Ver logs da aplicação
```bash
docker-compose logs -f app
```

### Ver logs do banco de dados
```bash
docker-compose logs -f db
```

### Verificar uso de recursos
```bash
docker stats
```

## 🔄 Atualizações

### Atualizar código
```bash
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Backup do banco de dados
```bash
docker-compose exec db pg_dump -U postgres auxsol > backup_$(date +%Y%m%d_%H%M%S).sql
```

## 🌐 Acesso à Aplicação

Após o deploy bem-sucedido:
- **URL**: http://18.233.8.152:3000
- **Banco de dados**: localhost:5433

## 🔐 Configurações de Segurança

### Security Group AWS
Certifique-se de que as seguintes portas estão abertas:
- **22** (SSH)
- **3000** (Aplicação)
- **5433** (PostgreSQL - apenas se necessário acesso externo)

### Variáveis de Ambiente Sensíveis
Substitua os placeholders pelas chaves reais:
- `OPENAI_API_KEY`: Chave da OpenAI
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Chave do Google Maps
- `CLOUDINARY_*`: Credenciais do Cloudinary

## 📞 Suporte

Em caso de problemas:
1. Verificar logs: `docker-compose logs`
2. Verificar sintaxe YAML: `docker-compose config`
3. Reiniciar containers: `docker-compose restart`
4. Rebuild completo: `docker-compose down && docker-compose up -d --build`

---

**Nota**: Este guia assume o IP `18.233.8.152`. Substitua pelo IP real da sua instância AWS.