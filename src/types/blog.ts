// Blog Types
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: BlogAuthor;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featuredImage: string;
  imageAlt?: string;
  tags: string[];
  category: BlogCategory;
  isPublished: boolean;
  isFeatured: boolean;
  seo: BlogSEO;
  metadata?: {
    seoTitle?: string;
    metaDescription?: string;
  };
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BlogStats {
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
  totalTags: number;
}

export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  sortBy?: 'publishedAt' | 'readingTime' | 'title';
  sortOrder?: 'asc' | 'desc';
}
