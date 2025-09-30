# 📸 Gerenciamento de Imagens do Blog

## 🏗️ Estrutura de Diretórios

```
public/images/blog/
├── articles/                    # Imagens dos artigos
│   ├── 2025/
│   │   ├── janeiro/
│   │   │   ├── artigo-slug/
│   │   │   │   ├── featured.webp
│   │   │   │   ├── content-1.webp
│   │   │   │   └── content-2.webp
│   │   └── fevereiro/
│   └── 2024/
├── featured/                    # Imagens destacadas
└── thumbnails/                 # Miniaturas
```

## 🚀 Como Usar

### 1. **Importar Utilitários**

```typescript
import { 
  getBlogImageUrl, 
  getFeaturedImageUrl,
  getThumbnailImageUrl,
  getContentImageUrl,
  getCardImageUrl 
} from '../utils/blogImages';
```

### 2. **Componentes Especializados**

```tsx
import { FeaturedImage, ThumbnailImage, ContentImage, CardImage } from '../components/blog/BlogImage';

// Imagem destacada do artigo
<FeaturedImage 
  src="blog/articles/2025/janeiro/filme-destaque/featured.webp"
  alt="Filme em destaque"
/>

// Miniatura para listagem
<ThumbnailImage 
  src="blog/articles/2025/janeiro/filme-destaque/thumbnail.webp"
  alt="Filme em destaque"
/>

// Imagem no conteúdo
<ContentImage 
  src="blog/articles/2025/janeiro/filme-destaque/content-1.webp"
  alt="Cena do filme"
/>

// Imagem de card
<CardImage 
  src="blog/articles/2025/janeiro/filme-destaque/card.webp"
  alt="Filme em destaque"
/>
```

### 3. **Upload de Imagens**

```tsx
import { ImageUpload } from '../components/blog/ImageUpload';

<ImageUpload
  articleSlug="meu-artigo"
  onImageSelect={(imagePath, optimizedFile) => {
    console.log('Caminho:', imagePath);
    console.log('Arquivo otimizado:', optimizedFile);
  }}
  currentImage="blog/articles/2025/janeiro/meu-artigo/featured.webp"
/>
```

### 4. **Configurações Personalizadas**

```typescript
// URL customizada com configurações específicas
const customUrl = getBlogImageUrl('blog/articles/2025/janeiro/filme.jpg', {
  width: 800,
  height: 600,
  quality: 90,
  format: 'webp'
});
```

## ⚙️ Configurações

### **Variáveis de Ambiente**

```env
# Base URL para imagens do blog
VITE_BLOG_IMAGES_BASE_URL=/images

# Serviço de otimização (opcional)
VITE_IMAGE_OPTIMIZATION_SERVICE=https://res.cloudinary.com/your-account/image/fetch
```

### **Tipos de Configuração**

| Tipo | Largura | Altura | Qualidade | Uso |
|------|---------|--------|-----------|-----|
| `FEATURED` | 1200px | 630px | 85% | Imagem destacada |
| `THUMBNAIL` | 400px | 225px | 80% | Miniaturas |
| `CONTENT` | 800px | 450px | 85% | Conteúdo do artigo |
| `CARD` | 300px | 200px | 75% | Cards de listagem |

## 🎯 Boas Práticas

### **1. Nomenclatura de Arquivos**
```
blog/articles/2025/janeiro/artigo-slug/
├── featured.webp      # Imagem principal
├── thumbnail.webp     # Miniatura
├── content-1.webp     # Imagens do conteúdo
├── content-2.webp
└── card.webp         # Para cards
```

### **2. Otimização**
- ✅ Use formato WebP para melhor compressão
- ✅ Redimensione imagens antes do upload
- ✅ Use lazy loading para imagens
- ✅ Implemente fallback para formatos não suportados

### **3. Organização**
- ✅ Organize por ano/mês
- ✅ Use slugs consistentes
- ✅ Mantenha nomes descritivos
- ✅ Documente convenções da equipe

## 🔧 Integração com CMS

### **Exemplo de Integração**

```typescript
// No seu CMS ou API
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  featuredImage: string; // Caminho da imagem
  content: string;
}

// No componente
function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <div>
      <FeaturedImage 
        src={post.featuredImage}
        alt={post.title}
      />
      <h2>{post.title}</h2>
    </div>
  );
}
```

## 🚀 Deploy e Produção

### **Vercel/Netlify**
- ✅ Imagens são servidas estaticamente
- ✅ Cache automático configurado
- ✅ Compressão automática

### **CDN (Opcional)**
```typescript
// Configuração para Cloudinary
const cloudinaryUrl = `https://res.cloudinary.com/your-account/image/fetch/w_800,h_450,q_85,f_webp/${baseUrl}/${imagePath}`;
```

## 📊 Monitoramento

### **Métricas Importantes**
- ✅ Tamanho das imagens
- ✅ Tempo de carregamento
- ✅ Taxa de erro
- ✅ Uso de cache

### **Ferramentas Recomendadas**
- Lighthouse para performance
- WebPageTest para análise detalhada
- Chrome DevTools para debug
