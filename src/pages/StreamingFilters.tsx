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
  
  // Plataformas dinâmicas (carregadas da API)
  const [mainSubscriptionPlatforms, setMainSubscriptionPlatforms] = useState<Array<{name: string, logo: string}>>([]);
  const [otherSubscriptionPlatforms, setOtherSubscriptionPlatforms] = useState<Array<{name: string, logo: string}>>([]);

  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        console.log('🔄 Carregando plataformas da API...');
        const platforms = await getStreamingPlatforms();
        console.log(`✅ ${platforms.length} plataformas carregadas`);
        
        // Filtrar apenas plataformas de assinatura (SUBSCRIPTION_PRIMARY e HYBRID)
        const subscriptionPlatforms = platforms.filter(p => 
          p.category === 'SUBSCRIPTION_PRIMARY' || p.category === 'HYBRID'
        );
        
        // Separar por showFilter
        const priorityPlatforms = subscriptionPlatforms.filter(p => p.showFilter === 'PRIORITY');
        const secondaryPlatforms = subscriptionPlatforms.filter(p => p.showFilter === 'SECONDARY');
        
        console.log(`📊 PRIORITY: ${priorityPlatforms.length}, SECONDARY: ${secondaryPlatforms.length}`);
        
        // Mapear plataformas principais com logos
        const mainPlatforms = priorityPlatforms.map(platform => {
          let logo = '';
          try {
            if (platform.logoPath) {
              logo = getPlatformLogoUrlMedium(platform.logoPath, platform.name);
            } else {
              // Fallback para logo local
              logo = `/platforms/logo-${platform.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
            }
          } catch (error) {
            console.error(`Erro ao processar logo de ${platform.name}:`, error);
            logo = `/platforms/logo-${platform.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
          }
          return { name: platform.name, logo };
        });
        
        // Mapear plataformas secundárias com logos
        const otherPlatforms = secondaryPlatforms.map(platform => {
          let logo = '';
          try {
            if (platform.logoPath) {
              logo = getPlatformLogoUrlMedium(platform.logoPath, platform.name);
            } else {
              logo = `/platforms/logo-${platform.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
            }
          } catch (error) {
            console.error(`Erro ao processar logo de ${platform.name}:`, error);
            logo = `/platforms/logo-${platform.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
          }
          return { name: platform.name, logo };
        });
        
        setMainSubscriptionPlatforms(mainPlatforms);
        setOtherSubscriptionPlatforms(otherPlatforms);
        
        console.log('✅ Plataformas principais:', mainPlatforms.map(p => p.name).join(', '));
        console.log('✅ Outras plataformas:', otherPlatforms.map(p => p.name).join(', '));
        
      } catch (error) {
        console.error('❌ Erro ao carregar plataformas:', error);
        // Em caso de erro, deixar arrays vazios
        setMainSubscriptionPlatforms([]);
        setOtherSubscriptionPlatforms([]);
      } finally {
        setIsLoadingLogos(false);
      }
    };

    loadPlatforms();
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
              {otherSubscriptionPlatforms.map((platform) => (
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
                        transform: 'translateY(-1px)',
                        boxShadow: 2,
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    <CardContent sx={{ p: 1, textAlign: 'center', position: 'relative', minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Box
                        component="img"
                        src={platform.logo}
                        alt={platform.name}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '40px',
                          objectFit: 'contain',
                          mb: 0.5
                        }}
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: selectedSubscriptionPlatforms.includes(platform.name) ? 600 : 400,
                          color: selectedSubscriptionPlatforms.includes(platform.name) 
                            ? theme.palette.primary.main 
                            : 'text.primary',
                          fontSize: '0.75rem',
                          display: 'none'
                        }}
                      >
                        {platform.name}
                      </Typography>

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
          {selectedSubscriptionPlatforms.length === 0 
            ? 'Ver Sugestões' 
            : `Ver Sugestões (${selectedSubscriptionPlatforms.length} ${selectedSubscriptionPlatforms.length === 1 ? 'filtro' : 'filtros'})`
          }
        </Button>
      </Box>
    </Container>
  );
};

export default StreamingFilters;