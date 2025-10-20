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
  Checkbox
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getPlatformLogoUrlMedium } from '../services/streaming.service';

interface StreamingFiltersProps {}

export interface StreamingFilters {
  subscriptionPlatforms: string[];
}

const StreamingFiltersOption2: React.FC<StreamingFiltersProps> = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSubscriptionPlatforms, setSelectedSubscriptionPlatforms] = useState<string[]>([]);
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);
  const [mainSubscriptionPlatforms, setMainSubscriptionPlatforms] = useState<Array<{name: string, logo: string}>>([
    { name: 'Prime Video', logo: '' },
    { name: 'Netflix', logo: '' },
    { name: 'Disney+', logo: '' },
    { name: 'HBO Max', logo: '' },
    { name: 'Globoplay', logo: '' },
    { name: 'Apple TV+', logo: '' },
    { name: 'Claro Video', logo: '' }
  ]);

  const otherSubscriptionPlatforms = [
    'Paramount+',
    'Star+',
    'MUBI',
    'Looke',
    'Telecine Play',
    'NOW',
    'YouTube Premium'
  ];

  useEffect(() => {
    const loadLogos = async () => {
      try {
        const updatedPlatforms = await Promise.all(
          mainSubscriptionPlatforms.map(async (platform) => {
            const logoUrl = await getPlatformLogoUrlMedium(platform.name);
            return { ...platform, logo: logoUrl };
          })
        );
        setMainSubscriptionPlatforms(updatedPlatforms);
      } catch (error) {
        console.error('Erro ao carregar logos:', error);
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
          variant="h4"
          component="h1" 
          sx={{ 
            mb: 2,
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Escolha suas plataformas
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

      {/* Grid de Plataformas */}
      {isLoadingLogos ? (
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {mainSubscriptionPlatforms.map((platform) => (
            <Grid item xs={6} sm={4} md={3} key={platform.name}>
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
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    <img 
                      src={platform.logo} 
                      alt={platform.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: selectedSubscriptionPlatforms.includes(platform.name) ? 600 : 400,
                      color: selectedSubscriptionPlatforms.includes(platform.name) 
                        ? theme.palette.primary.main 
                        : 'text.primary',
                      fontSize: '0.9rem'
                    }}
                  >
                    {platform.name}
                  </Typography>

                  <Checkbox
                    checked={selectedSubscriptionPlatforms.includes(platform.name)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
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

      {/* Outras plataformas */}
      {otherSubscriptionPlatforms.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              mb: 2
            }}
          >
            +{otherSubscriptionPlatforms.length} outras plataformas disponíveis
          </Typography>
        </Box>
      )}

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
          variant="contained"
          onClick={handleContinue}
          disabled={selectedSubscriptionPlatforms.length === 0}
          sx={{ 
            minWidth: '120px',
            borderRadius: 2,
            px: 3
          }}
        >
          Continuar ({selectedSubscriptionPlatforms.length})
        </Button>
      </Box>
    </Container>
  );
};

export default StreamingFiltersOption2;
