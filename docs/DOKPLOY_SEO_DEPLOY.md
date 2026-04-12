# Deploy SEO no Dokploy

## O que vale em produção

Neste projeto, se o deploy é feito via Dokploy/VPS, o arquivo `vercel.json` não governa as rotas em produção.

Os pontos que realmente importam são:

- `nginx.conf`
- configuração de proxy/reverse proxy do Dokploy/Traefik
- artefato publicado em `dist/`
- sitemap entregue pelo backend

## Rotas públicas

As duas rotas são diferentes e devem coexistir:

- `/filme/:slug`
  - página editorial/blog do filme
  - URL canônica para indexação de conteúdo
- `/onde-assistir/:slug`
  - landing page/app do filme
  - experiência funcional do produto

Não configure redirect entre elas no proxy.

## Build recomendado

Para produção com SEO:

```bash
npm run build:prod:seo
```

Esse comando:

1. gera o bundle Vite
2. busca o sitemap de filmes da API
3. gera HTML pré-renderizado em `dist/filme/<slug>/index.html`

## Nginx

O `nginx.conf` deste projeto já está preparado para:

- servir `index.html` pré-renderizado em `/filme/...`
- servir `index.html` pré-renderizado em `/onde-assistir/...` quando existir
- cair no shell SPA quando não existir HTML específico da rota

## Checklist do Dokploy

- o container do frontend precisa publicar o conteúdo de `dist/`
- o servidor web do container precisa usar este `nginx.conf`
- o proxy não deve criar redirect de `/filme/*` para `/onde-assistir/*`
- `robots.txt` e `sitemap.xml` devem estar acessíveis no domínio público
- a API precisa continuar expondo o sitemap de filmes

## Sitemap

Hoje o frontend usa:

- `https://vibesfilm.com/sitemap.xml`

E esse índice referencia:

- `https://api.vibesfilm.com/sitemap/movies.xml`
- `https://api.vibesfilm.com/sitemap/articles.xml`

Idealmente, o sitemap de filmes da API deve listar diretamente as URLs finais que você quer indexar.

Se a estratégia editorial for indexar `/filme/:slug`, o ideal é o backend emitir essas URLs no sitemap.

## Search Console

Depois do deploy:

1. valide manualmente uma URL como `https://vibesfilm.com/filme/oppenheimer`
2. confirme que o HTML inicial já contém `<title>`, `canonical`, `meta description` e JSON-LD
3. reenvie `https://vibesfilm.com/sitemap.xml` no Google Search Console
