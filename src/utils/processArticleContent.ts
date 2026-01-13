/**
 * Processa o conteúdo HTML do artigo para aplicar transformações customizadas
 * 
 * Transformações aplicadas:
 * - Converte "⚠️ Alertas e Cuidados:" em "Nota de Curadoria:" com estilização especial
 * 
 * @param htmlContent - Conteúdo HTML do artigo
 * @returns HTML processado com as transformações aplicadas
 */

export function processArticleContent(htmlContent: string): string {
  if (!htmlContent) return '';

  let processedContent = htmlContent;

  // Regex para encontrar a seção "Alertas e Cuidados"
  // Suporta variações: com/sem emoji, com/sem dois pontos, h2 ou h3
  // Captura qualquer texto adicional dentro da tag (ex: nome do filme)
  const alertasRegex = /<(h2|h3)([^>]*)>[\s]*⚠️?[\s]*Alertas e Cuidados:?[^<]*<\/(h2|h3)>/gi;

  console.log('🔍 Processando conteúdo do artigo...');
  console.log('📝 Conteúdo original contém "Alertas"?', htmlContent.includes('Alertas'));

  // Substitui pelo novo formato com ícone SVG inline
  processedContent = processedContent.replace(
    alertasRegex,
    (match) => {
      console.log('✅ Match encontrado:', match);
      return `<div class="nota-curadoria">
      <div class="nota-curadoria-header">
        <svg class="nota-curadoria-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <span>Nota de Curadoria:</span>
      </div>
      <div class="nota-curadoria-content">`;
    }
  );

  // Fecha a div antes do próximo heading (h2, h3, h4) ou no final do conteúdo
  // Isso garante que o conteúdo da nota seja capturado corretamente
  const headingRegex = /(<h[234][^>]*>)/gi;
  const inNotaCuradoria = processedContent.includes('nota-curadoria-content">');

  console.log('📦 Nota de curadoria criada?', inNotaCuradoria);

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
        console.log('✅ Div fechada antes do próximo heading');
      } else {
        // Se não houver próximo heading, fecha no final
        processedContent += '</div></div>';
        console.log('✅ Div fechada no final do conteúdo');
      }
    }
  }

  return processedContent;
}

/**
 * Versão alternativa usando DOMParser (mais robusta, mas só funciona no cliente)
 * Use esta se a versão com regex não funcionar bem
 * 
 * @param htmlContent - Conteúdo HTML do artigo
 * @returns HTML processado com as transformações aplicadas
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
