#!/bin/bash
# Script de Solução Rápida para Acesso Público

echo "=== SOLUÇÃO RÁPIDA - ACESSO PÚBLICO ==="
echo

# 1. Parar containers
echo "1. Parando containers..."
docker-compose down
sudo pkill -f node 2>/dev/null
echo "✅ Containers parados"
echo

# 2. Limpar sistema
echo "2. Limpando sistema..."
docker system prune -f > /dev/null 2>&1
echo "✅ Sistema limpo"
echo

# 3. Atualizar código
echo "3. Atualizando código..."
git pull origin main
echo "✅ Código atualizado"
echo

# 4. Verificar docker-compose.yml
echo "4. Verificando configuração..."
if ! grep -q "3000:3000" docker-compose.yml; then
    echo "⚠️  Adicionando mapeamento de porta..."
    cp docker-compose.yml docker-compose.yml.backup
    sed -i '/app:/a\    ports:\n      - "3000:3000"' docker-compose.yml
    echo "✅ Mapeamento de porta adicionado"
else
    echo "✅ Mapeamento de porta OK"
fi

if ! grep -q "HOSTNAME.*0.0.0.0" docker-compose.yml; then
    echo "⚠️  Adicionando HOSTNAME..."
    if grep -q "environment:" docker-compose.yml; then
        sed -i '/environment:/a\      - HOSTNAME=0.0.0.0' docker-compose.yml
    else
        sed -i '/app:/a\    environment:\n      - HOSTNAME=0.0.0.0\n      - PORT=3000' docker-compose.yml
    fi
    echo "✅ HOSTNAME configurado"
else
    echo "✅ HOSTNAME OK"
fi
echo

# 5. Iniciar containers
echo "5. Iniciando containers..."
docker-compose up --build -d
echo "✅ Containers iniciados"
echo

# 6. Aguardar inicialização
echo "6. Aguardando inicialização (30 segundos)..."
sleep 30
echo

# 7. Verificar aplicação
echo "7. Verificando aplicação..."
for i in {1..3}; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Aplicação OK na tentativa $i"
        APP_OK=true
        break
    else
        echo "⏳ Tentativa $i/3..."
        sleep 10
    fi
done

if [ "$APP_OK" != "true" ]; then
    echo "❌ Aplicação não está respondendo localmente"
    echo "Verificando logs..."
    docker-compose logs app --tail=10
fi
echo

# 8. Configurar nginx
echo "8. Configurando nginx..."
if ! command -v nginx &> /dev/null; then
    echo "⚠️  Instalando nginx..."
    sudo apt update > /dev/null 2>&1
    sudo apt install nginx -y > /dev/null 2>&1
    echo "✅ Nginx instalado"
else
    echo "✅ Nginx já instalado"
fi

echo "⚠️  Configurando proxy reverso..."
sudo tee /etc/nginx/sites-available/default > /dev/null <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo systemctl restart nginx > /dev/null 2>&1
sudo systemctl enable nginx > /dev/null 2>&1
echo "✅ Nginx configurado"
echo

# 9. Verificar portas
echo "9. Verificando portas..."
if sudo netstat -tlnp | grep -q ":80 "; then
    echo "✅ Porta 80 (nginx) ativa"
else
    echo "❌ Porta 80 não ativa"
fi

if sudo netstat -tlnp | grep -q ":3000 "; then
    echo "✅ Porta 3000 (app) ativa"
else
    echo "❌ Porta 3000 não ativa"
fi
echo

# 10. Resultado
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "=== RESULTADO FINAL ==="
echo "🌐 IP Público: $PUBLIC_IP"
echo
echo "📋 URLs para testar no navegador:"
echo "   1. http://$PUBLIC_IP (via nginx - RECOMENDADO)"
echo "   2. http://$PUBLIC_IP:3000 (direto)"
echo
echo "📊 Status dos containers:"
docker-compose ps
echo
echo "🔧 Status dos serviços:"
echo "   Nginx: $(sudo systemctl is-active nginx)"
echo "   Docker: $(sudo systemctl is-active docker)"
echo
echo "⚠️  IMPORTANTE: Configure os Security Groups no AWS Console!"
echo "   Abra as portas 80, 443 e 3000 para 0.0.0.0/0"
echo
echo "🔍 Para diagnóstico detalhado, execute: ./diagnostico-rede.sh"
echo "📚 Para mais informações, consulte: SOLUCAO-RAPIDA-ACESSO.md"
echo

# 11. Teste final automático
echo "=== TESTE AUTOMÁTICO ==="
echo "Testando conectividade..."

# Teste local
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ Aplicação responde localmente"
else
    echo "❌ Aplicação não responde localmente"
fi

# Teste nginx
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200\|301\|302"; then
    echo "✅ Nginx responde localmente"
else
    echo "❌ Nginx não responde localmente"
fi

echo
echo "🎯 Próximo passo: Teste as URLs acima no seu navegador!"
echo "   Se não funcionar, verifique os Security Groups no AWS Console."