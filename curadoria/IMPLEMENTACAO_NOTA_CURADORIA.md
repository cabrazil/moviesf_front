# 📝 Implementação da "Nota de Curadoria"

Este documento contém todos os arquivos e códigos necessários para implementar a mudança de "⚠️ Alertas e Cuidados:" para "Nota de Curadoria:" no frontend `moviesf_front`.

---

## 📋 Checklist de Implementação

- [ ] 1. Adicionar CSS ao arquivo de estilos globais
- [ ] 2. Criar/atualizar o utilitário de processamento de conteúdo
- [ ] 3. Atualizar o componente de renderização de artigos
- [ ] 4. Testar com artigos existentes
- [ ] 5. (Opcional) Atualizar artigos no admin gradualmente

---

## 🎨 Passo 1: CSS (globals.css ou styles.css)

Adicione este CSS ao seu arquivo de estilos globais (geralmente `src/app/globals.css` ou `src/styles/globals.css`):

```css
/* ============================================
   Nota de Curadoria - Estilização
   ============================================ */

.nota-curadoria {
  background: linear-gradient(135deg, #fef9f3 0%, #fdf4e8 100%);
  border-left: 4px solid #d4a574;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(212, 165, 116, 0.1);
  transition: all 0.3s ease;
}

.nota-curadoria:hover {
  box-shadow: 0 4px 16px rgba(212, 165, 116, 0.15);
  transform: translateY(-2px);
}

.nota-curadoria-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  color: #8b6f47;
  letter-spacing: 0.3px;
}

.nota-curadoria-icon {
  width: 24px;
  height: 24px;
  color: #d4a574;
  flex-shrink: 0;
}

.nota-curadoria-content {
  color: #5a4a3a;
  line-height: 1.7;
  font-size: 1rem;
}

.nota-curadoria-content p {
  margin: 0.75rem 0;
}

.nota-curadoria-content p:first-child {
  margin-top: 0;
}

.nota-curadoria-content p:last-child {
  margin-bottom: 0;
}

.nota-curadoria-content ul,
.nota-curadoria-content ol {
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.nota-curadoria-content li {
  margin: 0.5rem 0;
}

.nota-curadoria-content strong {
  color: #6b5540;
  font-weight: 600;
}

/* Responsividade */
@media (max-width: 768px) {
  .nota-curadoria {
    padding: 1.25rem;
    margin: 1.5rem 0;
  }
  
  .nota-curadoria-header {
    font-size: 1rem;
  }
  
  .nota-curadoria-icon {
    width: 20px;
    height: 20px;
  }
}

/* Modo escuro (se aplicável) */
@media (prefers-color-scheme: dark) {
  .nota-curadoria {
    background: linear-gradient(135deg, #2a2520 0%, #3a3028 100%);
    border-left-color: #d4a574;
  }
  
  .nota-curadoria-header {
    color: #e8d4b8;
  }
  
  .nota-curadoria-content {
    color: #d4c4b0;
  }
  
  .nota-curadoria-content strong {
    color: #e8d4b8;
  }
}
```

---

## 🔧 Passo 2: Utilitário de Processamento

Crie o arquivo `src/utils/processArticleContent.ts` (ou `src/lib/processArticleContent.ts`):

```typescript
/**
 * Processa o conteúdo HTML do artigo para aplicar transformações customizadas
 * 
 * Transformações aplicadas:
 * - Converte "⚠️ Alertas e Cuidados:" em "Nota de Curadoria:" com estilização especial
 */

export function processArticleContent(htmlContent: string): string {
  if (!htmlContent) return '';

  let processedContent = htmlContent;

  // Regex para encontrar a seção "Alertas e Cuidados"
  // Suporta variações: com/sem emoji, com/sem dois pontos, h2 ou h3
  const alertasRegex = /<(h2|h3)([^>]*)>[\s]*⚠️?[\s]*Alertas e Cuidados:?[\s]*<\/(h2|h3)>/gi;

  // Substitui pelo novo formato com ícone SVG inline
  processedContent = processedContent.replace(
    alertasRegex,
    `<div class="nota-curadoria">
      <div class="nota-curadoria-header">
        <svg class="nota-curadoria-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <span>Nota de Curadoria:</span>
      </div>
      <div class="nota-curadoria-content">`
  );

  // Fecha a div antes do próximo heading (h2, h3, h4) ou no final do conteúdo
  // Isso garante que o conteúdo da nota seja capturado corretamente
  const headingRegex = /(<h[234][^>]*>)/gi;
  let inNotaCuradoria = processedContent.includes('nota-curadoria-content">');
  
  if (inNotaCuradoria) {
    // Encontra o próximo heading após a abertura da nota de curadoria
    const parts = processedContent.split('nota-curadoria-content">');
    if (parts.length > 1) {
      const afterNote = parts[1];
      const nextHeadingMatch = afterNote.match(headingRegex);
      
      if (nextHeadingMatch) {
        const nextHeadingIndex = afterNote.indexOf(nextHeadingMatch[0]);
        const beforeHeading = afterNote.substring(0, nextHeadingIndex);
        const afterHeading = afterNote.substring(nextHeadingIndex);
        
        processedContent = parts[0] + 'nota-curadoria-content">' + 
                          beforeHeading + 
                          '</div></div>' + 
                          afterHeading;
      } else {
        // Se não houver próximo heading, fecha no final
        processedContent += '</div></div>';
      }
    }
  }

  return processedContent;
}

/**
 * Versão alternativa usando DOMParser (mais robusta, mas só funciona no cliente)
 * Use esta se a versão com regex não funcionar bem
 */
export function processArticleContentDOM(htmlContent: string): string {
  if (typeof window === 'undefined') {
    // Fallback para SSR
    return processArticleContent(htmlContent);
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  
  // Encontra todos os headings que contêm "Alertas e Cuidados"
  const headings = doc.querySelectorAll('h2, h3');
  
  headings.forEach((heading) => {
    const text = heading.textContent || '';
    
    if (text.includes('Alertas e Cuidados') || text.includes('⚠️')) {
      // Cria a nova estrutura
      const notaDiv = doc.createElement('div');
      notaDiv.className = 'nota-curadoria';
      
      const headerDiv = doc.createElement('div');
      headerDiv.className = 'nota-curadoria-header';
      headerDiv.innerHTML = `
        <svg class="nota-curadoria-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <span>Nota de Curadoria:</span>
      `;
      
      const contentDiv = doc.createElement('div');
      contentDiv.className = 'nota-curadoria-content';
      
      // Move os elementos seguintes para dentro da nota até encontrar outro heading
      let nextElement = heading.nextElementSibling;
      const elementsToMove: Element[] = [];
      
      while (nextElement && !['H1', 'H2', 'H3', 'H4'].includes(nextElement.tagName)) {
        elementsToMove.push(nextElement);
        nextElement = nextElement.nextElementSibling;
      }
      
      elementsToMove.forEach(el => contentDiv.appendChild(el));
      
      notaDiv.appendChild(headerDiv);
      notaDiv.appendChild(contentDiv);
      
      // Substitui o heading original
      heading.replaceWith(notaDiv);
    }
  });
  
  return doc.body.innerHTML;
}
```

---

## 🎯 Passo 3: Componente de Artigo

Atualize o componente que renderiza o artigo. Exemplo para `ArticleContent.tsx` ou similar:

```typescript
'use client';

import { processArticleContent } from '@/utils/processArticleContent';
// ou: import { processArticleContent } from '@/lib/processArticleContent';

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className = '' }: ArticleContentProps) {
  const processedContent = processArticleContent(content);
  
  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
}
```

**Ou se você já tem um componente existente**, apenas adicione o processamento:

```typescript
// ANTES:
<div 
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: article.content }} 
/>

// DEPOIS:
import { processArticleContent } from '@/utils/processArticleContent';

<div 
  className="prose prose-lg max-w-none"
  dangerouslySetInnerHTML={{ __html: processArticleContent(article.content) }} 
/>
```

---

## 🧪 Passo 4: Teste

Crie um arquivo de teste `src/utils/__tests__/processArticleContent.test.ts`:

```typescript
import { processArticleContent } from '../processArticleContent';

describe('processArticleContent', () => {
  it('deve converter "Alertas e Cuidados" em "Nota de Curadoria"', () => {
    const input = `
      <h2>Título do Artigo</h2>
      <p>Conteúdo inicial</p>
      <h3>⚠️ Alertas e Cuidados:</h3>
      <p>Este filme contém cenas intensas.</p>
      <h3>Próxima Seção</h3>
    `;
    
    const output = processArticleContent(input);
    
    expect(output).toContain('nota-curadoria');
    expect(output).toContain('Nota de Curadoria:');
    expect(output).not.toContain('⚠️');
    expect(output).not.toContain('Alertas e Cuidados');
  });

  it('deve funcionar com h2 também', () => {
    const input = '<h2>⚠️Alertas e Cuidados</h2><p>Conteúdo</p>';
    const output = processArticleContent(input);
    
    expect(output).toContain('nota-curadoria');
  });

  it('não deve modificar conteúdo sem "Alertas e Cuidados"', () => {
    const input = '<h2>Título Normal</h2><p>Conteúdo</p>';
    const output = processArticleContent(input);
    
    expect(output).toBe(input);
  });
});
```

---

## 🎨 Opções de Ícones

### Opção 1: Info Circle (Recomendado - já incluído no exemplo)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M12 16v-4"></path>
  <path d="M12 8h.01"></path>
</svg>
```

### Opção 2: Pena de Escrita
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
</svg>
```

### Opção 3: Moldura/Frame
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect width="18" height="18" x="3" y="3" rx="2"></rect>
  <path d="M7 7h10"></path>
  <path d="M7 12h10"></path>
  <path d="M7 17h10"></path>
</svg>
```

### Opção 4: Livro Aberto
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
</svg>
```

Para trocar o ícone, basta substituir o SVG dentro do `headerDiv.innerHTML` no código.

---

## 📱 Exemplo Completo de Uso

```typescript
// src/app/artigos/[slug]/page.tsx

import { ArticleContent } from '@/components/ArticleContent';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      
      {/* O conteúdo será processado automaticamente */}
      <ArticleContent content={article.content} />
    </article>
  );
}
```

---

## 🔄 Migração Gradual

Você pode migrar os artigos gradualmente. O código funciona tanto com:

1. **HTML antigo** (h3 com "⚠️ Alertas e Cuidados:") - será convertido automaticamente
2. **HTML novo** (div com classe "nota-curadoria") - será renderizado diretamente

Quando editar um artigo no admin, você pode usar a nova estrutura HTML:

```html
<div class="nota-curadoria">
  <div class="nota-curadoria-header">
    <svg class="nota-curadoria-icon">...</svg>
    <span>Nota de Curadoria:</span>
  </div>
  <div class="nota-curadoria-content">
    <p>Seu conteúdo aqui...</p>
  </div>
</div>
```

---

## ✅ Checklist Final

Após implementar, verifique:

- [ ] CSS está carregando corretamente
- [ ] Ícone está aparecendo
- [ ] Cores e espaçamento estão adequados
- [ ] Funciona em mobile
- [ ] Funciona com artigos antigos
- [ ] Não quebrou outros estilos do artigo

---

## 🎨 Personalização

Para ajustar as cores do tema "cinema/emoções", modifique as variáveis CSS:

```css
.nota-curadoria {
  /* Gradiente dourado/cinema */
  background: linear-gradient(135deg, #fef9f3 0%, #fdf4e8 100%);
  border-left-color: #d4a574; /* Dourado */
}

/* Ou tema mais neutro: */
.nota-curadoria {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left-color: #6c757d; /* Cinza */
}

/* Ou tema vibrante: */
.nota-curadoria {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
  border-left-color: #e53e3e; /* Vermelho */
}
```

---

Boa implementação! 🎬✨
