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

# 7. Verificar mapeamento de portas
echo "7. Mapeamento de portas do Docker:"
docker-compose port app 3000 2>/dev/null || echo "Porta 3000 não mapeada"
echo

# 8. Verificar se há processos bloqueando a porta
echo "8. Processos usando a porta 3000:"
sudo lsof -i :3000 2>/dev/null || echo "Nenhum processo na porta 3000"
echo

# 9. Testar conectividade interna
echo "9. Teste de conectividade interna:"
telnet localhost 3000 < /dev/null 2>/dev/null && echo "✅ Porta 3000 acessível" || echo "❌ Porta 3000 não acessível"
echo

echo "=== PRÓXIMOS PASSOS ==="
echo "1. Se localhost:3000 funciona mas IP público não:"
echo "   → Verificar Security Groups no AWS Console"
echo "   → Abrir portas 80, 443 e 3000 para 0.0.0.0/0"
echo "2. Se localhost:3000 não funciona:"
echo "   → Verificar configuração do container"
echo "   → Executar: docker-compose restart app"
echo "3. URL para testar: http://$PUBLIC_IP:3000"
echo "4. Se ainda não funcionar, execute: ./fix-network-aws.sh"
echo
echo "=== COMANDOS ÚTEIS ==="
echo "# Reiniciar aplicação:"
echo "docker-compose restart app"
echo
echo "# Ver logs em tempo real:"
echo "docker-compose logs -f app"
echo
echo "# Verificar Security Groups (AWS CLI):"
echo "aws ec2 describe-security-groups --group-ids \$(curl -s http://169.254.169.254/latest/meta-data/security-groups)"