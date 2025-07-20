# Solução Rápida - Sistema Não Carrega no Navegador

## Comandos Diretos para Executar na Instância AWS

### 1. Diagnóstico Rápido
```bash
# Verificar se containers estão rodando
docker-compose ps

# Verificar logs da aplicação
docker-compose logs app --tail=20

# Testar acesso local
curl -I http://localhost:3000

# Verificar IP público
curl http://checkip.amazonaws.com
```

### 2. Reinicialização Completa
```bash
# Parar tudo
docker-compose down
sudo pkill -f node

# Limpar sistema
docker system prune -f

# Atualizar código
git pull origin main

# Iniciar novamente
docker-compose up --build -d

# Aguardar 30 segundos
sleep 30

# Verificar status
docker-compose ps
docker-compose logs app --tail=10
```

### 3. Verificação de Rede
```bash
# Verificar portas abertas
sudo netstat -tlnp | grep :3000

# Verificar se aplicação responde
for i in {1..5}; do
  echo "Teste $i:"
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
  echo
  sleep 5
done
```

### 4. Configuração de Security Groups (AWS Console)

**IMPORTANTE:** Acesse o AWS Console e configure:

1. **EC2 → Instances → Sua Instância → Security**
2. **Clique no Security Group**
3. **Inbound Rules → Edit Inbound Rules**
4. **Adicione estas regras:**

```
Type: HTTP
Port: 80
Source: 0.0.0.0/0

Type: HTTPS  
Port: 443
Source: 0.0.0.0/0

Type: Custom TCP
Port: 3000
Source: 0.0.0.0/0

Type: SSH
Port: 22
Source: Seu IP ou 0.0.0.0/0
```

### 5. Configuração Nginx (Solução Alternativa)
```bash
# Instalar nginx
sudo apt update
sudo apt install nginx -y

# Configurar proxy
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

# Reiniciar nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Verificar status
sudo systemctl status nginx
```

### 6. Teste Final
```bash
# Obter IP público
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "IP Público: $PUBLIC_IP"

# Testar URLs
echo "Teste estas URLs no navegador:"
echo "1. http://$PUBLIC_IP:3000 (direto)"
echo "2. http://$PUBLIC_IP (via nginx)"

# Verificar se portas estão abertas externamente
nc -zv $PUBLIC_IP 80 2>&1 | grep -q "succeeded" && echo "✅ Porta 80 OK" || echo "❌ Porta 80 BLOQUEADA"
nc -zv $PUBLIC_IP 3000 2>&1 | grep -q "succeeded" && echo "✅ Porta 3000 OK" || echo "❌ Porta 3000 BLOQUEADA"
```

## Script de Solução Automática

```bash
#!/bin/bash
# Salve como: solucao-rapida.sh

echo "=== SOLUÇÃO RÁPIDA - ACESSO PÚBLICO ==="

# 1. Parar containers
echo "1. Parando containers..."
docker-compose down
sudo pkill -f node 2>/dev/null

# 2. Limpar sistema
echo "2. Limpando sistema..."
docker system prune -f

# 3. Atualizar código
echo "3. Atualizando código..."
git pull origin main

# 4. Verificar docker-compose.yml
echo "4. Verificando configuração..."
if ! grep -q "3000:3000" docker-compose.yml; then
    echo "Adicionando mapeamento de porta..."
    cp docker-compose.yml docker-compose.yml.backup
    sed -i '/app:/a\    ports:\n      - "3000:3000"' docker-compose.yml
fi

if ! grep -q "HOSTNAME.*0.0.0.0" docker-compose.yml; then
    echo "Adicionando HOSTNAME..."
    sed -i '/environment:/a\      - HOSTNAME=0.0.0.0' docker-compose.yml
fi

# 5. Iniciar containers
echo "5. Iniciando containers..."
docker-compose up --build -d

# 6. Aguardar inicialização
echo "6. Aguardando inicialização..."
sleep 30

# 7. Verificar aplicação
echo "7. Verificando aplicação..."
for i in {1..3}; do
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Aplicação OK na tentativa $i"
        break
    else
        echo "⏳ Tentativa $i/3..."
        sleep 10
    fi
done

# 8. Configurar nginx
echo "8. Configurando nginx..."
sudo apt update && sudo apt install nginx -y

sudo tee /etc/nginx/sites-available/default > /dev/null <<'EOF'
server {
    listen 80 default_server;
    server_name _;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

sudo systemctl restart nginx
sudo systemctl enable nginx

# 9. Resultado
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo
echo "=== RESULTADO ==="
echo "IP Público: $PUBLIC_IP"
echo "URLs para testar:"
echo "1. http://$PUBLIC_IP (via nginx - RECOMENDADO)"
echo "2. http://$PUBLIC_IP:3000 (direto)"
echo
echo "Status dos containers:"
docker-compose ps
echo
echo "IMPORTANTE: Configure os Security Groups no AWS Console!"
echo "Abra as portas 80, 443 e 3000 para 0.0.0.0/0"
```

## Checklist de Verificação

- [ ] Containers rodando (`docker-compose ps`)
- [ ] Aplicação responde localmente (`curl localhost:3000`)
- [ ] Security Groups configurados (portas 80, 443, 3000)
- [ ] Nginx instalado e configurado
- [ ] IP público obtido
- [ ] URLs testadas no navegador

## Se Ainda Não Funcionar

1. **Verifique os logs:**
   ```bash
   docker-compose logs app
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Teste conectividade externa:**
   ```bash
   # De outro computador/celular
   telnet SEU_IP_PUBLICO 80
   telnet SEU_IP_PUBLICO 3000
   ```

3. **Verifique firewall da instância:**
   ```bash
   sudo ufw status
   sudo iptables -L
   ```

4. **Contate o suporte AWS** se o problema persistir - pode ser limitação da conta ou região.

---

**DICA:** O problema mais comum é a configuração dos Security Groups. Certifique-se de que estão corretos no AWS Console antes de tentar outras soluções.