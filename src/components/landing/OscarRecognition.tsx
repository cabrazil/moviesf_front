import React, { useState } from 'react';
import { Box, Typography, Button, Collapse, Stack } from '@mui/material';

interface OscarAward {
  category: string;
  year: number;
  personName?: string;
}

interface OscarAwards {
  wins: OscarAward[];
  nominations: OscarAward[];
  totalWins: number;
  totalNominations: number;
}

interface OscarRecognitionProps {
  movieTitle: string;
  oscarAwards: OscarAwards;
}

// Função para traduzir categorias do Oscar
const translateOscarCategory = (category: string): string => {
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
    'BEST SOUND MIXING': 'Melhor Mixagem de Som',
    'BEST VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'BEST ORIGINAL SCORE': 'Melhor Trilha Sonora Original',
    'BEST ORIGINAL SONG': 'Melhor Canção Original',
    'MUSIC (Original Score)': 'Melhor Trilha Sonora Original',
    'WRITING (Original Screenplay)': 'Melhor Roteiro Original',
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
    'COSTUME DESIGN': 'Melhor Figurino',
    'MAKEUP AND HAIRSTYLING': 'Melhor Maquiagem e Penteados',
    'SOUND': 'Melhor Som',
    'VISUAL EFFECTS': 'Melhores Efeitos Visuais',
    'ORIGINAL SCORE': 'Melhor Trilha Sonora Original',
    'ORIGINAL SONG': 'Melhor Canção Original',
    'INTERNATIONAL FEATURE FILM': 'Melhor Filme Internacional',
    'DOCUMENTARY FEATURE': 'Melhor Documentário',
    'ANIMATED FEATURE FILM': 'Melhor Filme de Animação'
  };

  return translations[category] || category;
};

// Função para formatar o texto principal
const formatMainText = (movieTitle: string, oscarAwards: OscarAwards): string => {
  const totalNominations = oscarAwards.totalWins + oscarAwards.totalNominations;
  const year = oscarAwards.wins.length > 0 ? oscarAwards.wins[0].year : 
               oscarAwards.nominations.length > 0 ? oscarAwards.nominations[0].year : 2024;

  if (oscarAwards.totalWins === 0) {
    return `${movieTitle} foi indicado a ${totalNominations} Oscar${totalNominations > 1 ? 's' : ''} em ${year}.`;
  }

  const winCategories = oscarAwards.wins.map(win => translateOscarCategory(win.category));
  const winText = winCategories.join(', ');

  if (oscarAwards.totalNominations === 0) {
    return `${movieTitle} conquistou ${winText} em ${year}.`;
  }

  // Quebrar o texto em mais linhas para melhor legibilidade
  if (winCategories.length <= 2) {
    return `${movieTitle} foi indicado a ${totalNominations} Oscar${totalNominations > 1 ? 's' : ''} em ${year},\nconquistou ${winText}.`;
  } else {
    // Se há muitas categorias, quebrar em linhas separadas
    const winTextFormatted = winCategories.join(',\n');
    return `${movieTitle} foi indicado a ${totalNominations} Oscar${totalNominations > 1 ? 's' : ''} em ${year},\nconquistou:\n${winTextFormatted}.`;
  }
};

const OscarRecognition: React.FC<OscarRecognitionProps> = ({ movieTitle, oscarAwards }) => {
  const [showAllNominations, setShowAllNominations] = useState(false);

  // Filtrar apenas os nomes que contêm "Producers", mantendo as categorias
  const filteredNominations = oscarAwards.nominations.map(award => {
    if (award.personName?.includes('Producers')) {
      return { ...award, personName: undefined };
    }
    return award;
  });

  // Pegar apenas as principais indicações (não vitórias, pois já aparecem no texto principal)
  const mainAwards = filteredNominations.slice(0, 3);
  const remainingAwards = filteredNominations.slice(3);

  const mainText = formatMainText(movieTitle, oscarAwards);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          color: '#1976d2', 
          fontWeight: 500,
          textAlign: { xs: 'center', md: 'left' },
          fontSize: { xs: '0.95rem', md: '1rem' }
        }}
      >
        Reconhecimento no Oscar
      </Typography>

      <Typography 
        variant="body2" 
        sx={{ 
          mb: 2,
          lineHeight: 1.4,
          whiteSpace: 'pre-line',
          fontSize: { xs: '0.9rem', md: '0.95rem' },
          textAlign: { xs: 'center', md: 'left' },
          wordBreak: 'break-word'
        }}
      >
        {mainText}
      </Typography>

      <Typography 
        variant="body2" 
        sx={{ 
          fontWeight: 600, 
          mb: 1,
          color: '#1976d2',
          fontSize: { xs: '0.9rem', md: '0.95rem' },
          textAlign: { xs: 'center', md: 'left' }
        }}
      >
        Outras Indicações ({oscarAwards.wins.length > 0 ? oscarAwards.wins[0].year : oscarAwards.nominations[0]?.year || 2024}):
      </Typography>

      <Stack spacing={0.75}>
        {mainAwards.map((award, index) => (
          <Typography 
            key={index} 
            variant="body2" 
            sx={{ 
              fontSize: { xs: '0.85rem', md: '0.9rem' },
              textAlign: { xs: 'center', md: 'left' },
              lineHeight: 1.4,
              wordBreak: 'break-word'
            }}
          >
            • {translateOscarCategory(award.category)}
            {award.personName && (
              <span style={{ color: 'text.secondary', fontSize: '0.85em', fontStyle: 'italic' }}>
                {' -- '}{award.personName}
              </span>
            )}
          </Typography>
        ))}
      </Stack>

      {remainingAwards.length > 0 && (
        <>
          <Collapse in={showAllNominations}>
            <Stack spacing={0.75} sx={{ mt: 1 }}>
              {remainingAwards.map((award, index) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    textAlign: { xs: 'center', md: 'left' },
                    lineHeight: 1.4,
                    wordBreak: 'break-word'
                  }}
                >
                  • {translateOscarCategory(award.category)}
                  {award.personName && (
                    <span style={{ color: 'text.secondary', fontSize: '0.85em', fontStyle: 'italic' }}>
                      {' -- '}{award.personName}
                    </span>
                  )}
                </Typography>
              ))}
            </Stack>
          </Collapse>

          <Button
            onClick={() => setShowAllNominations(!showAllNominations)}
            sx={{ 
              mt: 1, 
              p: 0, 
              minWidth: 'auto',
              textTransform: 'none',
              color: 'primary.main',
              textAlign: { xs: 'center', md: 'left' },
              alignSelf: { xs: 'center', md: 'flex-start' },
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            {showAllNominations ? 'Ver menos...' : `Ver mais...`}
          </Button>
        </>
      )}
    </Box>
  );
};

export default OscarRecognition;
