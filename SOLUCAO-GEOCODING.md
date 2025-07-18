# 🔧 Solução para Problema de Geocodificação

## ❌ Problema Identificado

O diagnóstico revelou que a **Geocodificação** e **Geocodificação Reversa** estão falhando com o erro:

```
REQUEST_DENIED: API keys with referer restrictions cannot be used with this API.
```

## 🎯 Causa Raiz

A API Key do Google Maps está configurada com **restrições de referer** (domínio/URL), mas a **Geocoding API** não suporta esse tipo de restrição quando usada do lado do servidor ou em requisições diretas.

## 🛠️ Soluções Disponíveis

### Opção 1: Remover Restrições de Referer (Recomendado para desenvolvimento)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para **APIs & Services** > **Credentials**
3. Encontre sua API Key atual
4. Clique em **Edit** (ícone de lápis)
5. Em **Application restrictions**, selecione **None**
6. Salve as alterações

⚠️ **Atenção**: Isso remove todas as restrições de segurança. Use apenas em desenvolvimento.

### Opção 2: Criar API Key Separada para Geocoding (Recomendado para produção)

1. No Google Cloud Console, vá para **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **API key**
3. Configure a nova API Key:
   - **Application restrictions**: None ou IP addresses (se necessário)
   - **API restrictions**: Selecione apenas "Geocoding API"
4. Use esta nova API Key apenas para operações de geocodificação no servidor

### Opção 3: Configurar Restrições de IP (Para produção)

1. Edite sua API Key existente
2. Em **Application restrictions**, selecione **IP addresses**
3. Adicione os IPs do seu servidor:
   - Para desenvolvimento local: `127.0.0.1`, `::1`
   - Para produção: IP do seu servidor

## 🔄 Implementação da Solução

### Se escolher a Opção 2 (API Key separada):

1. Crie uma nova variável de ambiente no `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_api_key_para_mapas
GOOGLE_MAPS_GEOCODING_API_KEY=sua_api_key_para_geocoding
```

2. Atualize o código para usar a API Key correta:
```typescript
// Para operações de geocodificação (servidor)
const geocodingApiKey = process.env.GOOGLE_MAPS_GEOCODING_API_KEY;

// Para exibição de mapas (cliente)
const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
```

## ✅ Verificação da Solução

Após implementar uma das soluções:

1. Execute o teste novamente:
```bash
node test-api-key.js
```

2. Ou use o diagnóstico integrado na aplicação:
   - Acesse a página de diagnóstico
   - Execute os testes de geocodificação

## 📚 Informações Adicionais

### APIs que Suportam Restrições de Referer:
- Maps JavaScript API
- Places API (JavaScript)
- Street View Static API

### APIs que NÃO Suportam Restrições de Referer:
- Geocoding API ❌
- Directions API ❌
- Distance Matrix API ❌
- Places API (Server-side) ❌

### Melhores Práticas de Segurança:

1. **Desenvolvimento**: Use API Key sem restrições
2. **Produção**: Use API Keys separadas com restrições apropriadas
3. **Monitoramento**: Configure alertas de uso no Google Cloud Console
4. **Rotação**: Rotacione API Keys periodicamente

## 🚀 Próximos Passos

1. Escolha uma das soluções acima
2. Implemente a configuração
3. Teste a geocodificação
4. Monitore o uso da API

---

**Nota**: Este problema é comum e bem documentado pela Google. A solução é simples, mas requer atenção às configurações de segurança.