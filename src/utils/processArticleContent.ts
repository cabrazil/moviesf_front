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
  // Captura qualquer texto adicional dentro da tag (ex: nome do filme ou contexto)
  const alertasRegex = /<(h2|h3)([^>]*)>[\s]*⚠️?[\s]*Alertas e Cuidados:?\s*([^<]*)<\/(h2|h3)>/gi;

  // Substitui pelo novo formato com ícone SVG inline
  processedContent = processedContent.replace(
    alertasRegex,
    (_match, _tag, _attrs, additionalText) => {
      // Remove espaços extras do texto adicional
      const cleanText = additionalText ? additionalText.trim() : '';
      const titleText = cleanText ? `Nota de Curadoria: ${cleanText}` : 'Nota de Curadoria:';

      return `<div class="nota-curadoria">
      <div class="nota-curadoria-header">
        <svg class="nota-curadoria-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
        <span>${titleText}</span>
      </div>
      <div class="nota-curadoria-content">`;
    }
  );

  // Fecha a div após o primeiro parágrafo completo ou antes do próximo heading
  const inNotaCuradoria = processedContent.includes('nota-curadoria-content">');

  if (inNotaCuradoria) {
    const parts = processedContent.split('nota-curadoria-content">');
    if (parts.length > 1) {
      const afterNote = parts[1];

      // Procura pelo fim do primeiro parágrafo (</p>) ou próximo heading
      const firstParagraphEnd = afterNote.indexOf('</p>');
      const headingRegex = /<h[234][^>]*>/i;
      const nextHeadingMatch = afterNote.match(headingRegex);
      const nextHeadingIndex = nextHeadingMatch ? afterNote.indexOf(nextHeadingMatch[0]) : -1;

      let closeIndex = -1;

      // Se encontrou </p> e ele vem antes de qualquer heading (ou não há heading)
      if (firstParagraphEnd !== -1 && (nextHeadingIndex === -1 || firstParagraphEnd < nextHeadingIndex)) {
        closeIndex = firstParagraphEnd + 4; // +4 para incluir o </p>
      }
      // Se encontrou heading e ele vem antes do </p> (ou não há </p>)
      else if (nextHeadingIndex !== -1) {
        closeIndex = nextHeadingIndex;
      }

      if (closeIndex !== -1) {
        const beforeClose = afterNote.substring(0, closeIndex);
        const afterClose = afterNote.substring(closeIndex);

        processedContent = parts[0] + 'nota-curadoria-content">' +
          beforeClose +
          '</div></div>' +
          afterClose;
      } else {
        // Se não encontrou nem </p> nem heading, fecha no final
        processedContent += '</div></div>';
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
