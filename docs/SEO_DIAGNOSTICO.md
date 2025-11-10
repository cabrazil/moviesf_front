# 🔍 Diagnóstico SEO - Landing Page de Filmes

## ❌ Problema Identificado

O projeto está sendo servido como uma **Single Page Application (SPA)** tradicional, o que causa problemas de SEO:

### Como está funcionando atualmente:

1. **HTML Inicial Genérico**
   - O `index.html` contém apenas um `<div id="root"></div>` vazio
   - Meta tags são genéricas (mesmas para todas as páginas)
   - Nenhum conteúdo específico do filme no HTML inicial

2. **Conteúdo Carregado via JavaScript**
   - O `MovieDetail.tsx` usa `useEffect` para buscar dados da API (`/api/movie/${slug}/hero`)
   - As meta tags são injetadas via `react-helmet-async` **após** o React renderizar
   - O conteúdo real só aparece depois que o JavaScript executa

3. **Impacto no Google**
   - O Google recebe HTML vazio/genérico
   - Precisa executar JavaScript para ver o conteúdo
   - Para sites pequenos/novos, o Google pode não renderizar JavaScript confiável ou com atraso
   - Meta tags dinâmicas não aparecem no HTML inicial que o Google indexa

### Evidências no Código:

```typescript
// index.html - HTML inicial vazio
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>

// MovieDetail.tsx - Busca dados via useEffect (client-side)
useEffect(() => {
  const response = await fetch(`${baseURL}/api/movie/${finalSlug}/hero`);
  // ... conteúdo carregado após render
}, [finalSlug]);

// MetaTags.tsx - Meta tags injetadas via Helmet (após render)
{movie && (
  <MovieMetaTags movie={movie} platforms={...} />
)}
```

## ✅ Soluções Possíveis

### 1. **Server-Side Rendering (SSR)** - Recomendado para SEO

**Implementação:** Usar framework como Next.js ou Remix

**Vantagens:**
- HTML pré-renderizado no servidor com conteúdo completo
- Meta tags já no HTML inicial
- Google indexa conteúdo imediatamente
- Melhor performance percebida

**Desvantagens:**
- Requer migração significativa do código
- Mais complexidade de deploy
- Custo de servidor para renderização

---

### 2. **Static Site Generation (SSG) / Pré-renderização**

**Implementação:** Gerar HTML estático para cada filme

**Vantagens:**
- HTML completo já no servidor
- Meta tags corretas desde o início
- Performance excelente
- Pode usar CDN facilmente

**Desvantagens:**
- Precisa regenerar HTML quando dados mudam
- Pode ser lento para muitos filmes
- Requer build process adicional

**Solução possível com Vite:**
- Usar plugin como `vite-plugin-ssr` ou `prerender-spa-plugin`
- Gerar HTML estático no build time

---

### 3. **Incremental Static Regeneration (ISR)**

**Implementação:** Combinar SSG com atualização dinâmica

**Vantagens:**
- HTML estático inicial (rápido para SEO)
- Atualização dinâmica quando necessário
- Melhor dos dois mundos

**Desvantagens:**
- Mais complexo de implementar
- Requer infraestrutura adequada

---

### 4. **Pré-renderização com Puppeteer/Playwright** (Solução Intermediária)

**Implementação:** Script que renderiza páginas e salva HTML

**Vantagens:**
- Não requer mudança grande no código
- Pode ser adicionado ao processo de build
- HTML estático gerado automaticamente

**Desvantagens:**
- Requer processamento durante build
- Pode ser lento para muitos filmes

---

## 🎯 Recomendação Imediata

Para resolver rapidamente sem grandes mudanças arquiteturais:

### Opção A: Pré-renderização com Script
1. Criar script que lista todos os filmes
2. Renderizar cada página com Puppeteer
3. Salvar HTML estático em `/public/onde-assistir/[slug]/index.html`
4. Configurar servidor para servir arquivos estáticos quando existirem

### Opção B: Server-Side Rendering com Vite SSR
1. Configurar Vite SSR
2. Criar endpoint no backend que renderiza HTML
3. Servir HTML pré-renderizado para bots do Google

### Opção C: Meta Tags Dinâmicas no Backend
1. Criar endpoint `/api/movie/[slug]/meta` que retorna apenas dados de meta
2. Servir HTML customizado baseado em header `User-Agent`
3. Para bots, servir HTML com meta tags já preenchidas

---

## 📊 Próximos Passos

1. **Escolher estratégia** (recomendo Opção A para início rápido)
2. **Implementar solução escolhida**
3. **Testar com Google Search Console**
4. **Verificar renderização com Google Rich Results Test**
5. **Monitorar indexação**

---

## 🔗 Referências

- [Google: JavaScript SEO Basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
- [React Helmet Async](https://github.com/staylor/react-helmet-async)

