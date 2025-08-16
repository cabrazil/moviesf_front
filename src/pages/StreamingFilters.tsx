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
  useTheme
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
  


  // Mapeamento das plataformas principais com seus logos (agora dinâmicos)
  const [mainSubscriptionPlatforms, setMainSubscriptionPlatforms] = useState<Array<{name: string, logo: string}>>([
    { name: 'Prime Video', logo: '/platforms/amazonprimevideo.avif' },
    { name: 'Netflix', logo: '/platforms/netflix.avif' },
    { name: 'Disney+', logo: '/platforms/disneyplus.avif' },
    { name: 'HBO Max', logo: '/platforms/max.avif' },
    { name: 'Globoplay', logo: '/platforms/globoplay.avif' },
    { name: 'Apple TV+', logo: '/platforms/itunes.avif' },
    { name: 'Claro Video', logo: '/platforms/clarovideo.avif' }
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

  // Plataformas de aluguel/compra com logos
  const [rentalPurchasePlatforms, setRentalPurchasePlatforms] = useState<Array<{name: string, logo: string}>>([
    { name: 'Google Play Filmes (Aluguel/Compra)', logo: '/platforms/play.avif' },
    { name: 'Microsoft Store (Aluguel/Compra)', logo: '/platforms/microsoft-store.jpg' },
    { name: 'YouTube (Aluguel/Compra/Gratuito)', logo: '/platforms/logo-youtube.png' },
    { name: 'Prime Video (Aluguel/Compra)', logo: '/platforms/amazonprimevideo.avif' }
  ]);

  // Carregar logos dinâmicos do backend
  useEffect(() => {
    const loadPlatformLogos = async () => {
      try {
        const platformsData = await getStreamingPlatforms();
        
        // Atualizar logos das plataformas principais
        const updatedMainPlatforms = mainSubscriptionPlatforms.map(platform => {
          const dbPlatform = platformsData.find(p => p.name === platform.name);
          return {
            name: platform.name,
            logo: dbPlatform ? getPlatformLogoUrlMedium(dbPlatform.logoPath) : platform.logo
          };
        });
        setMainSubscriptionPlatforms(updatedMainPlatforms);

        // Atualizar logos das plataformas de aluguel/compra
        const updatedRentalPlatforms = rentalPurchasePlatforms.map(platform => {
          const dbPlatform = platformsData.find(p => p.name === platform.name);
          return {
            name: platform.name,
            logo: dbPlatform ? getPlatformLogoUrlMedium(dbPlatform.logoPath) : platform.logo
          };
        });
        setRentalPurchasePlatforms(updatedRentalPlatforms);
        
      } catch (err) {
        console.error('Erro ao carregar logos das plataformas:', err);
        // Em caso de erro, mantém os logos estáticos
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
        streamingFilters: filters 
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
  
  // Debug: verificar estrutura dos dados
  console.log('🔍 StreamingFilters - location.state:', location.state);
  console.log('🔍 StreamingFilters - movieSuggestions:', movieSuggestions);
  console.log('🔍 StreamingFilters - movieSuggestions.length:', movieSuggestions.length);
  if (movieSuggestions.length > 0) {
    console.log('🔍 StreamingFilters - primeiro movieSuggestion:', movieSuggestions[0]);
    console.log('🔍 StreamingFilters - journeyOptionFlow:', movieSuggestions[0].journeyOptionFlow);
  }
  
  const selectedOptionText = location.state?.selectedOptionText || 
    (movieSuggestions.length > 0 && movieSuggestions[0].journeyOptionFlow 
      ? movieSuggestions[0].journeyOptionFlow.text 
      : null);
  
  console.log('🔍 StreamingFilters - selectedOptionText:', selectedOptionText);



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
              fontWeight: 'normal',
              opacity: 0.8,
              fontStyle: 'italic'
            }}
          >
            "{selectedOptionText}"
          </Typography>
        )}
        
        {/* Debug temporário - remover depois */}
        {movieSuggestions.length > 0 && !selectedOptionText && (
          <Typography 
            variant="body2"
            align="center"
            sx={{ 
              color: 'orange',
              fontSize: '0.8rem',
              fontStyle: 'italic'
            }}
          >
            Debug: {movieSuggestions.length} sugestões encontradas
          </Typography>
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
              {mainSubscriptionPlatforms.map((platform) => (
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
              ))}
              
              {/* Outras plataformas */}
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
                {rentalPurchasePlatforms.map((platform) => (
                  <Grid item xs={12} sm={6} md={3} key={platform.name}>
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
                ))}
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
