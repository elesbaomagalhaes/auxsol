# Resolver Conflito de Git na Instância AWS

## Problema
O erro `error: Pulling is not possible because you have unmerged files` indica que há um conflito de merge em andamento que precisa ser resolvido antes de fazer o pull.

## Solução Rápida

### Opção 1: Usar o script automático
```bash
# Na instância AWS, execute:
wget https://raw.githubusercontent.com/seu-usuario/auxsol/main/fix-git-conflict.sh
chmod +x fix-git-conflict.sh
./fix-git-conflict.sh
```

### Opção 2: Comandos manuais
Execute os seguintes comandos na instância AWS:

```bash
# 1. Verificar o status atual
git status

# 2. Abortar o merge em andamento
git merge --abort

# 3. Resetar para o último commit
git reset --hard HEAD

# 4. Limpar arquivos não rastreados
git clean -fd

# 5. Fazer fetch das últimas mudanças
git fetch origin

# 6. Resetar para a versão remota (CUIDADO: isso sobrescreverá mudanças locais)
git reset --hard origin/main

# 7. Verificar se está limpo
git status

# 8. Agora você pode fazer pull normalmente
git pull
```

### Opção 3: Usar o deploy script atualizado
O script `deploy-aws.sh` foi atualizado para resolver automaticamente conflitos de git:

```bash
# Na instância AWS:
./deploy-aws.sh
```

## Prevenção

Para evitar conflitos futuros:

1. **Sempre faça backup** antes de modificar arquivos na instância AWS
2. **Use branches** para desenvolvimento e merge via pull requests
3. **Evite editar arquivos** diretamente na instância de produção
4. **Use o script de deploy** que gerencia automaticamente as atualizações

## Verificação

Após resolver o conflito, verifique se tudo está funcionando:

```bash
# Verificar status do git
git status

# Verificar se os containers estão rodando
docker-compose ps

# Verificar logs se necessário
docker-compose logs --tail=50
```

## Notas Importantes

⚠️ **ATENÇÃO**: O comando `git reset --hard origin/main` irá **sobrescrever todas as mudanças locais**. Certifique-se de que não há mudanças importantes que precisam ser preservadas.

✅ **Recomendação**: Sempre use o script de deploy automatizado para evitar conflitos manuais.