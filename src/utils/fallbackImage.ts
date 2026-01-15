/**
 * Gera uma imagem de fallback em SVG inline quando a imagem do artigo falha ao carregar
 * Não depende de serviços externos (via.placeholder.com)
 */

export function generateFallbackImageDataUrl(
  width: number = 800,
  height: number = 450,
  text: string = 'Imagem não disponível'
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#011627;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a2332;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text 
        x="50%" 
        y="50%" 
        dominant-baseline="middle" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="24" 
        fill="#3B82F6"
        opacity="0.8"
      >
        ${text}
      </text>
    </svg>
  `;

  // Converte SVG para Data URL
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}

// Exporta URLs prontas para uso comum
export const FALLBACK_IMAGES = {
  article: generateFallbackImageDataUrl(800, 450, 'Imagem não disponível'),
  articleLarge: generateFallbackImageDataUrl(1200, 675, 'Imagem não disponível'),
  thumbnail: generateFallbackImageDataUrl(300, 200, 'Imagem não disponível'),
};
