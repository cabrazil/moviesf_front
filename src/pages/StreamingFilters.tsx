import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Chip,
  useTheme,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStreamingPlatforms, getPlatformLogoUrlMedium } from '../services/streaming.service';

interface StreamingFiltersProps {
  // Removido onFiltersChange pois não está sendo usado
}

export interface StreamingFilters {
  subscriptionPlatforms: string[];
  rentalPurchasePlatforms: string[];
  includeRentalPurchase: boolean;
}

const StreamingFilters: React.FC<StreamingFiltersProps> = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para filtros
  const [includeRentalPurchase, setIncludeRentalPurchase] = useState(false);
  const [selectedSubscriptionPlatforms, setSelectedSubscriptionPlatforms] = useState<string[]>([]);
  const [selectedRentalPurchasePlatforms, setSelectedRentalPurchasePlatforms] = useState<string[]>([]);
  
  // Estado de loading para evitar sobreposição de logos
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);

  // Mapeamento das plataformas principais (logos serão carregados dinamicamente)
  const [mainSubscriptionPlatforms, setMainSubscriptionPlatforms] = useState<Array<{name: string, logo: string}>>([
    { name: 'Prime Video', logo: '' },
    { name: 'Netflix', logo: '' },
    { name: 'Disney+', logo: '' },
    { name: 'HBO Max', logo: '' },
    { name: 'Globoplay', logo: '' },
    { name: 'Apple TV+', logo: '' },
    { name: 'Claro Video', logo: '' }
  ]);

  // Outras plataformas (serão agrupadas)
  const otherSubscriptionPlatforms = [
    'Paramount+',
    'Telecine',
    'Looke',
    'MUBI',
    'Reserva Imovision',
    'MGM+',
    'Claro tv+',
    'Filmelier+',
    'Belas Artes à La Carte',
    'GOSPEL PLAY',
    'FilmBox+'
  ];

  // Plataformas de aluguel/compra (logos serão carregados dinamicamente)
  const [rentalPurchasePlatforms, setRentalPurchasePlatforms] = useState<Array<{name: string, logo: string}>>([
    { name: 'Google Play', logo: '' },
    { name: 'YouTube (Gratuito)', logo: '' },
    { name: 'Prime Video', logo: '' }
  ]);

  // Função para preload de imagens
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  };

  // Função para preload de múltiplas imagens
  const preloadImages = async (platforms: Array<{name: string, logo: string}>) => {
    const imagePromises = platforms.map(platform => preloadImage(platform.logo));
    try {
      await Promise.all(imagePromises);
      return true;
    } catch (error) {
      console.warn('⚠️ StreamingFilters - Algumas imagens falharam ao carregar:', error);
      return false;
    }
  };

  // Função para buscar plataforma de forma mais flexível
  const findPlatformByName = (platformName: string, platformsData: any[]) => {
    // Busca exata primeiro
    let platform = platformsData.find(p => p.name === platformName);
    
    if (platform) {
      return platform;
    }
    
    // Busca por nomes simplificados (removendo sufixos como "(Aluguel/Compra)")
    const simplifiedName = platformName.replace(/\s*\([^)]*\)/g, '').trim();
    platform = platformsData.find(p => p.name === simplifiedName);
    
    if (platform) {
      return platform;
    }
    
    // Busca por nomes que contenham palavras-chave
    const keywords = simplifiedName.split(' ').filter(word => word.length > 2);
    platform = platformsData.find(p => 
      keywords.some(keyword => 
        p.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    return platform;
  };

  // Placeholder SVG para imagens que não carregam
  const createPlaceholderSVG = (platformName: string) => {
    const initials = platformName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="80" fill="#f0f0f0" rx="8"/>
        <text x="40" y="45" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#666">${initials}</text>
        <text x="40" y="60" font-family="Arial, sans-serif" font-size="8" text-anchor="middle" fill="#999">${platformName.split(' ')[0]}</text>
      </svg>
    `)}`;
  };

  // Carregar logos dinâmicos do backend
  useEffect(() => {
    const loadPlatformLogos = async () => {
      setIsLoadingLogos(true);
      try {
        const platformsData = await getStreamingPlatforms();
        
        // Atualizar logos das plataformas principais
        const updatedMainPlatforms = mainSubscriptionPlatforms.map(platform => {
          const dbPlatform = findPlatformByName(platform.name, platformsData);
          if (!dbPlatform || !dbPlatform.logoPath) {
            throw new Error(`Logo não encontrado para plataforma: ${platform.name}`);
          }
          const logoUrl = getPlatformLogoUrlMedium(dbPlatform.logoPath);
          return {
            name: platform.name,
            logo: logoUrl
          };
        });
        setMainSubscriptionPlatforms(updatedMainPlatforms);

        // Atualizar logos das plataformas de aluguel/compra
        const updatedRentalPlatforms = rentalPurchasePlatforms.map(platform => {
          const dbPlatform = findPlatformByName(platform.name, platformsData);
          if (!dbPlatform || !dbPlatform.logoPath) {
            console.warn(`⚠️ StreamingFilters - Logo não encontrado para plataforma de aluguel: ${platform.name}`);
            // Em vez de quebrar, retorna um placeholder
            return {
              name: platform.name,
              logo: createPlaceholderSVG(platform.name) // Use o placeholder SVG
            };
          }
          const logoUrl = getPlatformLogoUrlMedium(dbPlatform.logoPath);
          return {
            name: platform.name,
            logo: logoUrl
          };
        });
        setRentalPurchasePlatforms(updatedRentalPlatforms);

        // Preload das imagens para evitar flash
        const preloadResult = await preloadImages([...updatedMainPlatforms, ...updatedRentalPlatforms]);
        if (!preloadResult) {
          console.warn('⚠️ StreamingFilters - Algumas imagens falharam no preload, mas continuando...');
        }
        
      } catch (err) {
        console.error('❌ StreamingFilters - Erro ao carregar logos das plataformas:', err);
        // Em caso de erro, mantém o loading state para mostrar skeleton
      } finally {
        setIsLoadingLogos(false);
      }
    };

    loadPlatformLogos();
  }, []);

  const handleSubscriptionPlatformChange = (platformName: string) => {
    setSelectedSubscriptionPlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleRentalPurchasePlatformChange = (platformName: string) => {
    setSelectedRentalPurchasePlatforms(prev => 
      prev.includes(platformName)
        ? prev.filter(p => p !== platformName)
        : [...prev, platformName]
    );
  };

  const handleIncludeRentalPurchaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeRentalPurchase(event.target.checked);
    if (!event.target.checked) {
      setSelectedRentalPurchasePlatforms([]);
    }
  };

  const handleShowSuggestions = () => {
    // Processar plataformas selecionadas
    let processedSubscriptionPlatforms = [...selectedSubscriptionPlatforms];
    
    // Se "Outras Plataformas" estiver selecionada, usar lógica especial
    if (selectedSubscriptionPlatforms.includes('Outras Plataformas')) {
      // Remover "Outras Plataformas" da lista
      processedSubscriptionPlatforms = processedSubscriptionPlatforms.filter(p => p !== 'Outras Plataformas');
      
      // Adicionar as outras plataformas conhecidas
      processedSubscriptionPlatforms = [...processedSubscriptionPlatforms, ...otherSubscriptionPlatforms];
      
      // Marcar que "Outras Plataformas" foi selecionada para lógica especial no filtro
      processedSubscriptionPlatforms.push('__OTHER_PLATFORMS__');
    }

    const filters: StreamingFilters = {
      subscriptionPlatforms: processedSubscriptionPlatforms,
      rentalPurchasePlatforms: selectedRentalPurchasePlatforms,
      includeRentalPurchase: includeRentalPurchase
    };

    // Passar filtros para a próxima tela
    navigate('/suggestions', { 
      state: { 
        ...location.state,
        streamingFilters: filters,
        selectedOptionText: selectedOptionText // Garantir que o texto da opção seja passado
      } 
    });
  };

  const handleBack = () => {
    // Verificar se viemos da tela de sugestões sem filmes (para evitar loop)
    // Se há journeyContext, voltar para a jornada personalizada
    const journeyContext = location.state?.journeyContext;
    
    if (journeyContext) {
      // Voltar para /intro com o contexto da jornada para restaurar o estado
      navigate('/intro', { 
        state: { 
          restoreJourney: true,
          selectedSentiment: journeyContext.selectedSentiment,
          selectedIntention: journeyContext.selectedIntention,
          journeyType: journeyContext.journeyType
        } 
      });
    } else {
      // Fallback para navegação padrão
      navigate(-1);
    }
  };

  // Extrair o texto da opção selecionada na jornada anterior
  const movieSuggestions = location.state?.movieSuggestions || [];
  
  const selectedOptionText = location.state?.selectedOptionText || 
    (movieSuggestions.length > 0 && movieSuggestions[0].journeyOptionFlow 
      ? movieSuggestions[0].journeyOptionFlow.text 
      : null);
  


  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        {/* Header */}
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
        
        {/* Texto da opção selecionada */}
        {selectedOptionText && (
          <Typography 
            variant="h6"
            align="center"
            sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'bold',
              opacity: 0.8,
              fontStyle: 'italic'
            }}
          >
            "{selectedOptionText}"
          </Typography>
        )}
        
        {/* Indicador de loading */}
        {isLoadingLogos && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: "text.secondary",
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}
            >
              Carregando logos das plataformas...
            </Typography>
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Plataformas de Assinatura */}
        <Grid item xs={12}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2.5,
              backgroundColor: theme.palette.background.paper,
              border: `2px solid ${theme.palette.primary.main}`,
              borderRadius: 2
            }}
          >
            <Typography 
              variant="h6" 
              component="h2" 
              sx={{ 
                mb: 2,
                color: "text.secondary",
                fontSize: { xs: '1.0rem', sm: '1.2rem', md: '1.25rem' },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                fontWeight: { xs: 'bold', sm: 'normal', md: 'normal' },
                textAlign: 'center'
              }}
            >
              🎬 Plataformas de Assinatura
            </Typography>

            <Grid container spacing={1.5}>
              {/* Plataformas principais */}
              {isLoadingLogos ? (
                <Grid item xs={12} sm={6} md={3}>
                  <Skeleton variant="rectangular" height={60} />
                </Grid>
              ) : (
                mainSubscriptionPlatforms.map((platform) => (
                  <Grid item xs={12} sm={6} md={3} key={platform.name}>
                    <Chip
                      icon={
                        <img 
                          src={platform.logo} 
                          alt={platform.name}
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'contain',
                            filter: 'none',
                            zIndex: 1,
                            position: 'relative'
                          }}
                        />
                      }
                      onClick={() => handleSubscriptionPlatformChange(platform.name)}
                      clickable
                      sx={{
                        width: '100%',
                        height: 'auto',
                        minHeight: '60px',
                        padding: '4px',
                        backgroundColor: selectedSubscriptionPlatforms.includes(platform.name) 
                          ? `${theme.palette.primary.main}15`
                          : 'transparent',
                        border: selectedSubscriptionPlatforms.includes(platform.name) 
                          ? `3px solid ${theme.palette.primary.main}`
                          : `2px solid ${theme.palette.primary.main}`,
                        borderRadius: '12px',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: selectedSubscriptionPlatforms.includes(platform.name)
                            ? `${theme.palette.primary.main}25`
                            : `${theme.palette.primary.main}10`,
                          transform: 'translateY(-2px)',
                          boxShadow: selectedSubscriptionPlatforms.includes(platform.name) 
                            ? `0 4px 12px ${theme.palette.primary.main}40`
                            : `0 4px 8px ${theme.palette.primary.main}20`,
                          borderColor: theme.palette.primary.dark
                        },
                        '&:active': {
                          transform: 'translateY(-1px)',
                          boxShadow: `0 2px 4px ${theme.palette.primary.main}30`
                        },
                        '& .MuiChip-icon': {
                          margin: '0',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        },
                        // Indicador de seleção (canto superior direito)
                        '&::after': selectedSubscriptionPlatforms.includes(platform.name) ? {
                          content: '""',
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '12px',
                          height: '12px',
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '50%',
                          border: `2px solid ${theme.palette.background.paper}`,
                          zIndex: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        } : {}
                      }}
                    />
                  </Grid>
                ))
              )}
              
              {/* Outras plataformas */}
              {isLoadingLogos ? (
                <Grid item xs={12} sm={6} md={3}>
                  <Skeleton variant="rectangular" height={60} />
                </Grid>
              ) : (
                <Grid item xs={12} sm={6} md={3}>
                  <Chip
                    label="Outras Plataformas"
                    onClick={() => handleSubscriptionPlatformChange('Outras Plataformas')}
                    clickable
                    sx={{
                      width: '100%',
                      height: 'auto',
                      minHeight: '60px',
                      padding: '4px',
                      fontSize: { xs: '0.8rem', sm: '0.85rem' },
                      fontWeight: 500,
                      backgroundColor: selectedSubscriptionPlatforms.includes('Outras Plataformas') 
                        ? `${theme.palette.primary.main}15`
                        : 'transparent',
                      color: selectedSubscriptionPlatforms.includes('Outras Plataformas')
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                      border: selectedSubscriptionPlatforms.includes('Outras Plataformas')
                        ? `3px solid ${theme.palette.primary.main}`
                        : `2px solid ${theme.palette.primary.main}`,
                      borderRadius: '12px',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: selectedSubscriptionPlatforms.includes('Outras Plataformas')
                          ? `${theme.palette.primary.main}25`
                          : `${theme.palette.primary.main}10`,
                        transform: 'translateY(-2px)',
                        boxShadow: selectedSubscriptionPlatforms.includes('Outras Plataformas')
                          ? `0 4px 12px ${theme.palette.primary.main}40`
                          : `0 4px 8px ${theme.palette.primary.main}20`,
                        borderColor: theme.palette.primary.dark
                      },
                      '&:active': {
                        transform: 'translateY(-1px)',
                        boxShadow: `0 2px 4px ${theme.palette.primary.main}30`
                      },
                      // Indicador de seleção (canto superior direito)
                      '&::after': selectedSubscriptionPlatforms.includes('Outras Plataformas') ? {
                        content: '""',
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '12px',
                        height: '12px',
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '50%',
                        border: `2px solid ${theme.palette.background.paper}`,
                        zIndex: 2,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      } : {}
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        {/* Checkbox para incluir aluguel/compra */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', my: 1.0 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeRentalPurchase}
                  onChange={handleIncludeRentalPurchaseChange}
                  sx={{
                    color: theme.palette.text.secondary,
                    '&.Mui-checked': {
                      color: theme.palette.text.secondary,
                    },
                  }}
                />
              }
              label={
                <Typography 
                  variant="h6"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontWeight: 'normal',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Incluir opções de aluguel e compra
                </Typography>
              }
            />
          </Box>
        </Grid>

        {/* Plataformas de Aluguel/Compra */}
        {includeRentalPurchase && (
          <Grid item xs={12}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2.5,
                backgroundColor: theme.palette.background.paper,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: 2
              }}
            >
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  mb: 2,
                  color: "text.secondary",
                  fontSize: { xs: '1.0rem', sm: '1.2rem', md: '1.25rem' },
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                  fontWeight: { xs: 'bold', sm: 'normal', md: 'normal' },
                  textAlign: 'center'
                }}
              >
                🛒 Lojas de Filmes (Aluguel/Compra)
              </Typography>

              <Grid container spacing={1.5}>
                {isLoadingLogos ? (
                  <Grid item xs={12} sm={6} md={4}>
                    <Skeleton variant="rectangular" height={60} />
                  </Grid>
                ) : (
                  rentalPurchasePlatforms.map((platform) => (
                    <Grid item xs={12} sm={6} md={4} key={platform.name}>
                      <Chip
                        icon={
                          <img 
                            src={platform.logo} 
                            alt={platform.name}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'contain',
                              filter: 'none',
                              zIndex: 1,
                              position: 'relative'
                            }}
                          />
                        }
                        onClick={() => handleRentalPurchasePlatformChange(platform.name)}
                        clickable
                        sx={{
                          width: '100%',
                          height: 'auto',
                          minHeight: '60px',
                          padding: '4px',
                          backgroundColor: selectedRentalPurchasePlatforms.includes(platform.name) 
                            ? `${theme.palette.primary.main}15`
                            : 'transparent',
                          border: selectedRentalPurchasePlatforms.includes(platform.name) 
                            ? `3px solid ${theme.palette.primary.main}`
                            : `2px solid ${theme.palette.primary.main}`,
                          borderRadius: '12px',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: selectedRentalPurchasePlatforms.includes(platform.name)
                              ? `${theme.palette.primary.main}25`
                              : `${theme.palette.primary.main}10`,
                            transform: 'translateY(-2px)',
                            boxShadow: selectedRentalPurchasePlatforms.includes(platform.name) 
                              ? `0 4px 12px ${theme.palette.primary.main}40`
                              : `0 4px 8px ${theme.palette.primary.main}20`,
                            borderColor: theme.palette.primary.dark
                          },
                          '&:active': {
                            transform: 'translateY(-1px)',
                            boxShadow: `0 2px 4px ${theme.palette.primary.main}30`
                          },
                          '& .MuiChip-icon': {
                            margin: '0',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s ease'
                          },
                          // Indicador de seleção (canto superior direito)
                          '&::after': selectedRentalPurchasePlatforms.includes(platform.name) ? {
                            content: '""',
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            width: '12px',
                            height: '12px',
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '50%',
                            border: `2px solid ${theme.palette.background.paper}`,
                            zIndex: 2,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          } : {}
                        }}
                      />
                    </Grid>
                  ))
                )}
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Botões de Navegação */}
      <Box sx={{ 
        mt: 4, 
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{ px: 4, py: 1.5 }}
        >
          Voltar
        </Button>

        <Button
          variant="outlined"
          onClick={handleShowSuggestions}
          disabled={false} // Permitir prosseguir mesmo sem filtros
          sx={{ px: 4, py: 1.5 }}
        >
          Ver Sugestões
        </Button>
      </Box>
    </Container>
  );
};

export default StreamingFilters;
