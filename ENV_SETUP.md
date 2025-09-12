# 🌐 Configuração de Ambiente - Frontend

## 📋 Para Desenvolvimento Local

### Criar arquivo `.env.local`:
```bash
cd moviesf_front
touch .env.local
```

### Conteúdo do `.env.local`:
```env
# 🌐 Configuração Local - vibesfilm Frontend
VITE_API_BASE_URL=http://localhost:3000
VITE_NODE_ENV=development
```

## 🚀 Para Produção (Vercel)

### Configurar variáveis de ambiente na Vercel:
```env
VITE_API_BASE_URL=https://moviesf-back.vercel.app
VITE_NODE_ENV=production
```

## 🔧 Detecção Automática

O sistema agora detecta automaticamente:
- **Localhost**: Usa `http://localhost:3000`
- **Produção**: Usa `https://moviesf-back.vercel.app`

## 🧪 Testando

### 1. Verificar logs no console:
```
🌐 API Base URL: http://localhost:3000
🔧 Environment: development
🏠 Hostname: localhost
```

### 2. Testar endpoints:
- Local: `http://localhost:3000/main-sentiments`
- Produção: `https://moviesf-back.vercel.app/main-sentiments`
