# Análise do Script Orchestrator.ts

## Visão Geral
O `orchestrator.ts` é um script de automação complexo que gerencia todo o pipeline de curadoria de filmes no sistema Vibesfilm. Ele coordena múltiplos scripts e processos para analisar, processar e integrar filmes no banco de dados com base em análise emocional e de jornada do usuário.

## Arquitetura e Responsabilidades

### Classe Principal: `MovieCurationOrchestrator`
- **Propósito**: Orquestrar todo o fluxo de processamento de filmes
- **Localização**: `/home/cabrazil/newprojs/fav_movies/moviesf_back/src/scripts/orchestrator.ts`
- **Dependências**: PrismaClient, scripts auxiliares, provedores de IA

### Interfaces Principais
```typescript
interface MovieToProcess {
  title: string;
  year: number;
  journeyOptionFlowId: number;
  analysisLens: number;
  journeyValidation: number;
  aiProvider?: 'openai' | 'gemini' | 'deepseek' | 'auto';
}

interface ProcessingResult {
  success: boolean;
  movie?: { title: string; year: number; id: string };
  error?: string;
}
```

## Fluxo de Processamento (5 Etapas)

### Etapa 0: Limpeza
- Limpa o arquivo `inserts.sql` para evitar conflitos

### Etapa 1: Adição do Filme
- **Script**: `populateMovies.ts`
- **Função**: Adiciona filme ao banco de dados
- **Input**: Título e ano do filme
- **Output**: TMDB ID capturado do output do script

### Etapa 2: Análise de Sentimentos
- **Script**: `analyzeMovieSentiments.ts`
- **Função**: Analisa sentimentos do filme usando IA
- **Input**: TMDB ID, journeyOptionFlowId, analysisLens, aiProvider
- **Features**:
  - Seleção automática de provedor de IA baseada no contexto
  - Sistema de aprovação para novos subsentimentos
  - Validação de curador para criação de subsentimentos

### Etapa 2.5: Aprovação do Curador
- **Sistema de Aprovação**: Verifica se a IA sugeriu novos subsentimentos
- **Flag**: `--approve-new-subsentiments` para aprovação automática
- **Processo**: Exibe sugestões e aguarda aprovação manual ou automática

### Etapa 3: Execução de INSERTs
- **Script**: `executeSqlFromFile.ts`
- **Função**: Executa comandos SQL gerados na análise
- **Arquivo**: `inserts.sql` (gerado dinamicamente)

### Etapa 4: Descoberta e Curadoria
- **Script**: `discoverAndCurateAutomated.ts`
- **Função**: Descobre e cura sugestões de filmes
- **Input**: TMDB ID, journeyValidation, journeyOptionFlowId, intenção
- **Output**: Sugestões de filmes com scores de relevância

### Etapa 5: Atualização de Campos Genéricos (Condicional)
- **Condição**: Baseada no `relevanceScore` da jornada atual vs. melhor existente
- **Scripts**: Geração de `landingPageHook` e `contentWarnings`
- **Lógica**: Só atualiza se o score atual for maior que o melhor existente

## Funcionalidades Avançadas

### 1. Seleção Inteligente de IA Provider
```typescript
// Seleção automática baseada no contexto do filme
const context = {
  genres: movieData.genres || [],
  keywords: movieData.keywords || [],
  analysisLens: movie.analysisLens,
  isComplexDrama: movieData.genres?.some(g => g.toLowerCase().includes('drama'))
};
finalAiProvider = selectOptimalAIProvider(context);
```

### 2. Sistema de RelevanceScore
- **Função**: `shouldUpdateGenericFields()`
- **Lógica**: Compara score da jornada atual com melhor score existente
- **Decisão**: Atualiza campos genéricos apenas se score atual for superior

### 3. Geração de Conteúdo com IA
#### Landing Page Hook
- **Target Audience**: Descrição do benefício emocional do filme
- **Hook**: Gancho cativante começando com "Prepare-se para..."
- **Contexto**: Baseado em análise de sentimentos e subsentimentos

#### Content Warnings
- **Categorias**: Violência, conteúdo adulto, temas sensíveis, intensidade emocional
- **Formato**: Frase única começando com "Atenção:"
- **Precisão**: Diferencia entre "abordar tema" vs "conter cenas explícitas"

### 4. Execução de Scripts
- **Método**: `runScript()` usando `spawn` do Node.js
- **Captura**: Output e error streams
- **Tratamento**: Filtragem de logs de aprovação do curador

## Parâmetros de Entrada

### Obrigatórios
- `--title`: Título do filme
- `--year`: Ano de lançamento
- `--journeyOptionFlowId`: ID da opção de jornada
- `--analysisLens`: Lente de análise (1-20)
- `--journeyValidation`: Validação da jornada (1-20)

### Opcionais
- `--approve-new-subsentiments`: Aprovação automática de novos subsentimentos
- `--ai-provider`: Escolha manual do provedor de IA (openai|gemini|deepseek|auto)

## Tratamento de Erros

### Níveis de Erro
1. **Falha na adição do filme**: Retorna erro e para processamento
2. **Falha na análise**: Retorna erro e para processamento
3. **Falha na curadoria**: Retorna erro e para processamento
4. **Falhas em campos genéricos**: Loga aviso mas continua processamento

### Validações
- Verificação de TMDB ID capturado
- Validação de aprovação do curador
- Verificação de existência do filme no banco
- Validação de conteúdo gerado pela IA

## Integração com Sistema

### Scripts Coordenados
1. `populateMovies.ts` - Adição de filmes
2. `analyzeMovieSentiments.ts` - Análise emocional
3. `executeSqlFromFile.ts` - Execução de SQL
4. `discoverAndCurateAutomated.ts` - Curadoria automática

### Banco de Dados
- **ORM**: Prisma Client
- **Tabelas Principais**: Movie, MovieSentiment, JourneyOptionFlow, MovieSuggestionFlow
- **Relacionamentos**: Complexa rede de relacionamentos entre sentimentos, jornadas e sugestões

### Provedores de IA
- **OpenAI**: Para análises complexas
- **Gemini**: Para análises econômicas
- **DeepSeek**: Alternativa de custo-benefício
- **Auto**: Seleção automática baseada no contexto

## Pontos de Atenção

### 1. Dependências Externas
- Requer todos os scripts auxiliares funcionando
- Depende de conectividade com APIs de IA
- Necessita acesso ao banco de dados

### 2. Processamento Sequencial
- Processa um filme por vez (não paralelo)
- Pode ser lento para grandes volumes
- Depende de aprovação manual para novos subsentimentos

### 3. Robustez
- Sistema de fallbacks para provedores de IA
- Tratamento de erros em múltiplos níveis
- Validação de dados em cada etapa

## Casos de Uso

### Uso Típico
```bash
npx ts-node orchestrator.ts \
  --title="Blade Runner 2049" \
  --year=2017 \
  --journeyOptionFlowId=54 \
  --analysisLens=14 \
  --journeyValidation=15 \
  --ai-provider=auto
```

### Uso com Aprovação Automática
```bash
npx ts-node orchestrator.ts \
  --title="Filme" \
  --year=2023 \
  --journeyOptionFlowId=55 \
  --analysisLens=12 \
  --journeyValidation=18 \
  --approve-new-subsentiments
```

## Conclusão

O `orchestrator.ts` é um componente crítico do sistema Vibesfilm que automatiza o complexo processo de curadoria de filmes baseada em análise emocional. Ele combina múltiplas tecnologias (IA, banco de dados, análise de sentimentos) em um pipeline robusto e inteligente, com sistemas de validação e aprovação para garantir qualidade e precisão nas sugestões de filmes.

O script demonstra uma arquitetura bem pensada com separação de responsabilidades, tratamento de erros abrangente e flexibilidade na escolha de provedores de IA, tornando-o uma ferramenta poderosa para a curadoria automatizada de conteúdo cinematográfico.
