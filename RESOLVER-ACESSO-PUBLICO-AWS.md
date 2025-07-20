# Resolver Problema de Acesso Público na Instância AWS

## Diagnóstico do Problema

Quando o container está rodando mas o endereço público não acessa, geralmente é um problema de:

1. **Security Groups** (mais comum)
2. **Mapeamento de portas**
3. **Configuração do Next.js**
4. **Status da instância**

## Soluções Passo a Passo

### 1. Verificar Security Groups (AWS Console)

**No AWS Console:**
1. Vá para EC2 → Instances
2. Selecione sua instância
3. Aba "Security" → Security Groups
4. Clique no Security Group
5. Aba "Inbound rules"

**Regras necessárias:**
```
Type: HTTP
Protocol: TCP
Port: 80
Source: 0.0.0.0/0

Type: HTTPS
Protocol: TCP
Port: 443
Source: 0.0.0.0/0

Type: Custom TCP
Protocol: TCP
Port: 3000
Source: 0.0.0.0/0
```

### 2. Comandos para Executar na Instância

```bash
# Verificar se os containers estão rodando
docker-compose ps

# Verificar logs da aplicação
docker-compose logs app

# Verificar se a porta 3000 está sendo usada
sudo netstat -tlnp | grep :3000

# Verificar se o Next.js está respondendo localmente
curl http://localhost:3000

# Verificar IP público da instância
curl http://checkip.amazonaws.com
```

### 3. Script de Diagnóstico Automático

Crie o arquivo `diagnostico-rede.sh`:

```bash
#!/bin/bash

echo "=== DIAGNÓSTICO DE REDE AWS ==="
echo

# 1. Verificar containers
echo "1. Status dos containers:"
docker-compose ps
echo

# 2. Verificar portas
echo "2. Portas em uso:"
sudo netstat -tlnp | grep -E ':(80|443|3000)'
echo

# 3. Verificar IP público
echo "3. IP público da instância:"
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "IP Público: $PUBLIC_IP"
echo

# 4. Testar acesso local
echo "4. Teste de acesso local:"
curl -I http://localhost:3000 2>/dev/null && echo "✅ Localhost:3000 OK" || echo "❌ Localhost:3000 FALHOU"
echo

# 5. Verificar logs recentes
echo "5. Logs recentes da aplicação:"
docker-compose logs --tail=10 app
echo

# 6. Verificar configuração do Next.js
echo "6. Verificar se Next.js está configurado para 0.0.0.0:"
docker-compose exec app printenv | grep -E '(HOSTNAME|PORT)'
echo

echo "=== PRÓXIMOS PASSOS ==="
echo "1. Se localhost:3000 funciona mas IP público não:"
echo "   → Verificar Security Groups no AWS Console"
echo "2. Se localhost:3000 não funciona:"
echo "   → Verificar configuração do container"
echo "3. URL para testar: http://$PUBLIC_IP:3000"
```

### 4. Configuração Correta do Docker Compose

Verifique se o `docker-compose.yml` tem o mapeamento correto:

```yaml
services:
  app:
    ports:
      - "3000:3000"  # Mapeia porta 3000 do host para 3000 do container
    environment:
      - HOSTNAME=0.0.0.0  # Permite acesso externo
      - PORT=3000
```

### 5. Soluções Rápidas

#### Opção A: Reiniciar com configuração correta
```bash
# Parar containers
docker-compose down

# Verificar se as portas estão livres
sudo netstat -tlnp | grep :3000

# Iniciar novamente
docker-compose up -d

# Verificar logs
docker-compose logs -f app
```

#### Opção B: Usar nginx como proxy reverso
```bash
# Instalar nginx
sudo apt update
sudo apt install nginx -y

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
```

### 6. Verificação Final

```bash
# Executar diagnóstico
chmod +x diagnostico-rede.sh
./diagnostico-rede.sh

# Testar acesso público
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "Teste este URL no navegador: http://$PUBLIC_IP:3000"

# Se usando nginx:
echo "Ou este URL: http://$PUBLIC_IP"
```

## Checklist de Verificação

- [ ] Security Groups permitem tráfego na porta 3000
- [ ] Container está rodando (`docker-compose ps`)
- [ ] Porta 3000 está mapeada corretamente
- [ ] Next.js está configurado com HOSTNAME=0.0.0.0
- [ ] Localhost:3000 responde na instância
- [ ] IP público está correto
- [ ] Firewall da instância não está bloqueando

## URLs para Testar

```bash
# Obter IP público
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "URL da aplicação: http://$PUBLIC_IP:3000"
```

## Logs Úteis

```bash
# Logs da aplicação
docker-compose logs app

# Logs do sistema
sudo journalctl -u docker -f

# Logs do nginx (se usando)
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

**Nota:** O problema mais comum é a configuração incorreta dos Security Groups. Certifique-se de que as portas 80, 443 e 3000 estão abertas para 0.0.0.0/0 no AWS Console.