# 📋 Plano de Testes - Filtros de Plataformas de Streaming

## 🎯 Objetivo
Validar se a mudança no backend (campo `showFilter`) não quebrou a funcionalidade do app web.

---

## 🔍 **O que foi alterado:**

### **Backend:**
1. ✅ Adicionado campo `showFilter` na tabela `StreamingPlatform`
2. ✅ Endpoint `/api/streaming-platforms` agora retorna `showFilter`
3. ✅ Ordenação alterada: `showFilter` → `category` → `name`

### **Frontend:**
1. ✅ Interface TypeScript atualizada (`StreamingPlatform`)
2. ✅ **Páginas agora são 100% dinâmicas** (usam `showFilter` da API)

---

## 📱 **Cenários de Teste**

### **1. Tela de Filtros de Streaming (`/streaming-filters`)**

#### **1.1 Carregamento Inicial**
- [ ] ✅ Página carrega sem erros
- [ ] ✅ 9 plataformas principais visíveis
- [ ] ✅ Logos das plataformas carregam corretamente
- [ ] ✅ Seção "Outras plataformas" existe e está colapsada

**Plataformas Principais Esperadas:**
- Claro Video
- HBO Max
- Prime Video
- Netflix
- Disney+
- Telecine
- Globoplay
- Paramount+
- Apple TV+

#### **1.2 Seleção de Plataformas**
- [ ] ✅ Consegue selecionar/desselecionar plataformas principais
- [ ] ✅ Expandir "Outras plataformas" funciona
- [ ] ✅ Consegue selecionar plataformas secundárias

**Outras Plataformas Esperadas:**
- MUBI
- Oldflix
- Looke
- MGM+
- Filmelier+
- Reserva Imovision

#### **1.3 Navegação**
- [ ] ✅ Botão "Continuar" funciona
- [ ] ✅ Filtros são passados corretamente via URL
- [ ] ✅ Volta para tela de sentimentos funciona

---

### **2. Página de Detalhes do Filme (Landing Page)**

**URL de teste:** `/filme/[slug-do-filme]`

#### **2.1 Seção "Onde assistir hoje?"**

**Testar com:** Pulp Fiction (`/filme/pulp-fiction-tempo-de-violencia`)

- [ ] ✅ Seção "Onde assistir hoje?" é exibida
- [ ] ✅ **Assinatura:** Mostra plataformas com acesso incluído (se houver)
- [ ] ✅ **Aluguel e Compra:** Mostra todas as opções de aluguel/compra
- [ ] ✅ Logos das plataformas aparecem corretamente
- [ ] ✅ Links para plataformas funcionam (se existir `baseUrl`)

**Exemplo esperado (Pulp Fiction):**
```
📺 Onde assistir hoje?

Assinatura:
(nenhuma - filme só disponível para aluguel)

Aluguel e Compra:
[Apple TV (Loja)] [Google Play] [Prime Video]
```

#### **2.2 Testar com Filme em Plataforma de Assinatura**

**Testar com:** O Poderoso Chefão (se disponível na landing)

- [ ] ✅ **Assinatura:** Mostra Oldflix, Claro Video, HBO Max
- [ ] ✅ **Aluguel e Compra:** Mostra Apple TV, Google Play, Prime Video
- [ ] ✅ Plataformas estão organizadas corretamente

---

### **3. Página de Detalhes do Filme (App Interno)**

**URL de teste:** `/movie-details/:id`

**Testar com ID real de um filme**

- [ ] ✅ Seção "Plataformas Disponíveis" carrega
- [ ] ✅ Separação entre Assinatura e Aluguel/Compra funciona
- [ ] ✅ Todas as plataformas aparecem (não filtradas por `showFilter`)
- [ ] ✅ Logos carregam corretamente

---

### **4. API de Plataformas (Console do Navegador)**

**Executar no console:**

```javascript
// Teste 1: Buscar todas as plataformas
fetch('https://moviesf-back.vercel.app/api/streaming-platforms')
  .then(r => r.json())
  .then(data => {
    console.log('Total:', data.length);
    console.log('PRIORITY:', data.filter(p => p.showFilter === 'PRIORITY').length);
    console.log('SECONDARY:', data.filter(p => p.showFilter === 'SECONDARY').length);
    console.log('HIDDEN:', data.filter(p => p.showFilter === 'HIDDEN').length);
    console.log('Primeiro resultado:', data[0]);
  });
```

**Resultado Esperado:**
```
Total: 39
PRIORITY: 9
SECONDARY: 8
HIDDEN: 22
Primeiro resultado: { id: 32, name: 'Netflix', showFilter: 'PRIORITY', ... }
```

---

## 🐛 **Possíveis Problemas e Soluções**

### **Problema 1: Erro no TypeScript**
**Sintoma:** Console mostra erro relacionado a `showFilter`
**Causa:** Interface não atualizada
**Solução:** ✅ Já resolvido - interface atualizada

### **Problema 2: Plataformas não aparecem na ordem certa**
**Sintoma:** Plataformas secundárias aparecem antes das principais
**Causa:** Ordenação do backend não está funcionando
**Solução:** Verificar logs do backend e query SQL

### **Problema 3: Logos não carregam**
**Sintoma:** Imagens quebradas ou placeholders
**Causa:** `logoPath` pode estar null ou URL incorreta
**Solução:** Usar fallback para logos locais

### **Problema 4: Filtros hardcoded não funcionam**
**Sintoma:** Plataformas selecionadas não filtram filmes
**Causa:** App web usa nomes hardcoded que podem não bater com banco
**Solução:** Validar se nomes no código coincidem com banco

---

## ✅ **Checklist Rápido de Validação**

### **Testes Essenciais (Mínimo):**
- [ ] 1. Abrir `/streaming-filters` → sem erros no console
- [ ] 2. Ver 9 plataformas principais → logos carregando
- [ ] 3. Selecionar Netflix e Disney+ → continuar
- [ ] 4. Ver sugestões de filmes → filtradas pelas plataformas
- [ ] 5. Abrir detalhes de um filme → seção "Onde assistir" funciona
- [ ] 6. Ver separação Assinatura vs Aluguel → correto

### **Testes Adicionais (Desejável):**
- [ ] 7. Expandir "Outras plataformas" → lista correta
- [ ] 8. Selecionar Oldflix (secundária) → funciona
- [ ] 9. Clicar em logo de plataforma → abre link (se existir)
- [ ] 10. Testar em mobile → responsivo

---

## 📊 **Comparação: Antes vs Depois**

### **Antes (Hardcoded):**
```javascript
// Web: StreamingFilters.tsx
const mainSubscriptionPlatforms = [
  { name: 'Claro Video', logo: '' },
  { name: 'HBO Max', logo: '' },
  // ... hardcoded
];

const otherSubscriptionPlatforms = [
  'MUBI', 'Oldflix', 'Looke', // ... hardcoded
];
```

### **Depois (Dinâmico - IMPLEMENTADO):**
```javascript
// Buscar da API e filtrar por showFilter
const platforms = await getStreamingPlatforms();
const subscriptionPlatforms = platforms.filter(p => 
  p.category === 'SUBSCRIPTION_PRIMARY' || p.category === 'HYBRID'
);
const priorityPlatforms = subscriptionPlatforms.filter(p => p.showFilter === 'PRIORITY');
const secondaryPlatforms = subscriptionPlatforms.filter(p => p.showFilter === 'SECONDARY');
```

**Status Atual:** ✅ **Web agora é 100% dinâmico** (busca do backend)

---

## 🚀 **Próximos Passos (Após Validação)**

Se testes passarem:
1. ✅ Backend está estável
2. ✅ Web agora é dinâmico (eliminado hardcoded)
3. ⏳ Implementar mobile usando `showFilter`

Se testes falharem:
1. 🐛 Identificar problema específico
2. 🔧 Corrigir backend ou frontend
3. 🔄 Retestar

---

## 📝 **Notas Importantes**

1. **Eliminado Hardcoded:** Web agora busca plataformas dinamicamente da API
2. **Ordenação:** Backend ordena por `showFilter` → `category` → `name`
3. **Filtros Inteligentes:** Frontend filtra por `category` (SUBSCRIPTION_PRIMARY + HYBRID) e depois por `showFilter`
4. **Landing Page:** Sempre mostra TODAS as plataformas (assinatura + aluguel) separadamente
5. **Logos:** Usa TMDB quando disponível, fallback para logos locais
6. **Escalabilidade:** Adicionar nova plataforma = só atualizar banco (sem código)

---

## ✅ **Status do Teste**

**Data:** ___/___/2025  
**Testado por:** _______________  
**Ambiente:** □ Produção  □ Desenvolvimento  
**Resultado:** □ ✅ Passou  □ ❌ Falhou  □ ⚠️ Parcial  

**Observações:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

