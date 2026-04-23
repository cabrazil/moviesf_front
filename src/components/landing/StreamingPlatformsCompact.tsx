import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Skeleton, CircularProgress, Tooltip } from '@mui/material';
import { getPlatformLogoUrlMedium } from '../../services/streaming.service';

interface StreamingPlatform {
  id: string;
  name: string;
  category: string;
  logoPath: string;
  hasFreeTrial: boolean;
  freeTrialDuration: string | null;
  baseUrl: string | null;
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
  const [logosLoaded, setLogosLoaded] = useState<Set<string>>(new Set());
  const [isLoadingLogos, setIsLoadingLogos] = useState(true);

  // Função para preload de imagens
  const preloadImages = async (platforms: StreamingPlatform[]) => {
    const imagePromises = platforms.map((platform) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setLogosLoaded(prev => new Set(prev).add(platform.id));
          resolve();
        };
        img.onerror = () => {
          console.warn(`Erro ao carregar logo para ${platform.name}`);
          setLogosLoaded(prev => new Set(prev).add(platform.id));
          resolve();
        };
        img.src = getPlatformLogoUrlMedium(platform.logoPath, platform.name);
      });
    });

    await Promise.all(imagePromises);
  };

  // Preload de imagens ao montar o componente
  useEffect(() => {
    const allPlatforms = [
      ...subscriptionPlatforms, 
      ...rentalPurchasePlatforms
    ];
    
    if (allPlatforms.length > 0) {
      setIsLoadingLogos(true);
      preloadImages(allPlatforms).finally(() => {
        setIsLoadingLogos(false);
      });
    } else {
      setIsLoadingLogos(false);
    }
  }, [subscriptionPlatforms, rentalPurchasePlatforms]);

  // Função para obter texto de teste grátis
  const getFreeTrialText = (platform: StreamingPlatform) => {
    if (!platform.hasFreeTrial) return null;
    return platform.freeTrialDuration ? `Teste Grátis: ${platform.freeTrialDuration}` : 'Teste Grátis Disponível';
  };

  // Componente de logo clicável com tooltip
  const PlatformLogoItem: React.FC<{ platform: StreamingPlatform; showFreeTrial?: boolean }> = ({ platform, showFreeTrial = true }) => {
    const isLogoLoaded = logosLoaded.has(platform.id);
    const freeTrialText = getFreeTrialText(platform);
    const isSubscription = platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
    const isFreeWithAds = platform.accessType === 'FREE_WITH_ADS';
    
    const tooltipContent = (
      <Box sx={{ p: 0.3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.2, fontSize: '0.8rem' }}>
          {platform.name} - {isSubscription ? 'Assinatura' : isFreeWithAds ? 'Gratuito com Anúncios' : 'Aluguel e Compra'}
        </Typography>
        {freeTrialText && showFreeTrial && (
          <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 700, mb: 0.2, fontSize: '0.75rem' }}>
            ✅ {freeTrialText}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
          Clique para {isSubscription ? 'assistir' : isFreeWithAds ? 'assistir gratuitamente' : 'alugar/comprar'}
        </Typography>
      </Box>
    );

    return (
      <Tooltip title={tooltipContent} arrow placement="top" enterDelay={200}>
        <Box sx={{ position: 'relative' }}>
          {isFreeWithAds && (
            <Typography variant="caption" sx={{ 
              position: 'absolute', 
              top: 5, 
              right: -10,
              bgcolor: '#4caf50',
              color: 'white',
              px: 0.5,
              py: 0.2,
              borderRadius: 0.5,
              fontSize: '0.55rem',
              fontWeight: 900,
              zIndex: 2,
              whiteSpace: 'nowrap',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
              letterSpacing: '0.5px'
            }}>
              GRÁTIS
            </Typography>
          )}
          <Box
            component="a"
            href={platform.baseUrl || '#'}
            target={platform.baseUrl ? "_blank" : undefined}
            rel={platform.baseUrl ? "noopener noreferrer" : undefined}
            onClick={!platform.baseUrl ? (e: React.MouseEvent) => e.preventDefault() : undefined}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              cursor: platform.baseUrl ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              border: '2px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: '#f5f5f5',
              opacity: platform.baseUrl ? 1 : 0.5,
              textDecoration: 'none',
              '&:hover': platform.baseUrl ? {
                borderColor: 'primary.main',
                boxShadow: 3,
                transform: 'scale(1.05)'
              } : {}
            }}
          >
            {isLoadingLogos || !isLogoLoaded ? (
              <Skeleton variant="rectangular" width={50} height={50} />
            ) : (
              <Box
                component="img"
                src={getPlatformLogoUrlMedium(platform.logoPath, platform.name)}
                alt={platform.name}
                sx={{ width: 50, height: 50, objectFit: 'contain' }}
              />
            )}
          </Box>
        </Box>
      </Tooltip>
    );
  };

  // Função para unificar plataformas
  const unifyPlatforms = (platforms: StreamingPlatform[]) => {
    const platformMap = new Map<string, StreamingPlatform>();
    platforms.forEach(platform => {
      if (!platformMap.has(platform.name)) {
        platformMap.set(platform.name, platform);
      }
    });
    return Array.from(platformMap.values());
  };

  const unifiedSubscriptionPlatforms = useMemo(() => unifyPlatforms(subscriptionPlatforms), [subscriptionPlatforms]);
  const unifiedRentalPurchasePlatforms = useMemo(() => unifyPlatforms(rentalPurchasePlatforms), [rentalPurchasePlatforms]);

  if (isLoadingLogos) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">Carregando plataformas...</Typography>
      </Box>
    );
  }

  if (unifiedSubscriptionPlatforms.length === 0 && unifiedRentalPurchasePlatforms.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Este filme não está disponível para streaming no momento.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 3, sm: 4 },
        flexWrap: 'wrap'
      }}>
        {unifiedSubscriptionPlatforms.length > 0 && (
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
              Assinatura e Gratuito:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
              {unifiedSubscriptionPlatforms.map((platform) => (
                <PlatformLogoItem key={platform.id} platform={platform} showFreeTrial={true} />
              ))}
            </Box>
          </Box>
        )}

        {unifiedRentalPurchasePlatforms.length > 0 && (
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
              Aluguel e Compra:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
              {unifiedRentalPurchasePlatforms.map((platform) => (
                <PlatformLogoItem key={platform.id} platform={platform} showFreeTrial={false} />
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
