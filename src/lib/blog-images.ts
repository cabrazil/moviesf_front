/**
 * Import explícito de todas as imagens do blog
 * Isso força o Vite a incluir as imagens no build
 */

// Imagens de outubro 2025
import imagemBlog6filmes1 from '/src/assets/blog/articles/2025/outubro/imagem_blog_6filmes_1.jpg';
import imagemBlog6filmes2 from '/src/assets/blog/articles/2025/outubro/imagem_blog_6filmes_2.jpg';
import imagemBlog6filmes3 from '/src/assets/blog/articles/2025/outubro/imagem_blog_6filmes_3.jpg';
import imagemFilmesDomingoChuva from '/src/assets/blog/articles/2025/outubro/imagem_filmes_domingo_chuva.jpg';

// Imagens de novembro 2025
import imagemInspiradora from '/src/assets/blog/articles/2025/novembro/imagem-inspiradora.jpg';

// Mapeamento de caminhos para imports
export const blogImages = {
  'blog/articles/2025/outubro/imagem_blog_6filmes_1.jpg': imagemBlog6filmes1,
  'blog/articles/2025/outubro/imagem_blog_6filmes_2.jpg': imagemBlog6filmes2,
  'blog/articles/2025/outubro/imagem_blog_6filmes_3.jpg': imagemBlog6filmes3,
  'blog/articles/2025/outubro/imagem_filmes_domingo_chuva.jpg': imagemFilmesDomingoChuva,
  'blog/articles/2025/novembro/imagem-inspiradora.jpg': imagemInspiradora,
} as const;

/**
 * Obtém a URL otimizada de uma imagem do blog
 */
export function getBlogImageUrl(imagePath: string): string {
  // Se for uma URL externa, retorna como está
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Se já começa com /images, retorna como está
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  // Buscar no mapeamento de imagens
  const optimizedUrl = blogImages[imagePath as keyof typeof blogImages];
  if (optimizedUrl) {
    return optimizedUrl;
  }
  
  // Fallback para URL direta
  return `/images/${imagePath}`;
}
