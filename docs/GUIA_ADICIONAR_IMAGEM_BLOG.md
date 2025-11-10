# 📸 Guia: Como Adicionar Nova Imagem Local ao Blog

## 🎯 Procedimento Manual (Passo a Passo)

### **Passo 1: Adicionar o Arquivo Físico**

Coloque a imagem no diretório correto:
```
src/assets/blog/articles/ANO/MES/nome-da-imagem.jpg
```

**Exemplo:**
```
src/assets/blog/articles/2025/novembro/imagem-inspiradora.jpg
```

**Estrutura de diretórios:**
- `2025/` → Ano
- `outubro/`, `novembro/`, `dezembro/` → Mês (minúsculas)
- Arquivo: use hífens ou underscores (ex: `imagem-inspiradora.jpg` ou `imagem_inspiradora.jpg`)

---

### **Passo 2: Editar o Arquivo `blog-images.ts`**

Abra o arquivo:
```
src/lib/blog-images.ts
```

#### **2.1: Adicionar o Import**

Na seção de imports do mês correspondente, adicione:
```typescript
import nomeDaImagem from '/src/assets/blog/articles/2025/novembro/nome-da-imagem.jpg';
```

**Exemplo:**
```typescript
// Imagens de novembro 2025
import imagemInspiradora from '/src/assets/blog/articles/2025/novembro/imagem-inspiradora.jpg';
```

**Importante:**
- O nome da variável deve seguir regras de JavaScript (sem hífens, use camelCase)
- O caminho deve começar com `/src/assets/blog/articles/...`
- Use a extensão correta (`.jpg`, `.png`, `.webp`, etc.)

#### **2.2: Adicionar ao Mapeamento**

No objeto `blogImages`, adicione a entrada:
```typescript
export const blogImages = {
  // ... outras imagens
  'blog/articles/2025/novembro/nome-da-imagem.jpg': nomeDaImagem,
} as const;
```

**Exemplo:**
```typescript
export const blogImages = {
  'blog/articles/2025/outubro/imagem_blog_6filmes_1.jpg': imagemBlog6filmes1,
  'blog/articles/2025/novembro/imagem-inspiradora.jpg': imagemInspiradora,
} as const;
```

**Importante:**
- A **chave** (string) deve ser: `blog/articles/ANO/MES/nome-do-arquivo.extensao`
- O **valor** é a variável do import (sem aspas)
- Use o mesmo formato do nome do arquivo (com ou sem hífens/underscores)

---

### **Passo 3: Usar no Artigo**

No conteúdo do artigo (banco de dados ou código), use o caminho:
```
blog/articles/2025/novembro/nome-da-imagem.jpg
```

**Exemplos de uso:**

**No HTML do artigo:**
```html
<img src="blog/articles/2025/novembro/imagem-inspiradora.jpg" alt="Descrição" />
```

**No campo `imageUrl` do banco:**
```json
{
  "imageUrl": "blog/articles/2025/novembro/imagem-inspiradora.jpg"
}
```

**Usando componentes React:**
```tsx
import { BlogImage } from '@/components/blog/BlogImage';

<BlogImage 
  src="blog/articles/2025/novembro/imagem-inspiradora.jpg"
  alt="Descrição da imagem"
/>
```

---

### **Passo 4: Testar Localmente**

```bash
# No diretório do frontend
cd moviesf_front

# Rodar em desenvolvimento
npm run dev
```

Verifique se a imagem aparece corretamente no artigo.

---

### **Passo 5: Deploy**

```bash
# Commit as mudanças
git add src/assets/blog/articles/2025/novembro/nome-da-imagem.jpg
git add src/lib/blog-images.ts
git commit -m "Add: nova imagem para artigo do blog"

# Push para o repositório
git push
```

A Vercel fará o build automaticamente e incluirá a nova imagem.

---

## 📋 Checklist Rápido

- [ ] Arquivo físico adicionado em `src/assets/blog/articles/ANO/MES/`
- [ ] Import adicionado em `src/lib/blog-images.ts`
- [ ] Entrada adicionada no objeto `blogImages`
- [ ] Caminho usado no artigo corresponde ao mapeamento
- [ ] Testado localmente (`npm run dev`)
- [ ] Commit e push realizados
- [ ] Deploy na Vercel concluído

---

## ⚠️ Erros Comuns

### **Imagem não aparece após deploy**
- ✅ Verifique se o import está correto (caminho absoluto com `/src/assets/...`)
- ✅ Verifique se a chave do mapeamento corresponde ao caminho usado no artigo
- ✅ Verifique se o nome da variável está correto (sem hífens, camelCase)

### **Erro de build: "Cannot find module"**
- ✅ Verifique se o caminho do arquivo físico está correto
- ✅ Verifique se a extensão do arquivo está correta no import
- ✅ Verifique se o arquivo realmente existe no diretório

### **Imagem aparece em dev mas não em produção**
- ✅ Certifique-se de que o arquivo foi commitado no Git
- ✅ Verifique os logs do build na Vercel para erros
- ✅ Verifique se o caminho no artigo corresponde exatamente ao mapeamento

---

## 🎨 Convenções de Nomenclatura

### **Arquivos:**
- Use hífens: `imagem-inspiradora.jpg`
- Ou underscores: `imagem_inspiradora.jpg`
- Evite espaços e caracteres especiais

### **Variáveis (imports):**
- Use camelCase: `imagemInspiradora`
- Sem hífens ou underscores
- Comece com letra minúscula

### **Caminhos (no artigo):**
- Use hífens: `blog/articles/2025/novembro/imagem-inspiradora.jpg`
- Mantenha consistência com o nome do arquivo

---

## 📚 Exemplo Completo

### **Arquivo físico:**
```
src/assets/blog/articles/2025/dezembro/natal-cinema.jpg
```

### **No `blog-images.ts`:**
```typescript
// Imagens de dezembro 2025
import natalCinema from '/src/assets/blog/articles/2025/dezembro/natal-cinema.jpg';

export const blogImages = {
  // ... outras imagens
  'blog/articles/2025/dezembro/natal-cinema.jpg': natalCinema,
} as const;
```

### **No artigo:**
```html
<img src="blog/articles/2025/dezembro/natal-cinema.jpg" alt="Filmes de Natal" />
```

---

## 🚀 Próximos Passos (Opcional)

Se quiser automatizar esse processo, posso criar um script que:
- ✅ Adiciona automaticamente o import
- ✅ Adiciona automaticamente ao mapeamento
- ✅ Valida se o arquivo existe
- ✅ Gera o caminho correto para o banco

Basta me avisar se quiser que eu crie esse script! 🎯

