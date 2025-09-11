import type { BlogPost, BlogCategory } from '../../types/blog';

export const categories: BlogCategory[] = [
  {
    id: '1',
    name: 'Análises Emocionais',
    slug: 'analises-emocionais',
    description: 'Análises profundas sobre como os filmes despertam emoções',
    color: '#2EC4B6'
  },
  {
    id: '2',
    name: 'Curadoria por Sentimentos',
    slug: 'curadoria-sentimentos',
    description: 'Listas e recomendações baseadas em estados emocionais',
    color: '#FF9F1C'
  },
  {
    id: '3',
    name: 'Psicologia do Cinema',
    slug: 'psicologia-cinema',
    description: 'Como o cinema influencia nosso bem-estar emocional',
    color: '#E71D36'
  },
  {
    id: '4',
    name: 'Tendências',
    slug: 'tendencias',
    description: 'Últimas tendências em filmes e streaming',
    color: '#6C5CE7'
  }
];

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como encontrar o filme perfeito quando você está ansioso',
    slug: 'filme-perfeito-ansiedade',
    excerpt: 'Descubra como escolher filmes que acalmam a mente e trazem paz interior durante momentos de ansiedade. Uma análise científica sobre cinema terapêutico.',
    content: `
# Como encontrar o filme perfeito quando você está ansioso

A ansiedade é uma das emoções mais comuns do mundo moderno, e o cinema pode ser uma ferramenta poderosa para nos ajudar a lidar com esses sentimentos...

## Por que certos filmes acalmam nossa mente?

Estudos em neurociência mostram que assistir a filmes com narrativas previsíveis e finais felizes pode reduzir os níveis de cortisol...

## Recomendações para momentos de ansiedade

### Filmes de Conforto
- **O Fabuloso Destino de Amélie Poulain** - Uma jornada visual encantadora
- **Studio Ghibli Collection** - Mundos mágicos e reconfortantes
- **Pequenas Grandes Escolhas** - Drama familiar reconfortante

### Características que funcionam:
- Ritmo lento e contemplativo
- Paleta de cores suaves
- Protagonistas empáticos
- Finais esperançosos
    `,
    author: {
      name: 'Dr. Marina Silva',
      avatar: '/default-avatar.svg',
      bio: 'Psicóloga especializada em cinema terapêutico'
    },
    publishedAt: '2024-12-20T10:00:00Z',
    readingTime: 8,
    featuredImage: 'https://picsum.photos/800/400?random=1',
    tags: ['ansiedade', 'bem-estar', 'cinema-terapeutico', 'saude-mental'],
    category: categories[2],
    isPublished: true,
    isFeatured: true,
    seo: {
      metaTitle: 'Filmes para Ansiedade: Como o Cinema Pode Acalmar sua Mente',
      metaDescription: 'Descubra filmes cientificamente comprovados para reduzir ansiedade e promover bem-estar emocional.',
      keywords: ['filmes ansiedade', 'cinema terapêutico', 'bem-estar', 'saúde mental']
    }
  },
  {
    id: '2',
    title: 'Os 15 filmes mais reconfortantes para um domingo chuvoso',
    slug: 'filmes-reconfortantes-domingo-chuvoso',
    excerpt: 'Uma curadoria especial de filmes que aquecem o coração e tornam qualquer dia cinzento mais acolhedor e especial.',
    content: `
# Os 15 filmes mais reconfortantes para um domingo chuvoso

Não há nada como um domingo chuvoso para nos conectarmos com filmes que aquecem o coração...

## A ciência do conforto cinematográfico

Filmes reconfortantes ativam a liberação de oxitocina, o "hormônio do amor"...

## Nossa lista especial:

### Top 5 Clássicos Atemporais
1. **Sintonia do Amor** - Richard Curtis (2003)
2. **Antes do Pôr do Sol** - Richard Linklater (2004)
3. **O Terminal** - Steven Spielberg (2004)
4. **Julie & Julia** - Nora Ephron (2009)
5. **Pequenas Grandes Escolhas** - Jean-Marc Vallée (2014)
    `,
    author: {
      name: 'Lucas Mendes',
      avatar: '/default-avatar.svg',
      bio: 'Curador de filmes e especialista em comfort movies'
    },
    publishedAt: '2024-12-18T14:30:00Z',
    readingTime: 12,
    featuredImage: 'https://picsum.photos/800/400?random=2',
    tags: ['comfort-movies', 'curadoria', 'domingo', 'reconforto'],
    category: categories[1],
    isPublished: true,
    isFeatured: true,
    seo: {
      metaTitle: '15 Filmes Reconfortantes para Domingo Chuvoso | VibesFilm',
      metaDescription: 'Lista exclusiva dos filmes mais acolhedores para transformar seu domingo chuvoso em um momento especial.',
      keywords: ['filmes reconfortantes', 'domingo chuvoso', 'comfort movies', 'filmes acolhedores']
    }
  },
  {
    id: '3',
    title: 'A psicologia por trás dos filmes que nos fazem chorar',
    slug: 'psicologia-filmes-que-fazem-chorar',
    excerpt: 'Uma análise profunda sobre por que buscamos filmes que nos emocionam até às lágrimas e como isso beneficia nossa saúde emocional.',
    content: `
# A psicologia por trás dos filmes que nos fazem chorar

Por que conscientemente escolhemos assistir a filmes que sabemos que vão nos fazer chorar?...

## O papel das lágrimas no bem-estar

Chorar durante filmes não é sinal de fraqueza, mas sim de inteligência emocional...

## Tipos de lágrimas cinematográficas:

### Lágrimas de Catarse
- Filmes como "Sempre ao Seu Lado (Hachi)"
- "A Vida é Bela" de Roberto Benigni

### Lágrimas de Nostalgia
- "Up - Altas Aventuras" (Primeiros 10 minutos)
- "Coco" da Pixar
    `,
    author: {
      name: 'Dra. Ana Carolina',
      avatar: '/default-avatar.svg',
      bio: 'Neurocientista especializada em emoções e mídia'
    },
    publishedAt: '2024-12-15T09:15:00Z',
    readingTime: 10,
    featuredImage: 'https://picsum.photos/800/400?random=3',
    tags: ['psicologia', 'emocoes', 'catarse', 'neurociencia'],
    category: categories[2],
    isPublished: true,
    isFeatured: false,
    seo: {
      metaTitle: 'Por que Buscamos Filmes que nos Fazem Chorar? | Psicologia do Cinema',
      metaDescription: 'Entenda a ciência por trás da nossa necessidade de chorar com filmes e seus benefícios para a saúde mental.',
      keywords: ['psicologia cinema', 'filmes emocionantes', 'catarse', 'lágrimas', 'bem-estar emocional']
    }
  },
  {
    id: '4',
    title: 'Streaming em 2024: Como as plataformas estão moldando nossas emoções',
    slug: 'streaming-2024-moldando-emocoes',
    excerpt: 'Análise das principais tendências de streaming e como os algoritmos influenciam nossas escolhas emocionais de entretenimento.',
    content: `
# Streaming em 2024: Como as plataformas estão moldando nossas emoções

O cenário do streaming mudou drasticamente nos últimos anos...

## O algoritmo da emoção

As plataformas não recomendam apenas filmes, elas moldam nossos estados emocionais...

## Principais tendências:

### Netflix e a Personalização Emocional
- Algoritmos baseados em humor
- Categorias por sentimentos

### Disney+ e o Conforto Nostálgico
- Exploração do comfort viewing
- Estratégias de bem-estar familiar
    `,
    author: {
      name: 'Roberto Tech',
      avatar: '/default-avatar.svg',
      bio: 'Analista de tecnologia e comportamento digital'
    },
    publishedAt: '2024-12-12T16:45:00Z',
    readingTime: 7,
    featuredImage: 'https://picsum.photos/800/400?random=4',
    tags: ['streaming', 'algoritmos', 'tendencias', 'tecnologia'],
    category: categories[3],
    isPublished: true,
    isFeatured: false,
    seo: {
      metaTitle: 'Tendências de Streaming 2024: Como as Plataformas Moldam Nossas Emoções',
      metaDescription: 'Análise exclusiva de como Netflix, Disney+ e outras plataformas influenciam nossas escolhas emocionais.',
      keywords: ['streaming 2024', 'algoritmos emocionais', 'netflix', 'tendências cinema']
    }
  },
  {
    id: '5',
    title: 'Filmes para diferentes fases do relacionamento',
    slug: 'filmes-fases-relacionamento',
    excerpt: 'Um guia completo para escolher filmes que conectam casais em cada etapa do relacionamento, do primeiro encontro ao amor maduro.',
    content: `
# Filmes para diferentes fases do relacionamento

Cada fase de um relacionamento pede um tipo diferente de filme...

## Primeiro Encontro
Filmes leves que geram conversas interessantes sem pressão...

## Relacionamento Estabelecido
Dramas que exploram a complexidade do amor...

## Amor Maduro
Filmes que celebram a profundidade dos vínculos...
    `,
    author: {
      name: 'Carla Rocha',
      avatar: '/default-avatar.svg',
      bio: 'Terapeuta de casais e especialista em cinema romântico'
    },
    publishedAt: '2024-12-10T11:20:00Z',
    readingTime: 9,
    featuredImage: 'https://picsum.photos/800/400?random=5',
    tags: ['relacionamentos', 'romance', 'casais', 'amor'],
    category: categories[1],
    isPublished: true,
    isFeatured: false,
    seo: {
      metaTitle: 'Filmes para Cada Fase do Relacionamento | Guia Completo',
      metaDescription: 'Descubra os filmes perfeitos para cada momento do seu relacionamento, do primeiro encontro ao amor duradouro.',
      keywords: ['filmes românticos', 'relacionamentos', 'casais', 'cinema para dois']
    }
  },
  {
    id: '6',
    title: 'Como os filmes de terror podem ser terapêuticos',
    slug: 'filmes-terror-terapeuticos',
    excerpt: 'Surpreendentemente, filmes de terror podem oferecer benefícios psicológicos únicos. Descubra como o medo controlado pode ser curativo.',
    content: `
# Como os filmes de terror podem ser terapêuticos

Pode parecer contraditório, mas filmes de terror têm propriedades terapêuticas...

## O medo controlado como ferramenta

Em um ambiente seguro, experimentar medo pode ser libertador...

## Benefícios comprovados:
- Liberação de adrenalina controlada
- Processamento de traumas
- Fortalecimento da resiliência emocional
    `,
    author: {
      name: 'Dr. Pedro Santos',
      avatar: '/default-avatar.svg',
      bio: 'Psicólogo especializado em terapia de exposição'
    },
    publishedAt: '2024-12-08T13:00:00Z',
    readingTime: 6,
    featuredImage: 'https://picsum.photos/800/400?random=1',
    tags: ['terror', 'terapia', 'medo', 'psicologia'],
    category: categories[2],
    isPublished: true,
    isFeatured: false,
    seo: {
      metaTitle: 'Filmes de Terror como Terapia: Benefícios do Medo Controlado',
      metaDescription: 'Descubra como filmes de terror podem ser ferramentas terapêuticas eficazes para o bem-estar mental.',
      keywords: ['terror terapêutico', 'psicologia do medo', 'filmes de terror', 'terapia']
    }
  }
];
