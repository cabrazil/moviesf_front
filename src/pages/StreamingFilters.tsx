import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  useTheme,
  Skeleton,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  IconButton
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStreamingPlatforms, getPlatformLogoUrlMedium } from '../services/streaming.service';

interface StreamingFiltersProps {}

export interface StreamingFilters {
  subscriptionPlatforms: string[];
}

const StreamingFilters: React.FC<StreamingFiltersProps> = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSubscriptionPlatforms, setSelectedSubscriptionPlatforms] = useState<string[]>([]);
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [showOtherPlatforms, setShowOtherPlatforms] = useState(false);
  
  // 9 plataformas principais (baseado na análise SQL)
  const [mainSubscriptionPlatforms, setMainSubscriptionPlatforms] = useState<Array<{name: string, logo: string}>>([
    { name: 'Claro Video', logo: '' },
    { name: 'HBO Max', logo: '' },
    { name: 'Prime Video', logo: '' },
    { name: 'Netflix', logo: '' },
    { name: 'Disney+', logo: '' },
    { name: 'Telecine', logo: '' },
    { name: 'Globoplay', logo: '' },
    { name: 'Paramount+', logo: '' },
    { name: 'Apple TV+', logo: '' }
  ]);

  // Outras plataformas (colapsável)
  const otherSubscriptionPlatforms = [
    'MUBI',
    'Oldflix',
    'Looke',
    'MGM+',
    'Filmelier+',
    'FilmBox+',
    'Reserva Imovision'
  ];

  useEffect(() => {
    const loadLogos = async () => {
      try {
        const platforms = await getStreamingPlatforms();
        const updatedPlatforms = await Promise.all(
          mainSubscriptionPlatforms.map(async (platform) => {
            try {
              // Buscar a plataforma na lista retornada pela API
              const foundPlatform = platforms.find(p => 
                p.name.toLowerCase() === platform.name.toLowerCase()
              );
              
              if (foundPlatform && foundPlatform.logoPath) {
                const logoUrl = getPlatformLogoUrlMedium(foundPlatform.logoPath);
                return { ...platform, logo: logoUrl };
              } else {
                // Fallback para logos locais ou placeholder
                return { ...platform, logo: `/platforms/logo-${platform.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png` };
              }
            } catch (error) {
              console.error(`Erro ao carregar logo para ${platform.name}:`, error);
              // Fallback para placeholder
              return { ...platform, logo: `/platforms/logo-${platform.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png` };
            }
          })
        );
        setMainSubscriptionPlatforms(updatedPlatforms);
      } catch (error) {
        console.error('Erro ao carregar logos:', error);
        // Em caso de erro, usar logos locais como fallback
        const fallbackPlatforms = mainSubscriptionPlatforms.map(platform => ({
          ...platform,
          logo: `/platforms/logo-${platform.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`
        }));
        setMainSubscriptionPlatforms(fallbackPlatforms);
      } finally {
        setIsLoadingLogos(false);
      }
    };

    loadLogos();
  }, []);

  const handleSubscriptionPlatformChange = (platformName: string) => {
    setSelectedSubscriptionPlatforms(prev => 
      prev.includes(platformName) 
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleContinue = () => {
    const filters: StreamingFilters = {
      subscriptionPlatforms: selectedSubscriptionPlatforms
    };

    const selectedOptionText = location.state?.selectedOptionText || 
      (location.state?.movieSuggestions?.length > 0 && location.state.movieSuggestions[0].journeyOptionFlow 
        ? location.state.movieSuggestions[0].journeyOptionFlow.text 
        : null);

    navigate('/suggestions', { 
      state: { 
        ...location.state,
        streamingFilters: filters,
        selectedOptionText: selectedOptionText
      } 
    });
  };

  const handleBack = () => {
    const journeyContext = location.state?.journeyContext;
    
    if (journeyContext) {
      navigate('/intro', { 
        state: { 
          restoreJourney: true,
          selectedSentiment: journeyContext.selectedSentiment,
          selectedIntention: journeyContext.selectedIntention,
          journeyType: journeyContext.journeyType
        } 
      });
    } else {
      navigate(-1);
    }
  };

  const selectedOptionText = location.state?.selectedOptionText || 
    (location.state?.movieSuggestions?.length > 0 && location.state.movieSuggestions[0].journeyOptionFlow 
      ? location.state.movieSuggestions[0].journeyOptionFlow.text 
      : null);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h3"
          component="h2" 
          align="center"
          sx={{ 
            mb: 2,
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' },
            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
            fontWeight: { xs: 'bold', sm: 'normal', md: 'normal' }
          }}
        >
          Ótima escolha! Agora, onde você gostaria de assistir a este tipo de filme?
        </Typography>
        
        {selectedOptionText && (
          <Typography 
            variant="body1"
            sx={{ 
              color: 'text.secondary',
              fontSize: '1.1rem',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            {selectedOptionText}
          </Typography>
        )}
      </Box>

      {/* Grid de Plataformas Principais */}
      <Box sx={{ mb: 3 }}>

        {isLoadingLogos ? (
          <Grid container spacing={1.5}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Grid item xs={4} sm={3} md={2.4} key={i}>
                <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={1.5}>
            {mainSubscriptionPlatforms.map((platform) => (
              <Grid item xs={4} sm={3} md={2.4} key={platform.name}>
                <Card
                  onClick={() => handleSubscriptionPlatformChange(platform.name)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: selectedSubscriptionPlatforms.includes(platform.name) 
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    backgroundColor: selectedSubscriptionPlatforms.includes(platform.name) 
                      ? `${theme.palette.primary.main}08`
                      : 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 3,
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <CardContent sx={{ p: 1, textAlign: 'center', position: 'relative', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img 
                        src={platform.logo} 
                        alt={platform.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'contain',
                          borderRadius: '6px'
                        }}
                        onError={(e) => {
                          // Fallback para placeholder quando a imagem falha
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div style="
                                width: 50px; 
                                height: 50px; 
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                border-radius: 6px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: bold;
                                font-size: 10px;
                                text-align: center;
                              ">
                                ${platform.name.substring(0, 3).toUpperCase()}
                              </div>
                            `;
                          }
                        }}
                      />
                    </Box>

                    <Checkbox
                      checked={selectedSubscriptionPlatforms.includes(platform.name)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        p: 0.5,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main
                        }
                      }}
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Seção Outras Plataformas (Colapsável) */}
      <Box sx={{ mb: 3 }}>
        <Box 
          onClick={() => setShowOtherPlatforms(!showOtherPlatforms)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            p: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 500
            }}
          >
            Outras plataformas ({otherSubscriptionPlatforms.length})
          </Typography>
          <IconButton size="small" sx={{ ml: 1 }}>
            {showOtherPlatforms ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        <Collapse in={showOtherPlatforms}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={1}>
              {otherSubscriptionPlatforms.map((platformName) => (
                <Grid item xs={4} sm={3} md={2.4} key={platformName}>
                  <Card
                    onClick={() => handleSubscriptionPlatformChange(platformName)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: selectedSubscriptionPlatforms.includes(platformName) 
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                      backgroundColor: selectedSubscriptionPlatforms.includes(platformName) 
                        ? `${theme.palette.primary.main}08`
                        : 'background.paper',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 2,
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1, textAlign: 'center', position: 'relative', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: selectedSubscriptionPlatforms.includes(platformName) ? 600 : 400,
                          color: selectedSubscriptionPlatforms.includes(platformName) 
                            ? theme.palette.primary.main 
                            : 'text.primary',
                          fontSize: '0.9rem'
                        }}
                      >
                        {platformName}
                      </Typography>

                      <Checkbox
                        checked={selectedSubscriptionPlatforms.includes(platformName)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          p: 0.5,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main
                          }
                        }}
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Collapse>
      </Box>

      {/* Botões de Ação */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 4,
        gap: 2
      }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{ 
            minWidth: '120px',
            borderRadius: 2
          }}
        >
          Voltar
        </Button>
        
        <Button
          variant="outlined"
          onClick={handleContinue}
          sx={{ 
            minWidth: '120px',
            borderRadius: 2,
            px: 3
          }}
        >
          Ver Sugestões ({selectedSubscriptionPlatforms.length})
        </Button>
      </Box>
    </Container>
  );
};

export default StreamingFilters;