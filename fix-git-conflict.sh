#!/bin/bash

# Script para resolver conflitos de merge no servidor AWS
# Execute este script na instância AWS para resolver o problema de git pull

echo "🔧 Resolvendo conflitos de merge..."

# Verificar status atual
echo "📊 Status atual do git:"
git status

# Abortar merge em andamento se houver
echo "🚫 Abortando merge em andamento..."
git merge --abort 2>/dev/null || echo "Nenhum merge em andamento"

# Resetar para o último commit
echo "🔄 Resetando para o último commit..."
git reset --hard HEAD

# Limpar arquivos não rastreados
echo "🧹 Limpando arquivos não rastreados..."
git clean -fd

# Fazer fetch das últimas mudanças
echo "📥 Fazendo fetch das últimas mudanças..."
git fetch origin

# Resetar para a versão remota
echo "🔄 Resetando para a versão remota..."
git reset --hard origin/main

# Verificar status final
echo "✅ Status final:"
git status

echo "🎉 Conflitos resolvidos! Agora você pode fazer deploy normalmente."