# 🔒 Guia de Segurança - Vibes and Films

Este documento descreve as medidas de segurança implementadas para proteger o projeto contra phishing, spam e outros ataques.

## 🛡️ Medidas de Segurança Implementadas

### 1. Headers de Segurança HTTP

Configurados no `vercel.json`:

- **X-Frame-Options: DENY** - Previne clickjacking
- **X-Content-Type-Options: nosniff** - Previne MIME type sniffing
- **X-XSS-Protection: 1; mode=block** - Proteção XSS adicional
- **Referrer-Policy: strict-origin-when-cross-origin** - Controle de referrer
- **Permissions-Policy** - Restringe acesso a recursos sensíveis
- **Content-Security-Policy** - Política de segurança de conteúdo
- **Strict-Transport-Security** - Força HTTPS

### 2. Content Security Policy (CSP)

Política restritiva que permite apenas recursos confiáveis:

```javascript
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https: http:;
connect-src 'self' https://moviesf-back.vercel.app https://image.tmdb.org;
frame-src 'self' https://www.youtube.com;
object-src 'none';
frame-ancestors 'none';
```

### 3. Validação de URLs e Domínios

- Lista de domínios permitidos
- Validação de protocolos (HTTPS/HTTP)
- Detecção de padrões suspeitos
- Bloqueio de URLs de phishing

### 4. Rate Limiting

- Limite de 10 requisições por minuto por cliente
- Burst limit de 20 requisições em 10 segundos
- Identificação única por cliente

### 5. Sanitização de Dados

- Sanitização de entrada de usuário
- Remoção de scripts maliciosos
- Validação de tipos de dados
- Escape de caracteres especiais

### 6. Monitoramento de Segurança

- Detecção de atividades suspeitas
- Log de eventos de segurança
- Monitoramento de DOM em tempo real
- Alertas para tentativas de phishing

### 7. Proteção contra XSS

- Sanitização de HTML
- Validação de atributos
- Escape de conteúdo dinâmico
- CSP restritivo

### 8. Prevenção de Clickjacking

- Headers X-Frame-Options
- JavaScript de detecção
- Bloqueio de iframes maliciosos

### 9. Controle de Crawlers

- `robots.txt` configurado
- Bloqueio de bots maliciosos
- Controle de acesso a recursos sensíveis

## 🚨 Detecção de Ameaças

### Padrões de Phishing Detectados

- URLs com IP addresses
- Domínios gratuitos suspeitos
- URL shorteners
- Palavras-chave suspeitas
- TLDs suspeitos

### Atividades Monitoradas

- Tentativas de redirecionamento
- Injeção de scripts
- Atributos suspeitos
- Mudanças no DOM
- Cliques em links suspeitos

## 📊 Logs e Monitoramento

### Eventos Registrados

- Tentativas de phishing
- Rate limit exceeded
- URLs suspeitas
- Conteúdo malicioso
- Erros de autenticação

### Níveis de Severidade

- **Low**: Informações gerais
- **Medium**: Avisos
- **High**: Ameaças detectadas
- **Critical**: Ataques ativos

## 🔧 Configuração

### Variáveis de Ambiente

```bash
NODE_ENV=production
VITE_SECURITY_LOG_URL=https://logs.emofilms.com
```

### Configurações por Ambiente

- **Development**: Logs detalhados, monitoramento ativo
- **Production**: Logs essenciais, otimizações de performance

## 📋 Checklist de Segurança

### Antes do Deploy

- [ ] Headers de segurança configurados
- [ ] CSP testado e validado
- [ ] Rate limiting ativo
- [ ] Monitoramento funcionando
- [ ] Logs configurados
- [ ] Domínios permitidos atualizados

### Monitoramento Contínuo

- [ ] Revisar logs de segurança
- [ ] Atualizar padrões de detecção
- [ ] Verificar headers de resposta
- [ ] Testar proteções
- [ ] Atualizar dependências

## 🆘 Resposta a Incidentes

### Em Caso de Ataque

1. **Identificar** - Analisar logs de segurança
2. **Isolar** - Bloquear IPs/domínios suspeitos
3. **Contain** - Implementar proteções adicionais
4. **Eliminar** - Remover ameaças
5. **Recuperar** - Restaurar serviços
6. **Aprender** - Atualizar proteções

### Contatos de Emergência

- **Segurança**: security@emofilms.com
- **Técnico**: tech@emofilms.com
- **Suporte**: support@emofilms.com

## 📚 Recursos Adicionais

### Documentação

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Security Headers](https://securityheaders.com/)

### Ferramentas

- [Security Headers Checker](https://securityheaders.com/)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

## 🔄 Atualizações

Este documento é atualizado regularmente conforme novas ameaças são identificadas e novas proteções são implementadas.

**Última atualização**: Janeiro 2024
**Versão**: 1.0.0
