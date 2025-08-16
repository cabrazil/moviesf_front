import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';

interface StreamingPlatform {
  id: string;
  name: string;
  category: string;
  logoUrl?: string;
  accessType: string;
}

interface StreamingPlatformsCompactProps {
  subscriptionPlatforms: StreamingPlatform[];
  rentalPurchasePlatforms: StreamingPlatform[];
}

export const StreamingPlatformsCompact: React.FC<StreamingPlatformsCompactProps> = ({
  subscriptionPlatforms,
  rentalPurchasePlatforms
}) => {
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

  const PlatformBadge: React.FC<{ platform: StreamingPlatform; trialDays?: number }> = ({ platform, trialDays }) => (
    <Tooltip 
      title={platform.name} 
      arrow 
      componentsProps={{
        tooltip: {
          sx: {
            zIndex: 9999,
          },
        },
      }}
    >
      <Chip
        icon={
          <img 
            src={getPlatformLogo(platform.name, platform.logoUrl)} 
            alt={platform.name}
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
              filter: 'none',
              zIndex: 1,
              position: 'relative'
            }}
          />
        }
        label={trialDays ? `${trialDays} dias` : ''}
        size="medium"
        sx={{
          height: 60,
          '& .MuiChip-icon': { 
            ml: 1,
            mr: 1
          },
          '& .MuiChip-label': { 
            fontSize: '0.8rem',
            px: 1,
            fontWeight: 500
          },
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'scale(1.05)',
            boxShadow: 2,
          },
          transition: 'all 0.2s ease',
          '& .MuiTooltip-popper': {
            zIndex: 9999,
          },
        }}
      />
    </Tooltip>
  );

    return (
    <Box sx={{ width: '100%' }}>
      {/* Seção 1: Período de teste gratuito */}
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' }
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'white',
            fontWeight: 600,
            fontSize: '0.9rem',
            minWidth: 'fit-content'
          }}
        >
          Teste Grátis:
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {/* Mock do Prime Video com 30 dias */}
          <PlatformBadge 
            platform={{ 
              id: 'mock-prime', 
              name: 'Amazon Prime Video', 
              category: 'SUBSCRIPTION_PRIMARY', 
              accessType: 'INCLUDED_WITH_SUBSCRIPTION' 
            }} 
            trialDays={30}
          />
        </Box>
      </Box>

      {/* Seção 2: Incluído na Assinatura */}
      {subscriptionPlatforms.length > 0 && (
        <Box sx={{ 
          mb: 2, 
          display: 'flex', 
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' }
        }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'white',
              fontWeight: 600,
              fontSize: '0.9rem',
              minWidth: 'fit-content'
            }}
          >
            Assinatura:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {subscriptionPlatforms.map((platform) => (
              <PlatformBadge key={platform.id} platform={platform} />
            ))}
          </Box>
        </Box>
      )}

      {/* Seção 3: Aluguel / Compra */}
      <Box sx={{ 
        mb: 2, 
        display: 'flex', 
        gap: 2,
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' }
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'white',
            fontWeight: 600,
            fontSize: '0.9rem',
            minWidth: 'fit-content'
          }}
        >
          Aluguel/Compra:
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {/* Mock do YouTube */}
          <PlatformBadge 
            platform={{ 
              id: 'mock-youtube', 
              name: 'YouTube', 
              category: 'RENTAL', 
              accessType: 'RENTAL' 
            }} 
          />
          {rentalPurchasePlatforms.map((platform) => (
            <PlatformBadge key={platform.id} platform={platform} />
          ))}
        </Box>
      </Box>

      {/* Mensagem quando não há plataformas */}
      {subscriptionPlatforms.length === 0 && rentalPurchasePlatforms.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Este filme não está disponível para streaming no momento.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
