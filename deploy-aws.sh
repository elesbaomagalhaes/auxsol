#!/bin/bash

# Script de deploy para AWS
# Este script configura e executa a aplicação na instância AWS

echo "🚀 Iniciando deploy na AWS..."

# Resolver conflitos de git primeiro
echo "🔧 Verificando e resolvendo conflitos de git..."
if git status | grep -q "unmerged\|You have unmerged files"; then
    echo "⚠️  Conflitos de merge detectados. Resolvendo..."
    git merge --abort 2>/dev/null || echo "Nenhum merge em andamento"
    git reset --hard HEAD
    git clean -fd
    git fetch origin
    git reset --hard origin/main
    echo "✅ Conflitos resolvidos!"
else
    echo "✅ Nenhum conflito detectado"
fi

# Verificar se Docker e Docker Compose estão instalados
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instalando..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down 2>/dev/null || true

# Limpar imagens antigas
echo "🧹 Limpando imagens antigas..."
docker system prune -f

# Verificar sintaxe do docker-compose.yml
echo "✅ Verificando sintaxe do docker-compose.yml..."
if ! docker-compose config > /dev/null 2>&1; then
    echo "❌ Erro na sintaxe do docker-compose.yml"
    echo "Tentando usar arquivo de produção..."
    if [ -f "docker-compose.prod.yml" ]; then
        cp docker-compose.prod.yml docker-compose.yml
        echo "✅ Arquivo de produção copiado"
    else
        echo "❌ Arquivo docker-compose.prod.yml não encontrado"
        exit 1
    fi
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "📝 Criando arquivo .env..."
    cat > .env << EOF
# Configurações de produção AWS
OPENAI_API_KEY=sk-placeholder-key-replace-with-real-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_MAPS_GEOCODING_API_KEY=your-geocoding-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auxsol
NEXTAUTH_SECRET=D2MeSiEeC2zpI7/mbIGaoAoEhmg9k9EHD7k6KDdyB2M=
NEXTAUTH_URL=http://18.233.8.152:3000
NODE_ENV=production
EOF
fi

# Build e start dos containers
echo "🔨 Construindo e iniciando containers..."
docker-compose build --no-cache
docker-compose up -d

# Verificar status
echo "📊 Verificando status dos containers..."
docker-compose ps

# Aguardar aplicação ficar pronta
echo "⏳ Aguardando aplicação ficar pronta..."
sleep 30

# Verificar se a aplicação está respondendo
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Deploy concluído com sucesso!"
    echo "🌐 Aplicação disponível em: http://18.233.8.152:3000"
else
    echo "❌ Aplicação não está respondendo"
    echo "📋 Logs da aplicação:"
    docker-compose logs app
fi

echo "🏁 Script de deploy finalizado."