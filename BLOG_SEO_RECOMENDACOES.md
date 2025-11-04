# 📝 Recomendações SEO para Blog (Artigos)

## 🔍 Análise da Situação Atual

### **Como está implementado:**

1. **Componente `ArticlePage.tsx`**:
   - Busca dados via API (`blogApi.getPostBySlug(slug)`)
   - Usa componente `SeoHead` para meta tags
   - Mesmo problema das landing pages: **HTML inicial vazio**

2. **Componente `SeoHead.tsx`**:
   - Usa `react-helmet-async` para injetar meta tags
   - Meta tags só aparecem após JavaScript executar
   - Mesmo problema de SEO das landing pages

---

## 🎯 Recomendações

### **✅ Recomendação 1: Pré-renderização Estática (Mesma estratégia dos filmes)**

**Por quê?**
- Blog é conteúdo estático (artigos não mudam frequentemente)
- SEO crítico para AdSense e Google
- Artigos publicados são finitos (não cresce infinitamente como filmes)

**Estratégia:**
- Pré-renderizar **TODOS os artigos publicados**
- Artigos são conteúdo estático, não precisa de filtros como filmes

**Vantagens:**
- ✅ SEO perfeito para todos os artigos
- ✅ Não precisa filtrar (artigos publicados são finitos)
- ✅ Build rápido (artigos são menos que filmes)
- ✅ Melhor para AdSense (Google vê conteúdo completo)

---

### **📊 Comparação: Blog vs Landing Pages de Filmes**

| Aspecto | Blog (Artigos) | Landing Pages (Filmes) |
|---------|----------------|------------------------|
| **Quantidade** | 50-200 artigos | 2000 filmes |
| **Estratégia** | Pré-renderizar TODOS | Pré-renderizar Top 200 |
| **Razão** | Conteúdo estático, finito | Catálogo grande, dinâmico |
| **Build Time** | ~2-5 minutos | ~2-3 minutos (top 200) |
| **Tamanho** | ~5-20MB | ~5-10MB |

---

## 🚀 Implementação Recomendada

### **Estratégia: Pré-renderizar TODOS os Artigos**

**Por quê todos?**
1. Artigos são finitos (50-200 artigos)
2. Conteúdo estático (não muda após publicação)
3. SEO crítico para AdSense (precisa de conteúdo completo)
4. Build rápido mesmo com todos

**Script de Pré-renderização:**

```typescript
// scripts/prerender-blog.ts
async function main() {
  // 1. Buscar TODOS os artigos publicados
  const response = await blogApi.getPosts({ 
    limit: 1000, // Buscar todos
    page: 1 
  });
  
  const articles = response.data?.articles || [];
  
  console.log(`📝 Encontrados ${articles.length} artigos para pré-renderizar`);
  
  // 2. Pré-renderizar cada artigo
  for (const article of articles) {
    // Determinar rota baseada no tipo
    const route = article.type === 'lista' 
      ? `/lista/${article.slug}`
      : `/analise/${article.slug}`;
    
    await prerenderArticle(route, article);
  }
  
  console.log('✅ Pré-renderização do blog concluída!');
}
```

**Estrutura de arquivos:**

```
public/
├── analise/
│   ├── oppenheimer-2023/
│   │   └── index.html  ← Artigo pré-renderizado
│   ├── nada-de-novo-no-front-2022/
│   │   └── index.html
│   └── ...
├── lista/
│   ├── 6-filmes-para-assistir-no-domingo-chuvoso/
│   │   └── index.html
│   └── ...
└── index.html  ← SPA (fallback)
```

---

## 📋 Implementação Detalhada

### **Passo 1: Script de Pré-renderização para Blog**

**Arquivo:** `moviesf_front/scripts/prerender-blog.ts`

```typescript
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3333';
const OUTPUT_DIR = join(process.cwd(), 'public');

async function getArticles() {
  // Buscar TODOS os artigos publicados
  const response = await axios.get(`${API_BASE_URL}/api/blog/posts?limit=1000`);
  return response.data.data.articles || [];
}

async function prerenderArticle(route: string, article: any) {
  console.log(`🔄 Pré-renderizando: ${route}`);
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navegar para URL local
  await page.goto(`http://localhost:5173${route}`, {
    waitUntil: 'networkidle0'
  });
  
  // Aguardar React renderizar
  await page.waitForSelector('[data-article-loaded="true"]');
  
  // Extrair HTML completo
  const html = await page.content();
  
  // Salvar arquivo
  const outputPath = join(OUTPUT_DIR, route);
  mkdirSync(outputPath, { recursive: true });
  writeFileSync(join(outputPath, 'index.html'), html);
  
  await browser.close();
  console.log(`✅ Gerado: ${route}/index.html`);
}

async function main() {
  const articles = await getArticles();
  console.log(`📝 Encontrados ${articles.length} artigos`);
  
  for (const article of articles) {
    const route = article.type === 'lista' 
      ? `/lista/${article.slug}`
      : `/analise/${article.slug}`;
    
    await prerenderArticle(route, article);
  }
  
  console.log('🎉 Pré-renderização do blog concluída!');
}

main();
```

### **Passo 2: Adicionar atributo de detecção no ArticlePage**

**Arquivo:** `moviesf_front/src/pages/blog/ArticlePage.tsx`

```typescript
useEffect(() => {
  // ... código existente ...
  
  if (post) {
    // Adicionar atributo para Puppeteer detectar
    document.body.setAttribute('data-article-loaded', 'true');
  }
}, [post]);
```

### **Passo 3: Atualizar package.json**

```json
{
  "scripts": {
    "prerender:movies": "ts-node scripts/prerender-movies.ts",
    "prerender:blog": "ts-node scripts/prerender-blog.ts",
    "prerender": "npm run prerender:movies && npm run prerender:blog",
    "build": "tsc -b && vite build && npm run prerender"
  }
}
```

### **Passo 4: Configuração Vercel**

**vercel.json:**
```json
{
  "rewrites": [
    {
      "source": "/analise/:slug",
      "destination": "/analise/:slug/index.html"
    },
    {
      "source": "/lista/:slug",
      "destination": "/lista/:slug/index.html"
    },
    {
      "source": "/onde-assistir/:slug",
      "destination": "/onde-assistir/:slug/index.html"
    }
  ]
}
```

---

## 🎯 Benefícios Específicos para Blog

### **1. AdSense Approval**
- ✅ Google vê conteúdo completo no HTML inicial
- ✅ Meta tags corretas desde o início
- ✅ Schema.org JSON-LD incluído
- ✅ Maior chance de aprovação

### **2. Social Sharing**
- ✅ Open Graph tags no HTML inicial
- ✅ Twitter Cards funcionando
- ✅ Preview correto ao compartilhar
- ✅ Melhor engajamento

### **3. Performance**
- ✅ First Contentful Paint (FCP) instantâneo
- ✅ Time to Interactive (TTI) melhorado
- ✅ Melhor experiência do usuário

---

## 📊 Estratégia Completa: Filmes + Blog

### **Build Completo:**

```bash
npm run build
# Gera:
# - Bundle JavaScript (Vite)
# - Top 200 filmes pré-renderizados
# - TODOS os artigos pré-renderizados
```

**Tempo estimado:**
- Build Vite: ~30s
- Pré-render filmes (200): ~3-5 min
- Pré-render blog (100 artigos): ~2-3 min
- **Total: ~5-8 minutos**

**Tamanho total:**
- Bundle: ~1-2MB
- HTMLs filmes: ~5-10MB
- HTMLs blog: ~5-10MB
- **Total: ~10-20MB**

---

## ⚠️ Considerações Importantes

### **1. Atualização de Artigos**

**Quando um novo artigo é publicado:**
- Re-build para gerar HTML estático
- Ou usar ISR (Incremental Static Regeneration) para atualizar sob demanda

**Solução:**
```bash
# Pré-renderizar apenas artigo novo
npm run prerender:blog -- --slug novo-artigo-2024

# Ou re-build completo
npm run build
```

### **2. Artigos em Rascunho**

- Apenas artigos `published: true` devem ser pré-renderizados
- Rascunhos não aparecem no build

### **3. Limite de Artigos**

- Se blog crescer muito (> 500 artigos), considerar:
  - Pré-renderizar apenas artigos recentes (últimos 2 anos)
  - Ou usar ISR para artigos mais antigos

---

## 🎯 Recomendação Final

### **Para Blog:**

✅ **Pré-renderizar TODOS os artigos publicados**

**Razões:**
1. Artigos são finitos (50-200)
2. Conteúdo estático (não muda após publicação)
3. SEO crítico para AdSense
4. Build rápido mesmo com todos
5. Melhor experiência do usuário

### **Estratégia Combinada:**

```
Build Completo:
├── Filmes: Top 200 populares (pré-renderizados)
└── Blog: TODOS os artigos (pré-renderizados)

Resultado:
✅ SEO perfeito para conteúdo mais importante
✅ Build rápido e eficiente
✅ AdSense-friendly
✅ Social sharing otimizado
```

---

## 🚀 Próximos Passos

1. ✅ Criar script `prerender-blog.ts`
2. ✅ Adicionar atributo de detecção no `ArticlePage.tsx`
3. ✅ Integrar no build process
4. ✅ Testar com alguns artigos
5. ✅ Deploy e monitorar performance

---

## 📚 Resumo

**Blog (Artigos):**
- ✅ Pré-renderizar **TODOS** os artigos
- ✅ SEO crítico para AdSense
- ✅ Build rápido (artigos são finitos)

**Landing Pages (Filmes):**
- ✅ Pré-renderizar **Top 200** filmes
- ✅ SEO para filmes mais buscados
- ✅ Filmes restantes usam SPA (aceitável)

**Resultado:** SEO otimizado para ambos os casos! 🎉

