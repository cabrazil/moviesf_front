# 📸 Guia de Imagens para o Blog

## 🏠 Imagens Locais

### **1. Estrutura de Diretórios**
```
public/images/blog/
├── articles/
│   └── 2025/
│       ├── janeiro/
│       │   └── artigo-slug/
│       │       ├── featured.webp      # Imagem principal
│       │       ├── content-1.webp     # Imagens do conteúdo
│       │       └── thumbnail.webp     # Miniatura
│       └── fevereiro/
├── featured/                          # Imagens destacadas
└── thumbnails/                        # Miniaturas
```

### **2. Como Adicionar Imagem Local**

**Passo 1:** Coloque a imagem na estrutura
```
public/images/blog/articles/2025/janeiro/meu-artigo/minha-imagem.jpg
```

**Passo 2:** Use no código
```tsx
// Caminho relativo a partir de public/
const imagePath = "images/blog/articles/2025/janeiro/meu-artigo/minha-imagem.jpg";

// Em um componente
<img src={imagePath} alt="Descrição da imagem" />
```

**Passo 3:** Otimização automática
```bash
# Otimiza todas as imagens do blog
npm run optimize-images

# Build otimiza automaticamente
npm run build
```

### **3. Componentes Otimizados**

```tsx
import { FeaturedImage, ContentImage } from '../components/blog/BlogImage';

// Imagem de capa
<FeaturedImage 
  src="images/blog/articles/2025/janeiro/artigo/featured.webp"
  alt="Capa do artigo"
/>

// Imagem de conteúdo
<ContentImage 
  src="images/blog/articles/2025/janeiro/artigo/content-1.webp"
  alt="Imagem do conteúdo"
/>
```

---

## 🌐 Imagens Externas (Unsplash, TMDB)

### **1. Unsplash.com**

**URL Direta:**
```tsx
// Exemplo: https://unsplash.com/photos/abc123
const unsplashUrl = "https://images.unsplash.com/photo-1234567890?w=1200&h=630&fit=crop";

<img 
  src={unsplashUrl} 
  alt="Imagem do Unsplash"
  style={{ maxWidth: '100%', height: 'auto' }}
/>
```

**Parâmetros de Otimização:**
```
?w=1200&h=630&fit=crop&q=80&fm=webp
```
- `w=1200` - Largura
- `h=630` - Altura  
- `fit=crop` - Recortar para encaixar
- `q=80` - Qualidade (0-100)
- `fm=webp` - Formato WebP

### **2. TMDB.org**

**URL Base:**
```tsx
const tmdbBaseUrl = "https://image.tmdb.org/t/p";
const imagePath = "/cUIqZd6jJCbO94Txt1CkTs7MSeP.jpg";

// Diferentes tamanhos
const small = `${tmdbBaseUrl}/w185${imagePath}`;    // 185px
const medium = `${tmdbBaseUrl}/w500${imagePath}`;   // 500px  
const large = `${tmdbBaseUrl}/w1280${imagePath}`;   // 1280px
const original = `${tmdbBaseUrl}/original${imagePath}`; // Original
```

**Componente Otimizado:**
```tsx
function TMDBImage({ imagePath, size = 'w500', alt }) {
  const tmdbUrl = `https://image.tmdb.org/t/p/${size}${imagePath}`;
  
  return (
    <img 
      src={tmdbUrl}
      alt={alt}
      loading="lazy"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}
```

### **3. Configuração de CORS**

**vercel.json:**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "img-src 'self' data: https: http: https://images.unsplash.com https://image.tmdb.org;"
        }
      ]
    }
  ]
}
```

---

## ⚡ Otimização e Performance

### **1. Formato WebP (Recomendado)**
```tsx
// ✅ Bom - WebP
<img src="imagem.webp" alt="..." />

// ❌ Evitar - JPEG grande
<img src="imagem.jpg" alt="..." />
```

### **2. Lazy Loading**
```tsx
// ✅ Imagem principal
<img src="featured.webp" loading="eager" alt="..." />

// ✅ Imagens secundárias  
<img src="content.webp" loading="lazy" alt="..." />
```

### **3. Dimensões Otimizadas**
```tsx
// Capa do artigo (Open Graph)
width: 1200, height: 630

// Conteúdo do artigo
width: 800, height: 450

// Miniatura
width: 400, height: 225
```

---

## 🔧 Ferramentas Úteis

### **1. Compressão Online**
- **TinyPNG:** https://tinypng.com/
- **Squoosh:** https://squoosh.app/
- **WebP Converter:** https://convertio.co/

### **2. Validação SEO**
- **Google Rich Results:** https://search.google.com/test/rich-results
- **Facebook Debugger:** https://developers.facebook.com/tools/debug/
- **Lighthouse:** `npm run lighthouse`

### **3. Scripts Automáticos**
```bash
# Otimizar imagens
npm run optimize-images

# Build com otimização
npm run build

# Preview local
npm run preview
```

---

## 📋 Checklist

### **✅ Imagens Locais**
- [ ] Estrutura de diretórios organizada
- [ ] Formato WebP otimizado
- [ ] Dimensões adequadas (1200x630 para capa)
- [ ] Alt text descritivo
- [ ] Lazy loading configurado

### **✅ Imagens Externas**
- [ ] URLs com parâmetros de otimização
- [ ] CORS configurado no vercel.json
- [ ] Fallback para imagens quebradas
- [ ] Cache headers otimizados

### **✅ SEO**
- [ ] Alt text relevante
- [ ] Meta tags Open Graph
- [ ] Structured Data (JSON-LD)
- [ ] Sitemap de imagens

**Agora você está pronto para trabalhar com imagens no blog de forma otimizada!** 🎉
