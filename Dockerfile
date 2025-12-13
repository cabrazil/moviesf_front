# Dockerfile para Frontend - MoviesF Frontend
# Multi-stage build para otimizar tamanho da imagem

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build do projeto (gera arquivos estáticos em dist/)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Production (servir arquivos estáticos)
FROM nginx:alpine

# Copiar arquivos buildados do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]

