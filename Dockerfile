# Estágio 1: Build da aplicação React
FROM node:22-slim AS build

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

# Build de produção (VITE_API_BASE_URL é embutido no build)
ENV VITE_API_BASE_URL=https://api.vibesfilm.com
RUN npm run build:prod

# Estágio 2: Servidor Nginx para entrega dos arquivos estáticos
FROM nginx:stable-alpine AS production

# Copiar os arquivos buildados do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar a configuração customizada do Nginx com suporte a SSR para Bots
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
