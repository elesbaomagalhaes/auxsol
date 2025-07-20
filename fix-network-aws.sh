#!/bin/bash

echo "=== CORREÇÃO AUTOMÁTICA DE REDE AWS ==="
echo

# Função para verificar se comando foi executado com sucesso
check_success() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
    fi
}

# 1. Parar containers
echo "1. Parando containers..."
docker-compose down
check_success "Containers parados"
echo

# 2. Verificar se portas estão livres
echo "2. Verificando portas..."
PORT_3000=$(sudo netstat -tlnp | grep :3000 | wc -l)
if [ $PORT_3000 -gt 0 ]; then
    echo "⚠️  Porta 3000 ainda em uso, tentando liberar..."
    sudo pkill -f "node.*3000" 2>/dev/null
    sleep 2
fi
check_success "Portas verificadas"
echo

# 3. Limpar containers e imagens antigas
echo "3. Limpando containers antigos..."
docker system prune -f > /dev/null 2>&1
check_success "Limpeza concluída"
echo

# 4. Verificar configuração do docker-compose
echo "4. Verificando configuração do docker-compose..."
if grep -q "3000:3000" docker-compose.yml; then
    echo "✅ Mapeamento de porta 3000 encontrado"
else
    echo "❌ Mapeamento de porta 3000 não encontrado"
    echo "Adicionando mapeamento de porta..."
    # Backup do arquivo original
    cp docker-compose.yml docker-compose.yml.backup
    
    # Adicionar mapeamento de porta se não existir
    if ! grep -q "ports:" docker-compose.yml; then
        sed -i '/app:/a\    ports:\n      - "3000:3000"' docker-compose.yml
    fi
fi
echo

# 5. Verificar variáveis de ambiente
echo "5. Verificando variáveis de ambiente..."
if grep -q "HOSTNAME.*0.0.0.0" docker-compose.yml; then
    echo "✅ HOSTNAME configurado para 0.0.0.0"
else
    echo "⚠️  Adicionando HOSTNAME=0.0.0.0..."
    if grep -q "environment:" docker-compose.yml; then
        sed -i '/environment:/a\      - HOSTNAME=0.0.0.0' docker-compose.yml
    else
        sed -i '/app:/a\    environment:\n      - HOSTNAME=0.0.0.0\n      - PORT=3000' docker-compose.yml
    fi
fi
echo

# 6. Iniciar containers
echo "6. Iniciando containers..."
docker-compose up -d
check_success "Containers iniciados"
echo

# 7. Aguardar inicialização
echo "7. Aguardando inicialização (30 segundos)..."
sleep 30
echo

# 8. Verificar se aplicação está respondendo
echo "8. Testando aplicação..."
for i in {1..5}; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Aplicação respondendo na tentativa $i"
        break
    else
        echo "⏳ Tentativa $i/5 - aguardando..."
        sleep 10
    fi
done
echo

# 9. Obter IP público
echo "9. Obtendo informações de acesso..."
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "IP Público: $PUBLIC_IP"
echo

# 10. Configurar nginx como proxy reverso (opcional)
read -p "Deseja configurar nginx como proxy reverso? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "10. Configurando nginx..."
    
    # Instalar nginx se não estiver instalado
    if ! command -v nginx &> /dev/null; then
        sudo apt update
        sudo apt install nginx -y
    fi
    
    # Configurar proxy reverso
    sudo tee /etc/nginx/sites-available/auxsol > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # Ativar configuração
    sudo ln -sf /etc/nginx/sites-available/auxsol /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Reiniciar nginx
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    check_success "Nginx configurado"
    echo "✅ Nginx configurado como proxy reverso"
    echo "🌐 Acesse: http://$PUBLIC_IP (porta 80)"
else
    echo "10. Nginx não configurado"
fi
echo

echo "=== RESULTADO FINAL ==="
echo "🌐 URLs para testar:"
echo "   - Direto: http://$PUBLIC_IP:3000"
if command -v nginx &> /dev/null && systemctl is-active --quiet nginx; then
    echo "   - Via nginx: http://$PUBLIC_IP"
fi
echo
echo "📋 Próximos passos:"
echo "1. Teste as URLs acima no navegador"
echo "2. Se não funcionar, verifique Security Groups no AWS Console:"
echo "   - Abrir porta 80 (HTTP) para 0.0.0.0/0"
echo "   - Abrir porta 443 (HTTPS) para 0.0.0.0/0"
echo "   - Abrir porta 3000 (Custom TCP) para 0.0.0.0/0"
echo "3. Execute './diagnostico-rede.sh' para mais detalhes"
echo
echo "📊 Status atual:"
docker-compose ps