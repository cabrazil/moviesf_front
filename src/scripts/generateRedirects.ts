#!/usr/bin/env ts-node

/**
 * Script para gerar redirecionamentos automáticos para artigos de filmes
 * Converte slugs longos em slugs otimizados para SEO
 * 
 * Uso: npx ts-node src/scripts/generateRedirects.ts
 */

// Exemplos de artigos existentes (você pode expandir esta lista)
const existingArticles = [
  {
    originalSlug: 'oppenheimer-2023-uma-analise-da-trama-da-vibe-e-do-impacto-do-filme',
    optimizedSlug: 'oppenheimer-2023'
  },
  {
    originalSlug: 'analise-de-nada-de-novo-no-front-2022-a-vibe-a-trama-e-o-horror-da-guerra',
    optimizedSlug: 'nada-de-novo-no-front-2022'
  },
  {
    originalSlug: 'estrelas-alem-do-tempo-2016-superacao-empoderamento-e-a-forca-da-inteligencia-coletiva',
    optimizedSlug: 'estrelas-alem-do-tempo-2016'
  },
  {
    originalSlug: 'o-ronco-da-paixao-inesgotavel-por-que-ford-vs-ferrari-2019-e-o-filme-ideal-para-te-recarregar',
    optimizedSlug: 'ford-vs-ferrari-2019'
  }
];

interface ArticleMapping {
  originalSlug: string;
  optimizedSlug: string;
}

interface RedirectConfig {
  source: string;
  destination: string;
  permanent: boolean;
}

/**
 * Função para gerar slug otimizado baseado no slug original
 */
function generateOptimizedSlug(originalSlug: string): string {
  // Remover prefixos comuns
  let slug = originalSlug
    .replace(/^analise-de-/, '')
    .replace(/^o-/, '')
    .replace(/^a-/, '')
    .replace(/^os-/, '')
    .replace(/^as-/, '');

  // Remover sufixos comuns
  slug = slug
    .replace(/-a-vibe-a-trama-e-o-impacto-do-filme$/, '')
    .replace(/-a-vibe-a-trama-e-o-horror-da-guerra$/, '')
    .replace(/-superacao-empoderamento-e-a-forca-da-inteligencia-coletiva$/, '')
    .replace(/-inesgotavel-por-que-.*-e-o-filme-ideal-para-te-recarregar$/, '')
    .replace(/-uma-analise-da-trama-da-vibe-e-do-impacto-do-filme$/, '');

  // Limpar caracteres especiais e espaços
  slug = slug
    .replace(/[^\w\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return slug;
}

/**
 * Gerar redirecionamentos para vercel.json
 */
function generateRedirects(articles: ArticleMapping[]): RedirectConfig[] {
  return articles.map(article => ({
    source: `/blog/artigo/${article.originalSlug}`,
    destination: `/analise/${article.optimizedSlug}`,
    permanent: true
  }));
}

/**
 * Gerar mapeamentos para o frontend
 */
function generateMappings(articles: ArticleMapping[]): Record<string, string> {
  const mappings: Record<string, string> = {};
  
  articles.forEach(article => {
    mappings[article.optimizedSlug] = article.originalSlug;
  });

  return mappings;
}

/**
 * Função principal do script
 */
async function main() {
  try {
    console.log('🚀 Gerando redirecionamentos e mapeamentos...\n');

    // Gerar redirecionamentos
    const redirects = generateRedirects(existingArticles);
    
    console.log('📋 Redirecionamentos para vercel.json:');
    console.log('  [');
    redirects.forEach((redirect, index) => {
      const comma = index < redirects.length - 1 ? ',' : '';
      console.log(`    {
      "source": "${redirect.source}",
      "destination": "${redirect.destination}",
      "permanent": ${redirect.permanent}
    }${comma}`);
    });
    console.log('  ]');

    // Gerar mapeamentos
    const mappings = generateMappings(existingArticles);
    
    console.log('\n🧠 Mapeamentos para o frontend (ArticlePage.tsx):');
    console.log('  const specialMappings: { [key: string]: string } = {');
    Object.entries(mappings).forEach(([optimized, original], index) => {
      const comma = index < Object.entries(mappings).length - 1 ? ',' : '';
      console.log(`    '${optimized}': '${original}'${comma}`);
    });
    console.log('  };');

    // Exemplos de uso
    console.log('\n📝 Exemplos de URLs que funcionarão:');
    existingArticles.forEach(article => {
      console.log(`  ✅ /analise/${article.optimizedSlug}`);
    });

    console.log('\n🔄 Exemplos de redirecionamentos:');
    existingArticles.forEach(article => {
      console.log(`  🔗 /blog/artigo/${article.originalSlug} → /analise/${article.optimizedSlug}`);
    });

    console.log('\n✅ Script concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Copie os redirecionamentos para o vercel.json');
    console.log('2. Copie os mapeamentos para o ArticlePage.tsx');
    console.log('3. Faça commit e push das alterações');
    console.log('4. Teste as URLs otimizadas na Vercel');

  } catch (error) {
    console.error('❌ Erro ao executar script:', error);
    process.exit(1);
  }
}

// Executar o script se for chamado diretamente
if (require.main === module) {
  main();
}

export { generateOptimizedSlug, generateRedirects, generateMappings };
