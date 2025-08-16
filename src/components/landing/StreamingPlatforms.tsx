import React from 'react';
import { Box, Typography, Paper, Stack, Chip, Button } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface StreamingPlatform {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  accessType: string;
}

interface StreamingPlatformsProps {
  subscriptionPlatforms: StreamingPlatform[];
  rentalPurchasePlatforms: StreamingPlatform[];
}

export const StreamingPlatforms: React.FC<StreamingPlatformsProps> = ({
  subscriptionPlatforms,
  rentalPurchasePlatforms
}) => {
  const getAccessTypeLabel = (accessType: string) => {
    switch (accessType) {
      case 'INCLUDED_WITH_SUBSCRIPTION':
        return 'Incluído na assinatura';
      case 'RENTAL':
        return 'Aluguel';
      case 'PURCHASE':
        return 'Compra';
      case 'FREE_WITH_ADS':
        return 'Gratuito com anúncios';
      default:
        return 'Disponível';
    }
  };

  const getAccessTypeColor = (accessType: string) => {
    switch (accessType) {
      case 'INCLUDED_WITH_SUBSCRIPTION':
        return 'success';
      case 'RENTAL':
        return 'warning';
      case 'PURCHASE':
        return 'info';
      case 'FREE_WITH_ADS':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getPlatformLogo = (platformName: string, logoUrl?: string) => {
    if (logoUrl) {
      return logoUrl;
    }
    
    // Mapeamento de nomes para arquivos de logo
    const logoMap: { [key: string]: string } = {
      'Netflix': '/platforms/netflix.avif',
      'Amazon Prime Video': '/platforms/amazonprimevideo.avif',
      'Disney+': '/platforms/disneyplus.avif',
      'HBO Max': '/platforms/max.avif',
      'Paramount+': '/platforms/paramountplus.avif',
      'Apple TV+': '/platforms/appletvplus.avif',
      'Globoplay': '/platforms/globoplay.avif',
      'Looke': '/platforms/looke.avif',
      'Claro Video': '/platforms/clarovideo.avif',
      'iTunes': '/platforms/itunes.avif',
      'Google Play': '/platforms/play.avif',
      'Microsoft Store': '/platforms/microsoft-store.jpg',
      'YouTube Premium': '/platforms/youtubepremium.jpg',
      'Oldflix': '/platforms/oldflix.avif',
      'Reserva Imovision': '/platforms/reservaimovision.avif',
      'Amazon MGM+': '/platforms/amazonmgmplus.avif',
      'Amazon Filmelier+': '/platforms/amazonfilmelierplus.avif',
      'Amazon Looke': '/platforms/amazonlooke.avif',
      'Amazon Paramount+': '/platforms/amazonparamountplus.avif',
      'Amazon Telecine': '/platforms/amazontelecine.avif',
      'Amazon HBO Max': '/platforms/amazonhbomax.avif',
      'Amazon Imovision': '/platforms/amazonimovision.avif',
      'Netflix Basic with Ads': '/platforms/netflixbasicwithads.avif',
      'Belas Artes à la Carte': '/platforms/belasartesalacarte.avif',
      'Univers Video': '/platforms/univervideo.avif',
    };

    return logoMap[platformName] || '/platforms/netflix.avif'; // fallback
  };

  const PlatformCard: React.FC<{ platform: StreamingPlatform }> = ({ platform }) => (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        minWidth: 200,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
          borderColor: 'primary.main',
        },
      }}
    >
      <Stack spacing={2}>
        {/* Logo e Nome */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={getPlatformLogo(platform.name, platform.logoUrl)}
            alt={platform.name}
            sx={{
              width: 40,
              height: 40,
              objectFit: 'contain',
              borderRadius: 1,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {platform.name}
          </Typography>
        </Box>

        {/* Tipo de Acesso */}
        <Chip
          label={getAccessTypeLabel(platform.accessType)}
          color={getAccessTypeColor(platform.accessType) as any}
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        />

        {/* Botão de Ação */}
        <Button
          variant="contained"
          startIcon={<OpenInNewIcon />}
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Assistir
        </Button>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Plataformas de Assinatura */}
      {subscriptionPlatforms.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Incluído na Assinatura
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            Assista gratuitamente com sua assinatura atual
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ flexWrap: 'wrap' }}
          >
            {subscriptionPlatforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </Stack>
        </Box>
      )}

      {/* Plataformas de Aluguel/Compra */}
      {rentalPurchasePlatforms.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              color: 'warning.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Aluguel ou Compra
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            Disponível para aluguel ou compra digital
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ flexWrap: 'wrap' }}
          >
            {rentalPurchasePlatforms.map((platform) => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </Stack>
        </Box>
      )}

      {/* Mensagem quando não há plataformas */}
      {subscriptionPlatforms.length === 0 && rentalPurchasePlatforms.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Este filme não está disponível para streaming no momento.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deixe-nos enviar uma notificação quando estiver disponível.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
