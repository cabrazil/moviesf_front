import React, { useState } from 'react';
import { Box, Typography, Button, Collapse } from '@mui/material';

interface OscarAward {
  category: string;
  categoryName?: string; // Para compatibilidade com backend
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
    'WRITING (Adapted Screenplay)': 'Melhor Roteiro Adaptado',
    'WRITING (Story and Screenplay--written directly for the screen)': 'Melhor Roteiro Original',
    'WRITING (Screenplay Based on Material from Another Medium)': 'Melhor Roteiro Adaptado',
    'WRITING (Screenplay Based on Material Previously Produced or Published)': 'Melhor Roteiro baseado em material produzido ou publicado anteriormente',
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
    'MUSIC (Original Song)': 'Melhor Canção Original',
    'WRITING (Screenplay Written Directly for the Screen)': 'Melhor Roteiro Original',
    'INTERNATIONAL FEATURE FILM': 'Melhor Filme Internacional',
    'DOCUMENTARY FEATURE': 'Melhor Documentário',
    'ANIMATED FEATURE FILM': 'Melhor Filme de Animação'
  };

  return translations[category] || category;
};

// Função para formatar o texto de introdução
const formatIntroText = (movieTitle: string, oscarAwards: OscarAwards): string => {
  const totalNominations = oscarAwards.totalWins + oscarAwards.totalNominations;
  const year = oscarAwards.wins.length > 0 ? oscarAwards.wins[0].year : 
               oscarAwards.nominations.length > 0 ? oscarAwards.nominations[0].year : 2024;

  if (oscarAwards.totalWins === 0) {
    return `${movieTitle} foi indicado a ${totalNominations} Oscar${totalNominations > 1 ? 's' : ''} em ${year}.`;
  }

  if (oscarAwards.totalNominations === 0) {
    return `${movieTitle} conquistou ${oscarAwards.totalWins} Oscar${oscarAwards.totalWins > 1 ? 's' : ''} em ${year}.`;
  }

  return `${movieTitle} foi indicado a ${totalNominations} Oscar${totalNominations > 1 ? 's' : ''} em ${year}, conquistou:`;
};

const OscarRecognition: React.FC<OscarRecognitionProps> = ({ movieTitle, oscarAwards }) => {
  const [showAllNominations, setShowAllNominations] = useState(false);

  // Usar indicações sem filtro
  const filteredNominations = oscarAwards.nominations;

  // Pegar apenas as principais indicações (não vitórias, pois já aparecem no texto principal)
  const mainAwards = filteredNominations.slice(0, 3);
  const remainingAwards = filteredNominations.slice(3);

  const introText = formatIntroText(movieTitle, oscarAwards);

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr' },
      gap: 2
    }}>
      {/* Card Principal - Reconhecimento no Oscar */}
      <Box sx={{ 
        pt: 1,
        pb: 2,
        px: 0, 
        position: 'relative',
        overflow: 'hidden',
        textAlign: { xs: 'center', md: 'left' }
      }}>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 2,
            lineHeight: 1.6,
            fontSize: { xs: '1rem', md: '1.1rem' },
            color: 'text.primary',
            fontWeight: 500
          }}
        >
          {introText}
        </Typography>

        {/* Grid das Conquistas/Vitórias */}
        {oscarAwards.wins.length > 0 && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 1.5,
            mt: 1,
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            {oscarAwards.wins.map((win, index) => (
              <Box 
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.9rem', md: '0.95rem' },
                    lineHeight: 1.4,
                    fontWeight: 600,
                    color: '#1976d2'
                  }}
                >
                  {translateOscarCategory(win.categoryName || win.category)}
                </Typography>
                {win.personName && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.8rem', md: '0.85rem' },
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      mt: 0.5
                    }}
                  >
                    {win.personName}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Grid das Indicações - Quando não há vitórias, exibe as indicações aqui */}
        {oscarAwards.wins.length === 0 && mainAwards.length > 0 && (
          <>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
              gap: 1.5,
              mt: 1,
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              {mainAwards.map((award, index) => (
                <Box 
                  key={index}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    bgcolor: 'rgba(25, 118, 210, 0.05)',
                    textAlign: 'center'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.9rem', md: '0.95rem' },
                      lineHeight: 1.4,
                      fontWeight: 600,
                      color: '#1976d2'
                    }}
                  >
                    {translateOscarCategory(award.categoryName || award.category)}
                  </Typography>
                  {award.personName && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: { xs: '0.8rem', md: '0.85rem' },
                        color: 'text.secondary',
                        fontStyle: 'italic',
                        mt: 0.5
                      }}
                    >
                      {award.personName}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            {/* Indicações restantes quando não há vitórias */}
            {remainingAwards.length > 0 && (
              <>
                <Collapse in={showAllNominations}>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 1.5,
                    mt: 2,
                    justifyContent: { xs: 'center', md: 'flex-start' }
                  }}>
                    {remainingAwards.map((award, index) => (
                      <Box 
                        key={index}
                        sx={{
                          p: 2,
                          border: '1px solid #e0e0e0',
                          borderRadius: 1,
                          bgcolor: 'rgba(25, 118, 210, 0.05)',
                          textAlign: 'center'
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: { xs: '0.9rem', md: '0.95rem' },
                            lineHeight: 1.4,
                            fontWeight: 600,
                            color: '#1976d2'
                          }}
                        >
                          {translateOscarCategory(award.categoryName || award.category)}
                        </Typography>
                        {award.personName && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: { xs: '0.8rem', md: '0.85rem' },
                              color: 'text.secondary',
                              fontStyle: 'italic',
                              mt: 0.5
                            }}
                          >
                            {award.personName}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Collapse>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="outlined"
                    onClick={() => setShowAllNominations(!showAllNominations)}
                    sx={{ 
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        borderColor: '#1565c0',
                        color: '#1565c0',
                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                  >
                    {showAllNominations ? 'Ver menos...' : `Ver mais...`}
                  </Button>
                </Box>
              </>
            )}
          </>
        )}
      </Box>

      {/* Card de Indicações - Só exibe se houver vitórias */}
      {mainAwards.length > 0 && oscarAwards.wins.length > 0 && (
        <Box sx={{ 
          pt: 1,
          pb: 2,
          px: 0,
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2,
              lineHeight: 1.6,
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            Outras Indicações ({oscarAwards.wins[0].year})
          </Typography>

          {/* Grid das Indicações */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 1.5,
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            {mainAwards.map((award, index) => (
              <Box 
                key={index}
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  bgcolor: 'rgba(25, 118, 210, 0.05)',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.9rem', md: '0.95rem' },
                    lineHeight: 1.4,
                    fontWeight: 600,
                    color: '#1976d2'
                  }}
                >
                  {translateOscarCategory(award.categoryName || award.category)}
                </Typography>
                {award.personName && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: '0.8rem', md: '0.85rem' },
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      mt: 0.5
                    }}
                  >
                    {award.personName}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>

          {remainingAwards.length > 0 && (
            <>
              <Collapse in={showAllNominations}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 1.5,
                  mt: 2,
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  {remainingAwards.map((award, index) => (
                    <Box 
                      key={index}
                      sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        bgcolor: 'rgba(25, 118, 210, 0.05)',
                        textAlign: 'center'
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: { xs: '0.9rem', md: '0.95rem' },
                          lineHeight: 1.4,
                          fontWeight: 600,
                          color: '#1976d2'
                        }}
                      >
                        {translateOscarCategory(award.categoryName || award.category)}
                      </Typography>
                      {award.personName && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: { xs: '0.8rem', md: '0.85rem' },
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            mt: 0.5
                          }}
                        >
                          {award.personName}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              </Collapse>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowAllNominations(!showAllNominations)}
                  sx={{ 
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      borderColor: '#1565c0',
                      color: '#1565c0',
                      bgcolor: 'rgba(25, 118, 210, 0.04)'
                    }
                  }}
                >
                  {showAllNominations ? 'Ver menos...' : `Ver mais...`}
                </Button>
              </Box>
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OscarRecognition;
