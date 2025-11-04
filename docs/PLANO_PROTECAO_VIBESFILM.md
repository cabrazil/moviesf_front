# Plano de Proteção do Domínio vibesfilm.com

## Contexto

O domínio anterior (emofilms.com) foi suspenso por acusações de phishing/malware reportadas ao VirusTotal. Precisamos implementar medidas preventivas robustas para evitar que o mesmo aconteça com vibesfilm.com.

## 1. Documentos Legais e Conformidade

### 1.1 Criar Política de Privacidade

- **Arquivo**: `moviesf_front/public/privacy-policy.html` ou `moviesf_front/src/pages/PrivacyPolicy.tsx`
- **Conteúdo essencial**:
  - Identificação clara da empresa/responsável
  - Dados coletados (e-mail para newsletter)
  - Finalidade da coleta
  - Não compartilhamento com terceiros
  - Direitos do usuário (LGPD/GDPR)
  - Contato para dúvidas

### 1.2 Criar Termos de Uso

- **Arquivo**: `moviesf_front/public/terms-of-service.html` ou `moviesf_front/src/pages/TermsOfService.tsx`
- **Conteúdo essencial**:
  - Natureza do serviço (recomendação de filmes)
  - Uso legítimo apenas
  - Proibição de atividades ilegais
  - Isenção de responsabilidade sobre conteúdo de terceiros
  - Propriedade intelectual

### 1.3 Adicionar Links no Footer

- **Arquivo**: `moviesf_front/src/components/Footer.tsx` (ou equivalente)
- Adicionar links visíveis para:
  - Política de Privacidade
  - Termos de Uso
  - Contato/Suporte

## 2. Headers de Segurança HTTP

### 2.1 Configurar Headers no Vercel

- **Arquivo**: `moviesf_front/vercel.json`
- Adicionar headers de segurança:
  ```json
  {
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          },
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-XSS-Protection",
            "value": "1; mode=block"
          },
          {
            "key": "Referrer-Policy",
            "value": "strict-origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "geolocation=(), microphone=(), camera=()"
          },
          {
            "key": "Content-Security-Policy",
            "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://c3da75ce6779.ngrok-free.app https://moviesf-back.vercel.app;"
          }
        ]
      }
    ]
  }
  ```

## 3. Proteção Cloudflare

### 3.1 Configurações Essenciais no Cloudflare

- **SSL/TLS**: Modo "Full (strict)" ou "Full"
- **Always Use HTTPS**: Ativado
- **Automatic HTTPS Rewrites**: Ativado
- **Security Level**: Medium ou High
- **Bot Fight Mode**: Ativado (plano gratuito)
- **Email Obfuscation**: Ativado

### 3.2 Firewall Rules (WAF)

- Criar regra para bloquear países suspeitos (opcional)
- Criar regra para bloquear user-agents maliciosos
- Rate limiting para prevenir scraping agressivo

### 3.3 Page Rules

- Cache Level: Standard
- Browser Cache TTL: Respect Existing Headers

## 4. Identificação Clara do Site

### 4.1 Adicionar Página "Sobre"

- **Arquivo**: `moviesf_front/src/pages/About.tsx`
- **Conteúdo**:
  - Propósito do site (recomendação de filmes baseada em emoções)
  - Não é site de streaming ilegal
  - Não solicita dados financeiros
  - Informações de contato legítimas

### 4.2 Adicionar Meta Tags de Verificação

- **Arquivo**: `moviesf_front/src/pages/_document.tsx` ou `moviesf_front/index.html`
- Adicionar meta tags:
  ```html
  <meta name="description" content="Vibesfilm - Recomendações de filmes baseadas em suas emoções. Descubra o filme perfeito para cada momento." />
  <meta name="author" content="Vibesfilm" />
  <meta name="robots" content="index, follow" />
  ```

## 5. Formulários Seguros

### 5.1 Validar Formulário de Newsletter

- **Arquivo**: Componente de newsletter (se existir)
- Implementar:
  - Validação de e-mail no frontend e backend
  - reCAPTCHA ou hCaptcha
  - Rate limiting
  - Double opt-in (confirmação por e-mail)

### 5.2 Evitar Campos Sensíveis

- **Nunca** solicitar:
  - Senhas (já que não há login)
  - Dados de cartão de crédito
  - CPF/RG
  - Dados bancários

## 6. Monitoramento e Resposta

### 6.1 Configurar Monitoramento

- **Google Search Console**: Adicionar propriedade e verificar
- **VirusTotal Monitor**: Monitorar o domínio (https://www.virustotal.com/gui/monitor)
- **Cloudflare Analytics**: Monitorar tráfego suspeito

### 6.2 Criar Página de Contato

- **Arquivo**: `moviesf_front/src/pages/Contact.tsx`
- Incluir:
  - E-mail de contato profissional (ex: contato@vibesfilm.com)
  - Formulário de contato simples
  - Informações para reportar problemas

### 6.3 Preparar Documentação de Resposta

- Criar documento com:
  - Prints do site mostrando conteúdo legítimo
  - Política de Privacidade e Termos de Uso
  - Explicação do propósito do site
  - Logs de acesso (se necessário)
  - Informações de contato

## 7. Boas Práticas de Deploy

### 7.1 Variáveis de Ambiente

- **Arquivo**: `moviesf_front/.env.production`
- Garantir que URLs de API estejam corretas
- Usar HTTPS em todas as URLs

### 7.2 Build de Produção

- Executar `npm run build` localmente para verificar erros
- Testar build localmente antes do deploy
- Verificar que não há console.logs sensíveis

### 7.3 Configuração Vercel

- Adicionar domínio customizado vibesfilm.com
- Configurar SSL automático
- Habilitar "Automatically expose System Environment Variables"

## 8. Checklist Pré-Lançamento

- [ ] Política de Privacidade publicada e acessível
- [ ] Termos de Uso publicados e acessíveis
- [ ] Links no footer para documentos legais
- [ ] Headers de segurança configurados
- [ ] Cloudflare configurado corretamente (SSL, WAF, Bot Protection)
- [ ] Meta tags de SEO e descrição claras
- [ ] Página "Sobre" explicando o propósito do site
- [ ] Página de Contato com e-mail profissional
- [ ] Google Search Console configurado
- [ ] VirusTotal Monitor configurado
- [ ] Formulários com validação e proteção anti-spam
- [ ] Nenhum campo sensível (senha, cartão, etc)
- [ ] Build de produção testado localmente
- [ ] Domínio configurado na Vercel
- [ ] SSL ativo e funcionando

## 9. Ações Imediatas Pós-Lançamento

### Primeiras 24 horas:

1. Verificar se o site está acessível via HTTPS
2. Testar todos os links (Privacidade, Termos, Contato)
3. Verificar headers de segurança usando https://securityheaders.com
4. Submeter sitemap no Google Search Console
5. Verificar no VirusTotal se o domínio está limpo

### Primeira semana:

1. Monitorar Cloudflare Analytics para tráfego anormal
2. Verificar Google Search Console para avisos
3. Checar VirusTotal diariamente
4. Responder rapidamente a qualquer e-mail de abuse

## 10. Diferenças Críticas vs emofilms.com

**O que pode ter causado a suspensão do emofilms.com:**

- Falta de documentação legal visível
- Ausência de headers de segurança
- Possível scraping agressivo de bots
- Falta de identificação clara do propósito
- Sem proteção Cloudflare adequada

**O que o vibesfilm.com terá:**

- Documentação legal completa e visível
- Headers de segurança robustos
- Proteção Cloudflare ativa (SSL, WAF, Bot Protection)
- Identificação clara como site de recomendação (não streaming)
- Monitoramento proativo
- E-mail profissional para contato

## Arquivos a Criar/Modificar

1. `moviesf_front/src/pages/PrivacyPolicy.tsx` - Nova página
2. `moviesf_front/src/pages/TermsOfService.tsx` - Nova página
3. `moviesf_front/src/pages/About.tsx` - Nova página
4. `moviesf_front/src/pages/Contact.tsx` - Nova página
5. `moviesf_front/vercel.json` - Criar ou modificar
6. `moviesf_front/src/components/Footer.tsx` - Modificar (adicionar links legais)
7. `moviesf_front/public/robots.txt` - Criar ou modificar
8. `moviesf_front/public/sitemap.xml` - Criar

## Observações Importantes

- **Não use formulários de login/senha** sem necessidade real
- **Não redirecione** para sites externos suspeitos
- **Não colete dados** além do estritamente necessário (e-mail para newsletter)
- **Responda rapidamente** a qualquer notificação de abuse
- **Mantenha backups** de toda documentação e prints do site
- **Use e-mail profissional** (não Gmail/Hotmail pessoal)

## To-dos

- [ ] Criar Política de Privacidade e Termos de Uso
- [ ] Configurar headers de segurança no vercel.json
- [ ] Configurar proteções no Cloudflare (SSL, WAF, Bot Protection)
- [ ] Criar páginas Sobre e Contato
- [ ] Adicionar links legais no footer
- [ ] Adicionar meta tags de SEO e segurança
- [ ] Configurar Google Search Console e VirusTotal Monitor
- [ ] Executar checklist completo pré-lançamento

