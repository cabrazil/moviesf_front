require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middlewares essenciais
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5175', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Blog API Backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// GET /api/blogs/:id/articles - Listar artigos
app.get('/api/blogs/:id/articles', async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      blogId,
      published: true,
      ...(category && { category: { slug: category } }),
      ...(search && { 
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      })
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, role: true, imageUrl: true } },
          category: { select: { id: true, title: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true, color: true } }
        },
        orderBy: { date: 'desc' },
        take: parseInt(limit),
        skip: offset
      }),
      prisma.article.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

// GET /api/blogs/:id/articles/slug/:slug - Buscar artigo por slug
app.get('/api/blogs/:id/articles/slug/:slug', async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const { slug } = req.params;

    const article = await prisma.article.findFirst({
      where: { blogId, slug, published: true },
      include: {
        author: { select: { id: true, name: true, role: true, imageUrl: true, bio: true } },
        category: { select: { id: true, title: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true, color: true } }
      }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: 'Artigo não encontrado' });
    }

    // Incrementar visualizações
    await prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({ success: true, data: { article } });
  } catch (error) {
    console.error('Erro ao buscar artigo:', error);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

// GET /api/blogs/:id/categories - Listar categorias
app.get('/api/blogs/:id/categories', async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);

    const categories = await prisma.category.findMany({
      where: { blogId },
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        _count: { select: { articles: { where: { published: true } } } }
      }
    });

    res.json({ success: true, data: { categories } });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

// GET /api/blogs/:id/tags - Listar tags
app.get('/api/blogs/:id/tags', async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);

    const tags = await prisma.tag.findMany({
      where: {
        blogId,
        articles: { some: { published: true } }
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        _count: { select: { articles: { where: { published: true } } } }
      }
    });

    res.json({ success: true, data: { tags } });
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    res.status(500).json({ success: false, error: 'Erro interno' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Blog API Backend rodando na porta ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api/blogs/3/articles`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
