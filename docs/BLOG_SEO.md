# 🔍 SEO para Imagens do Blog

## 🎯 Recomendações Essenciais

### **1. Dimensões Otimizadas**
```typescript
// Imagem de capa (Open Graph)
const featuredImage = {
  width: 1200,
  height: 630,  // Proporção 1.91:1 (padrão Open Graph)
  format: 'webp',
  quality: 90
};

// Imagem de conteúdo
const contentImage = {
  width: 800,
  height: 450,
  format: 'webp',
  quality: 85
};
```

### **2. Alt Text Otimizado**
```typescript
// ❌ Ruim
alt="Imagem do filme"

// ✅ Bom
alt="Imagem do filme Oppenheimer (2023) - Análise da tensão e da vibe do filme"

// ✅ Melhor ainda
alt="Cena dramática do filme Oppenheimer mostrando Robert Oppenheimer em seu laboratório - Análise da tensão e da vibe do filme"
```

### **3. Meta Tags Essenciais**

```html
<!-- Open Graph -->
<meta property="og:image" content="https://vibesfilm.com/images/blog/articles/2025/outubro/oppenheimer-featured.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/webp" />
<meta property="og:image:alt" content="Imagem do filme Oppenheimer - Análise da tensão" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://vibesfilm.com/images/blog/articles/2025/outubro/oppenheimer-featured.webp" />
```

## 🚀 Como Usar

### **1. Componente SEO Completo**

```tsx
import { ArticleSEO, FeaturedSEOImage } from '../components/blog/ArticleSEO';

function BlogArticle({ article }) {
  return (
    <>
      {/* SEO Head */}
      <ArticleSEO 
        article={article}
        featuredImage="images/blog/articles/2025/outubro/oppenheimer-featured.webp"
      />
      
      {/* Imagem otimizada */}
      <FeaturedSEOImage
        article={article}
        imagePath="images/blog/articles/2025/outubro/oppenheimer-featured.webp"
      />
    </>
  );
}
```

### **2. Estrutura de Dados (JSON-LD)**

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Oppenheimer: Análise da Tensão e da Vibe",
  "image": {
    "@type": "ImageObject",
    "url": "https://vibesfilm.com/images/blog/articles/2025/outubro/oppenheimer-featured.webp",
    "width": 1200,
    "height": 630,
    "alt": "Imagem do filme Oppenheimer - Análise da tensão"
  },
  "author": {
    "@type": "Person",
    "name": "VibesFilm"
  }
}
```

## 📊 Checklist SEO

### **✅ Imagem de Capa**
- [ ] **Dimensões:** 1200x630px (Open Graph)
- [ ] **Formato:** WebP (melhor compressão)
- [ ] **Tamanho:** < 1MB
- [ ] **Alt text:** Descritivo e relevante
- [ ] **Title:** Inclui palavras-chave

### **✅ Meta Tags**
- [ ] **Open Graph:** og:image, og:image:width, og:image:height
- [ ] **Twitter Card:** summary_large_image
- [ ] **Structured Data:** JSON-LD com ImageObject
- [ ] **Canonical:** URL única
- [ ] **Preload:** Imagem principal

### **✅ Performance**
- [ ] **Lazy loading:** Para imagens secundárias
- [ ] **Eager loading:** Para imagem principal
- [ ] **Fetch priority:** High para capa
- [ ] **Cache:** Headers otimizados

## 🎨 Exemplos Práticos

### **Exemplo 1: Filme Oppenheimer**

```typescript
const article = {
  title: "Oppenheimer: Análise da Tensão e da Vibe",
  description: "Uma análise profunda da tensão psicológica e dilemas éticos do filme Oppenheimer",
  keywords: ["Oppenheimer", "Christopher Nolan", "tensão", "dilemas éticos", "cinema"],
  featuredImage: "images/blog/articles/2025/outubro/oppenheimer-featured.webp",
  author: "VibesFilm",
  publishedAt: "2025-01-15T10:00:00Z",
  category: "Análise de Filmes",
  tags: ["Drama", "Histórico", "Tensão"]
};

// Alt text gerado automaticamente:
// "Imagem do filme Oppenheimer - Oppenheimer: Análise da Tensão e da Vibe"
```

### **Exemplo 2: Filme Divertida Mente**

```typescript
const article = {
  title: "Divertida Mente: As Emoções em Foco",
  description: "Como o filme Divertida Mente aborda as complexidades das emoções humanas",
  keywords: ["Divertida Mente", "Pixar", "emoções", "psicologia", "animação"],
  featuredImage: "images/blog/articles/2025/janeiro/divertida-mente-featured.webp",
  // ...
};

// Alt text gerado automaticamente:
// "Imagem do filme Divertida Mente - Divertida Mente: As Emoções em Foco"
```

## 🔧 Ferramentas de Validação

### **1. Google Rich Results Test**
```
https://search.google.com/test/rich-results
```

### **2. Facebook Sharing Debugger**
```
https://developers.facebook.com/tools/debug/
```

### **3. Twitter Card Validator**
```
https://cards-dev.twitter.com/validator
```

### **4. Lighthouse SEO Audit**
```bash
npm run lighthouse -- --only-categories=seo
```

## 📈 Métricas de Sucesso

### **Core Web Vitals**
- ✅ **LCP:** < 2.5s (Largest Contentful Paint)
- ✅ **FID:** < 100ms (First Input Delay)
- ✅ **CLS:** < 0.1 (Cumulative Layout Shift)

### **SEO Metrics**
- ✅ **Alt text:** 100% das imagens
- ✅ **Structured data:** Validado
- ✅ **Open Graph:** Completo
- ✅ **Twitter Card:** Funcional

## 🚀 Deploy e Monitoramento

### **1. Sitemap de Imagens**
```xml
<url>
  <loc>https://vibesfilm.com/blog/artigo/oppenheimer-analise</loc>
  <image:image>
    <image:loc>https://vibesfilm.com/images/blog/articles/2025/outubro/oppenheimer-featured.webp</image:loc>
    <image:title>Imagem do filme Oppenheimer</image:title>
    <image:caption>Capa do artigo sobre Oppenheimer</image:caption>
  </image:image>
</url>
```

### **2. Robots.txt Otimizado**
```
User-agent: *
Allow: /images/blog/
Allow: /images/blog/articles/
Allow: /images/blog/featured/

Sitemap: https://vibesfilm.com/sitemap.xml
Sitemap: https://vibesfilm.com/sitemap-images.xml
```

**Com essas configurações, suas imagens estarão totalmente otimizadas para SEO!** 🎉
