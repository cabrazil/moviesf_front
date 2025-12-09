/**
 * Funções auxiliares memoizadas para MovieDetailsPage
 * Estas funções são movidas para fora do componente para evitar recriação
 */

// Tradução de categorias do Oscar (movida para fora do componente)
export const translateOscarCategory = (category: string): string => {
  if (!category) return '';
  
  const normalizedCategory = category.trim().toUpperCase();
  
  const translations: { [key: string]: string } = {
    'BEST PICTURE': 'Melhor Filme',
    'BEST DIRECTOR': 'Melhor Diretor',
    'BEST ACTOR': 'Melhor Ator',
    'BEST ACTRESS': 'Melhor Atriz',
    'BEST SUPPORTING ACTOR': 'Melhor Ator Coadjuvante',
    'BEST SUPPORTING ACTRESS': 'Melhor Atriz Coadjuvante',
    'BEST ORIGINAL SCREENPLAY': 'Melhor Roteiro Original',
    'BEST ADAPTED SCREENPLAY': 'Melhor Roteiro Adaptado',
    'BEST CINEMATOGRAPHY': 'Melhor Fotografia',
    'BEST FILM EDITING': 'Melhor Edição',
    'BEST PRODUCTION DESIGN': 'Melhor Direção de Arte',
    'BEST COSTUME DESIGN': 'Melhor Figurino',
    'BEST MAKEUP AND HAIRSTYLING': 'Melhor Maquiagem e Penteados',
    'BEST SOUND': 'Melhor Som',
    'BEST SOUND EDITING': 'Melhor Edição de Som',
    'SOUND EFFECTS EDITING': 'Melhor Edição de Efeitos Sonoros',
    'BEST SOUND MIXING': 'Melhor Mixagem de Som',
    'BEST VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'BEST ORIGINAL SCORE': 'Melhor Trilha Sonora Original',
    'BEST ORIGINAL SONG': 'Melhor Canção Original',
    'MUSIC (Original Score)': 'Melhor Trilha Sonora Original',
    'MUSIC (ORIGINAL SCORE)': 'Melhor Trilha Sonora Original',
    'WRITING (Original Screenplay)': 'Melhor Roteiro Original',
    'WRITING (ORIGINAL SCREENPLAY)': 'Melhor Roteiro Original',
    'WRITING (Adapted Screenplay)': 'Melhor Roteiro Adaptado',
    'WRITING (ADAPTED SCREENPLAY)': 'Melhor Roteiro Adaptado',
    'WRITING (Story and Screenplay--written directly for the screen)': 'Melhor Roteiro Original',
    'WRITING (STORY AND SCREENPLAY--WRITTEN DIRECTLY FOR THE SCREEN)': 'Melhor Roteiro Original',
    'WRITING (Screenplay Based on Material from Another Medium)': 'Melhor Roteiro Adaptado',
    'WRITING (SCREENPLAY BASED ON MATERIAL FROM ANOTHER MEDIUM)': 'Melhor Roteiro Adaptado',
    'WRITING (Screenplay Based on Material Previously Produced or Published)': 'Melhor Roteiro baseado em material produzido ou publicado anteriormente',
    'WRITING (SCREENPLAY BASED ON MATERIAL PREVIOUSLY PRODUCED OR PUBLISHED)': 'Melhor Roteiro baseado em material produzido ou publicado anteriormente',
    'BEST INTERNATIONAL FEATURE FILM': 'Melhor Filme Internacional',
    'BEST DOCUMENTARY FEATURE': 'Melhor Documentário',
    'BEST DOCUMENTARY SHORT SUBJECT': 'Melhor Documentário em Curta-Metragem',
    'BEST ANIMATED FEATURE FILM': 'Melhor Filme de Animação',
    'BEST ANIMATED SHORT FILM': 'Melhor Curta-Metragem de Animação',
    'BEST LIVE ACTION SHORT FILM': 'Melhor Curta-Metragem de Ação ao Vivo',
    'ACTOR IN A LEADING ROLE': 'Melhor Ator',
    'ACTRESS IN A LEADING ROLE': 'Melhor Atriz',
    'ACTOR IN A SUPPORTING ROLE': 'Melhor Ator Coadjuvante',
    'ACTRESS IN A SUPPORTING ROLE': 'Melhor Atriz Coadjuvante',
    'DIRECTING': 'Melhor Diretor',
    'CINEMATOGRAPHY': 'Melhor Fotografia',
    'FILM EDITING': 'Melhor Edição',
    'PRODUCTION DESIGN': 'Melhor Direção de Arte',
    'ART DIRECTION': 'Melhor Direção de Arte',
    'COSTUME DESIGN': 'Melhor Figurino',
    'MAKEUP AND HAIRSTYLING': 'Melhor Maquiagem e Penteados',
    'SOUND': 'Melhor Som',
    'SOUND MIXING': 'Melhor Mixagem de Som',
    'SOUND EDITING': 'Melhor Edição de Som',
    'VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'SPECIAL VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'ORIGINAL SCORE': 'Melhor Trilha Sonora Original',
    'ORIGINAL SONG': 'Melhor Canção Original',
    'MUSIC (Original Dramatic Score)': 'Melhor Trilha Sonora Original',
    'MUSIC (ORIGINAL DRAMATIC SCORE)': 'Melhor Trilha Sonora Original',
    'MUSIC (Original Song)': 'Melhor Canção Original',
    'MUSIC (ORIGINAL SONG)': 'Melhor Canção Original',
    'WRITING (Screenplay Written Directly for the Screen)': 'Melhor Roteiro Original',
    'WRITING (SCREENPLAY WRITTEN DIRECTLY FOR THE SCREEN)': 'Melhor Roteiro Original',
    'INTERNATIONAL FEATURE FILM': 'Melhor Filme Internacional',
    'DOCUMENTARY FEATURE': 'Melhor Documentário',
    'ANIMATED FEATURE FILM': 'Melhor Filme de Animação'
  };

  // Buscar tradução exata primeiro
  if (translations[normalizedCategory]) {
    return translations[normalizedCategory];
  }
  
  // Se não encontrou, tentar match parcial para categorias de WRITING
  if (normalizedCategory.includes('WRITING') && normalizedCategory.includes('SCREENPLAY')) {
    if (normalizedCategory.includes('WRITTEN DIRECTLY') || normalizedCategory.includes('ORIGINAL')) {
      return 'Melhor Roteiro Original';
    }
    if (normalizedCategory.includes('ADAPTED') || normalizedCategory.includes('BASED ON')) {
      return 'Melhor Roteiro Adaptado';
    }
  }
  
  return category;
};

// Mapeamentos estáticos (não recriados)
export const SENTIMENT_NAMES: { [key: number]: string } = {
  13: "Feliz / Alegre",
  14: "Triste", 
  15: "Calmo(a)",
  16: "Ansioso(a)",
  17: "Animado(a)",
  18: "Cansado(a)"
};

export const INTENTION_NAMES: { [key: string]: string } = {
  "PROCESS": "Processar",
  "MAINTAIN": "Manter",
  "TRANSFORM": "Transformar",
  "REPLACE": "Substituir",
  "EXPLORE": "Explorar"
};

export const INTENTION_CONNECTORS: { [key: string]: string } = {
  "PROCESS": "este filme traz",
  "MAINTAIN": "este filme oferece",
  "TRANSFORM": "este filme pode te ajudar através de",
  "REPLACE": "este filme é ideal com",
  "EXPLORE": "este filme oferece"
};

// Função para gerar dados do conteúdo personalizado (retorna dados, não JSX)
export interface PersonalizedContentData {
  title: string;
  sentimentName: string;
  intentionName: string;
  connector: string;
  formattedReason: string;
  hasPersonalizedContent: boolean;
  defaultContent?: string;
}

export const getPersonalizedContent = (
  sentimentId: number | undefined,
  intentionType: string | undefined,
  reason: string | undefined,
  landingPageHook: string | undefined
): PersonalizedContentData => {
  if (!sentimentId || !intentionType || !reason) {
    return {
      title: "Por que assistir a este filme?",
      sentimentName: "",
      intentionName: "",
      connector: "",
      formattedReason: "",
      hasPersonalizedContent: false,
      defaultContent: landingPageHook ? 
        landingPageHook.replace(/<[^>]*>/g, '') : 
        "Este filme oferece uma experiência cinematográfica única que vale a pena assistir."
    };
  }

  const sentimentName = SENTIMENT_NAMES[sentimentId] || "emocional";
  const intentionName = INTENTION_NAMES[intentionType] || "emocional";
  const connector = INTENTION_CONNECTORS[intentionType] || "este filme oferece";
  const formattedReason = reason.charAt(0).toLowerCase() + reason.slice(1);

  return {
    title: "Por que assistir a este filme?",
    sentimentName,
    intentionName,
    connector,
    formattedReason,
    hasPersonalizedContent: true
  };
};

