import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface StreamingFiltersProps {
  onFiltersChange?: (filters: StreamingFilters) => void;
}

export interface StreamingFilters {
  subscriptionPlatforms: string[];
  rentalPurchasePlatforms: string[];
  includeRentalPurchase: boolean;
}

const StreamingFilters: React.FC<StreamingFiltersProps> = ({ onFiltersChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para filtros
  const [includeRentalPurchase, setIncludeRentalPurchase] = useState(false);
  const [selectedSubscriptionPlatforms, setSelectedSubscriptionPlatforms] = useState<string[]>([]);
  const [selectedRentalPurchasePlatforms, setSelectedRentalPurchasePlatforms] = useState<string[]>([]);

  // Plataformas de assinatura
  const subscriptionPlatforms = [
    'Netflix',
    'Prime Video (Assinatura)',
    'HBO Max',
    'Disney+',
    'Paramount+',
    'Apple TV+',
    'Globoplay',
    'Claro Video',
    'Telecine',
    'Looke',
    'MUBI',
    'Reserva Imovision',
    'MGM+',
    'Claro tv+',
    'Outras plataformas'
  ];

  // Plataformas de aluguel/compra
  const rentalPurchasePlatforms = [
    'Google Play Filmes (Aluguel/Compra)',
    'Microsoft Store (Aluguel/Compra)',
    'YouTube (Aluguel/Compra/Gratuito)',
    'Prime Video (Aluguel/Compra)'
  ];

  const handleSubscriptionPlatformChange = (platform: string) => {
    setSelectedSubscriptionPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleRentalPurchasePlatformChange = (platform: string) => {
    setSelectedRentalPurchasePlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleIncludeRentalPurchaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeRentalPurchase(event.target.checked);
    if (!event.target.checked) {
      setSelectedRentalPurchasePlatforms([]);
    }
  };

  const handleShowSuggestions = () => {
    const filters: StreamingFilters = {
      subscriptionPlatforms: selectedSubscriptionPlatforms,
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
    navigate(-1);
  };

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

            <Grid container spacing={1.0}>
              {subscriptionPlatforms.map((platform) => (
                <Grid item xs={12} sm={6} md={2.4} key={platform}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedSubscriptionPlatforms.includes(platform)}
                        onChange={() => handleSubscriptionPlatformChange(platform)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-checked': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      />
                    }
                    label={
                      <Typography 
                        variant="body1"
                        sx={{ 
                          fontSize: { xs: '0.8rem', sm: '0.85rem' },
                          fontWeight: 500
                        }}
                      >
                        {platform}
                      </Typography>
                    }
                    sx={{
                      width: '100%',
                      margin: 0,
                      padding: 0.6,
                      borderRadius: 1,
                      backgroundColor: selectedSubscriptionPlatforms.includes(platform) 
                        ? `${theme.palette.primary.main}20` 
                        : 'transparent',
                      border: selectedSubscriptionPlatforms.includes(platform)
                        ? `1px solid ${theme.palette.primary.main}`
                        : '1px solid transparent',
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}10`,
                      }
                    }}
                  />
                </Grid>
              ))}
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

              <Grid container spacing={1.0}>
                {rentalPurchasePlatforms.map((platform) => (
                  <Grid item xs={12} sm={6} key={platform}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedRentalPurchasePlatforms.includes(platform)}
                          onChange={() => handleRentalPurchasePlatformChange(platform)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label={
                        <Typography 
                          variant="body1"
                          sx={{ 
                            fontSize: { xs: '0.8rem', sm: '0.85rem' },
                            fontWeight: 500
                          }}
                        >
                          {platform}
                        </Typography>
                      }
                      sx={{
                        width: '100%',
                        margin: 0,
                        padding: 0.8,
                        borderRadius: 1,
                        backgroundColor: selectedRentalPurchasePlatforms.includes(platform) 
                          ? `${theme.palette.primary.main}20` 
                          : 'transparent',
                        border: selectedRentalPurchasePlatforms.includes(platform)
                          ? `1px solid ${theme.palette.primary.main}`
                          : '1px solid transparent',
                        '&:hover': {
                          backgroundColor: `${theme.palette.primary.main}10`,
                        }
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
