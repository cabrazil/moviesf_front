// Serviço de API para o blog
const API_BASE_URL = import.meta.env.PROD
  ? 'https://moviesf-back.vercel.app/api/blog'
  : 'http://localhost:3333/api/blog';

export interface BlogApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  description: string;
  date: string;
  imageUrl: string;
  imageAlt?: string;
  published: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  slug: string;
  type?: 'analise' | 'lista';
  blogId: number;
  author_id: number;
  author_name: string;
  author_role: string;
  author_image: string;
  author_bio?: string;
  category_id: number;
  category_title: string;
  category_slug: string;
  category_description?: string;
  readingTime?: number;
  category_image?: string;
  tags?: BlogTag[];
}

export interface BlogCategory {
  id: number;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  articleCount?: number;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  articleCount?: number;
}

class BlogApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<BlogApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Erro na API do blog (${endpoint}):`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<BlogApiResponse<{ message: string; timestamp: string }>> {
    return this.request('/health');
  }

  // Buscar artigos
  async getPosts(options: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  } = {}): Promise<BlogApiResponse<{ articles: BlogPost[] }>> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.category) params.append('category', options.category);
    if (options.search) params.append('search', options.search);
    if (options.featured !== undefined) params.append('featured', options.featured.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/posts?${queryString}` : '/posts';
    
    return this.request(endpoint);
  }

  // Buscar artigo por slug
  async getPostBySlug(slug: string): Promise<BlogApiResponse<BlogPost>> {
    return this.request(`/posts/${slug}`);
  }

  // Buscar artigos em destaque
  async getFeaturedPosts(): Promise<BlogApiResponse<BlogPost[]>> {
    return this.request('/posts/featured');
  }

  // Buscar categorias
  async getCategories(): Promise<BlogApiResponse<BlogCategory[]>> {
    return this.request('/categories');
  }

  // Buscar tags
  async getTags(): Promise<BlogApiResponse<BlogTag[]>> {
    return this.request('/tags');
  }

  // Buscar artigos por categoria
  async getPostsByCategory(categorySlug: string, page: number = 1, limit: number = 10): Promise<BlogApiResponse<{ articles: BlogPost[] }>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    return this.request(`/categories/${categorySlug}/posts?${params.toString()}`);
  }

  // Buscar artigos por tag
  async getPostsByTag(tagSlug: string, page: number = 1, limit: number = 10): Promise<BlogApiResponse<{ articles: BlogPost[] }>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    return this.request(`/tags/${tagSlug}/posts?${params.toString()}`);
  }

  // Buscar comentários de um artigo
  async getPostComments(articleId: number): Promise<BlogApiResponse<any[]>> {
    return this.request(`/posts/${articleId}/comments`);
  }
}

export const blogApi = new BlogApiService();
