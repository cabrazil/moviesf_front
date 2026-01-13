'use client';

import { processArticleContent } from '@/utils/processArticleContent';
// ou: import { processArticleContent } from '@/lib/processArticleContent';

interface ArticleContentProps {
  content: string;
  className?: string;
}

/**
 * Componente para renderizar o conteúdo de artigos com processamento automático
 * 
 * Funcionalidades:
 * - Processa automaticamente seções "Alertas e Cuidados" para "Nota de Curadoria"
 * - Aplica classes de estilização do Tailwind/CSS
 * - Renderiza HTML de forma segura
 * 
 * @param content - Conteúdo HTML do artigo
 * @param className - Classes CSS adicionais (opcional)
 */
export function ArticleContent({ content, className = '' }: ArticleContentProps) {
  const processedContent = processArticleContent(content);

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

/**
 * Exemplo de uso em uma página de artigo:
 * 
 * import { ArticleContent } from '@/components/ArticleContent';
 * 
 * export default async function ArticlePage({ params }: { params: { slug: string } }) {
 *   const article = await getArticle(params.slug);
 *   
 *   return (
 *     <article className="max-w-4xl mx-auto px-4 py-8">
 *       <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
 *       <ArticleContent content={article.content} />
 *     </article>
 *   );
 * }
 */
