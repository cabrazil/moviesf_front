# 🤖 Automação de Imagens do Blog

## 📋 Como Adicionar Nova Imagem

### **Passo 1: Colocar Arquivo Físico**
```
src/assets/blog/articles/2025/outubro/nova-imagem.jpg
```

### **Passo 2: Executar Script Automático**
```bash
# Opção 1: Usando npm script
npm run add-blog-image nova-imagem.jpg

# Opção 2: Com ano e mês específicos
npm run add-blog-image nova-imagem.jpg 2025 novembro

# Opção 3: Executar diretamente
npx ts-node scripts/add-blog-image.ts nova-imagem.jpg
```

### **Passo 3: Deploy**
```bash
git add .
git commit -m "Add: nova-imagem.jpg para artigo"
git push
```

## 🎯 O que o Script Faz Automaticamente

### **✅ Adiciona Import:**
```typescript
import nova_imagem from '/src/assets/blog/articles/2025/outubro/nova-imagem.jpg';
```

### **✅ Adiciona Mapeamento:**
```typescript
export const blogImages = {
  // ... imagens existentes
  'blog/articles/2025/outubro/nova-imagem.jpg': nova_imagem,
} as const;
```

### **✅ Gera URL para Banco:**
```
blog/articles/2025/outubro/nova-imagem.jpg
```

## 📝 Exemplos de Uso

### **Imagem para Outubro 2025:**
```bash
npm run add-blog-image minha-imagem.jpg
```

### **Imagem para Novembro 2025:**
```bash
npm run add-blog-image minha-imagem.jpg 2025 novembro
```

### **Imagem para Janeiro 2026:**
```bash
npm run add-blog-image minha-imagem.jpg 2026 janeiro
```

## 🚀 Vantagens da Automação

- ✅ **Zero erros** - Script adiciona tudo corretamente
- ✅ **Rápido** - Um comando faz tudo
- ✅ **Consistente** - Sempre segue o mesmo padrão
- ✅ **Seguro** - Verifica se arquivo existe antes
- ✅ **Informativo** - Mostra próximos passos

## 🔧 Estrutura de Diretórios

```
src/
├── assets/blog/articles/2025/outubro/
│   ├── imagem_blog_6filmes_1.jpg
│   ├── imagem_filmes_domingo_chuva.jpg
│   └── nova-imagem.jpg  ← Adicionar aqui
├── lib/
│   └── blog-images.ts  ← Script atualiza automaticamente
└── utils/
    └── blogImages.ts  ← Não precisa alterar
```

## 🎉 Resultado Final

**No banco de dados (Supabase):**
```
imageUrl: "blog/articles/2025/outubro/nova-imagem.jpg"
```

**Na Vercel:**
- ✅ Imagem incluída no build
- ✅ URL otimizada com hash
- ✅ Cache automático
- ✅ SEO otimizado

**Agora é só executar o script e fazer deploy!** 🚀
