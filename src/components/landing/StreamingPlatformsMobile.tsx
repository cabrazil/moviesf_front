import React, { useState, useEffect } from 'react';
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

interface StreamingPlatformsMobileProps {
  subscriptionPlatforms: StreamingPlatform[];
  rentalPurchasePlatforms: StreamingPlatform[];
}

export const StreamingPlatformsMobile: React.FC<StreamingPlatformsMobileProps> = ({
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
          setLogosLoaded(prev => new Set(prev).add(platform.id)); // Marcar como carregado mesmo com erro
          resolve();
        };
        img.src = getPlatformLogoUrlMedium(platform.logoPath);
      });
    });

    await Promise.all(imagePromises);
  };

  // Preload de imagens ao montar o componente
  useEffect(() => {
    const allPlatforms = [...subscriptionPlatforms, ...rentalPurchasePlatforms];
    if (allPlatforms.length > 0) {
      setIsLoadingLogos(true);
      preloadImages(allPlatforms).finally(() => {
        setIsLoadingLogos(false);
      });
    } else {
      setIsLoadingLogos(false);
    }
  }, [subscriptionPlatforms, rentalPurchasePlatforms]);

  // Função para obter texto do hover
  const getHoverText = (platform: StreamingPlatform) => {
    if (platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION') {
      return 'Assinatura';
    }
    
    if (platform.accessType === 'RENTAL' || platform.accessType === 'PURCHASE') {
      return 'Aluguel/Compra';
    }
    
    return 'Ver mais';
  };


  // Componente de plataforma individual
  const PlatformItem: React.FC<{ platform: StreamingPlatform }> = ({ platform }) => {
    const isLogoLoaded = logosLoaded.has(platform.id);
    const hoverText = getHoverText(platform);

    return (
      <Tooltip 
        title={hoverText} 
        arrow 
        placement="top"
        enterTouchDelay={0}
        leaveTouchDelay={3000}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              '& .MuiTooltip-arrow': {
                color: 'rgba(0, 0, 0, 0.9)',
              },
            },
          },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            p: { xs: 1, sm: 2 },
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'all 0.3s ease',
            cursor: platform.baseUrl ? 'pointer' : 'default',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: 2,
              transform: 'translateY(-2px)',
            },
            opacity: platform.baseUrl ? 1 : 0.6,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
          onClick={platform.baseUrl ? () => window.open(platform.baseUrl!, '_blank') : undefined}
        >
          {/* Logo */}
          <Box sx={{ 
            position: 'relative', 
            width: { xs: 40, sm: 45 }, 
            height: { xs: 40, sm: 45 }, 
            flexShrink: 0 
          }}>
            {isLoadingLogos || !isLogoLoaded ? (
              <>
                <Skeleton 
                  variant="rectangular" 
                  width={40} 
                  height={40} 
                  sx={{ 
                    borderRadius: 1,
                    display: { xs: 'block', sm: 'none' }
                  }} 
                />
                <Skeleton 
                  variant="rectangular" 
                  width={45} 
                  height={45} 
                  sx={{ 
                    borderRadius: 1,
                    display: { xs: 'none', sm: 'block' }
                  }} 
                />
              </>
            ) : (
              <Box
                component="img"
                src={getPlatformLogoUrlMedium(platform.logoPath)}
                alt={platform.name}
                sx={{
                  width: { xs: 40, sm: 45 },
                  height: { xs: 40, sm: 45 },
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
            )}
          </Box>

        </Box>
      </Tooltip>
    );
  };

  // Loading state
  if (isLoadingLogos) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Carregando plataformas...
        </Typography>
      </Box>
    );
  }

  // Função para unificar plataformas com múltiplos accessTypes
  const unifyPlatforms = (platforms: StreamingPlatform[]) => {
    const platformMap = new Map<string, StreamingPlatform>();
    
    platforms.forEach(platform => {
      const existing = platformMap.get(platform.name);
      
      if (existing) {
        // Se já existe, verificar se tem accessTypes diferentes
        if (existing.accessType !== platform.accessType) {
          // Se tem RENTAL e PURCHASE, manter como está (já está unificado)
          if ((existing.accessType === 'RENTAL' && platform.accessType === 'PURCHASE') ||
              (existing.accessType === 'PURCHASE' && platform.accessType === 'RENTAL')) {
            // Manter o existente que já tem "(Aluguel e Compra)"
          } else {
            // Para outros casos, usar o primeiro encontrado
            platformMap.set(platform.name, existing);
          }
        }
      } else {
        platformMap.set(platform.name, platform);
      }
    });
    
    return Array.from(platformMap.values());
  };

  // Unificar plataformas
  const unifiedSubscriptionPlatforms = unifyPlatforms(subscriptionPlatforms);
  const unifiedRentalPurchasePlatforms = unifyPlatforms(rentalPurchasePlatforms);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Todas as plataformas em um grid único */}
      {(unifiedSubscriptionPlatforms.length > 0 || unifiedRentalPurchasePlatforms.length > 0) && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' }, 
            gap: { xs: 1, sm: 1.5 },
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            {unifiedSubscriptionPlatforms.map((platform) => (
              <PlatformItem key={platform.id} platform={platform} />
            ))}
            {unifiedRentalPurchasePlatforms.map((platform) => (
              <PlatformItem key={platform.id} platform={platform} />
            ))}
          </Box>
          
          {/* Linha divisória sutil */}
          <Box sx={{ 
            mt: 2, 
            height: 1, 
            bgcolor: 'divider', 
            opacity: 0.3 
          }} />
        </Box>
      )}

      {/* Mensagem quando não há plataformas */}
      {unifiedSubscriptionPlatforms.length === 0 && unifiedRentalPurchasePlatforms.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Este filme não está disponível para streaming no momento.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
