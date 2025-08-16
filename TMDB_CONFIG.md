# Configuração TMDB - Frontend

## Variáveis de Ambiente

Para configurar as imagens do TMDB, crie um arquivo `.env` na raiz do projeto frontend:

```env
# Configurações da API TMDB
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
VITE_TMDB_IMAGE_SIZE=w185
```

## Tamanhos de Imagem Disponíveis

O TMDB oferece diferentes tamanhos de imagem:

| Tamanho | Dimensões | Uso Recomendado |
|---------|-----------|-----------------|
| `w45`   | 45px      | Ícones pequenos |
| `w92`   | 92px      | Logos compactos |
| `w154`  | 154px     | Logos médios |
| `w185`  | 185px     | **Logos de plataformas** ⭐ |
| `w300`  | 300px     | Logos grandes |
| `w500`  | 500px     | Logos extra grandes |
| `original` | Original | Tamanho original |

## Uso no Código

### Configuração Centralizada
```typescript
// src/config/tmdb.config.ts
import { TMDB_CONFIG } from '../config/tmdb.config';

// Usar tamanho padrão
const logoUrl = getPlatformLogoUrl(logoPath);

// Usar tamanho específico
const logoUrl = getPlatformLogoUrl(logoPath, TMDB_CONFIG.LOGO_SIZES.MEDIUM);
```

### Funções Específicas
```typescript
import { 
  getPlatformLogoUrlSmall,
  getPlatformLogoUrlMedium,
  getPlatformLogoUrlLarge,
  getPlatformLogoUrlOriginal
} from '../services/streaming.service';

// Diferentes tamanhos
const smallLogo = getPlatformLogoUrlSmall(logoPath);    // w92
const mediumLogo = getPlatformLogoUrlMedium(logoPath);  // w185
const largeLogo = getPlatformLogoUrlLarge(logoPath);    // w300
const originalLogo = getPlatformLogoUrlOriginal(logoPath); // original
```

## Exemplos de URLs Geradas

```typescript
// Input: "/yFrZVSC4UnDpeIzX2svcRPgV5P5.jpg"
// Output: "https://image.tmdb.org/t/p/w185/yFrZVSC4UnDpeIzX2svcRPgV5P5.jpg"

// Input: "/8z7rC8uIDaTM91X0ZfkRf04ydj2.jpg"
// Output: "https://image.tmdb.org/t/p/w185/8z7rC8uIDaTM91X0ZfkRf04ydj2.jpg"
```

## Vantagens da Configuração

1. **Flexibilidade**: Fácil mudança de tamanhos via variável de ambiente
2. **Performance**: Carregamento otimizado para diferentes dispositivos
3. **Manutenibilidade**: Configuração centralizada
4. **Escalabilidade**: Suporte a múltiplos tamanhos
5. **Fallback**: Logos estáticos em caso de erro

## Recomendações

- **Logos de plataformas**: Use `w185` (185px) - tamanho ideal para UI
- **Mobile**: Use `w92` para economizar banda
- **Desktop**: Use `w300` para melhor qualidade
- **Fallback**: Sempre mantenha logos estáticos como backup
