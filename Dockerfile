# Estágio 1: Build da aplicação React
FROM node:22-slim AS build

# Receber argumentos do Dokploy (essencial para o Vite embutir as variáveis)
ARG VITE_API_BASE_URL=https://api.vibesfilm.com
ARG VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
ARG VITE_TMDB_IMAGE_SIZE=w92

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Definir variáveis de ambiente para o build do Vite
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TMDB_IMAGE_BASE_URL=${VITE_TMDB_IMAGE_BASE_URL}
ENV VITE_TMDB_IMAGE_SIZE=${VITE_TMDB_IMAGE_SIZE}

# Build de produção (ignora o prerender lento)
RUN npm run build:prod

# Estágio 2: Servidor Nginx para entrega dos arquivos estáticos
FROM nginx:stable-alpine AS production

# Copiar os arquivos buildados do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar a configuração customizada do Nginx com suporte a SSR para Bots
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Importante: O Nginx escuta na 80 por padrão
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
