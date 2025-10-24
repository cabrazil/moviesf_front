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
          setLogosLoaded(prev => new Set(prev).add(platform.id)); // Marcar como carregado mesmo com erro
          resolve();
        };
        img.src = getPlatformLogoUrlMedium(platform.logoPath, platform.name);
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

  // Função para obter texto de teste grátis
  const getFreeTrialText = (platform: StreamingPlatform) => {
    if (!platform.hasFreeTrial) return null;
    
    if (platform.freeTrialDuration) {
      return `Teste Grátis: ${platform.freeTrialDuration}`;
    }
    
    return 'Teste Grátis Disponível';
  };

  // Componente de logo clicável com tooltip
  const PlatformLogoItem: React.FC<{ platform: StreamingPlatform; showFreeTrial?: boolean }> = ({ platform, showFreeTrial = true }) => {
    const isLogoLoaded = logosLoaded.has(platform.id);
    const freeTrialText = getFreeTrialText(platform);
    const isSubscription = platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
    
    // Tooltip content
    const tooltipContent = (
      <Box sx={{ p: 0.3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.2, fontSize: '0.8rem' }}>
          {platform.name} - {isSubscription ? 'Assinatura' : 'Aluguel e Compra'}
        </Typography>
        {freeTrialText && showFreeTrial && (
          <Typography variant="body2" sx={{ 
            color: '#4caf50', 
            fontWeight: 700, 
            mb: 0.2, 
            fontSize: '0.75rem',
            textShadow: '0 0 2px rgba(76, 175, 80, 0.3)'
          }}>
            ✅ {freeTrialText}
          </Typography>
        )}
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
          Clique para {isSubscription ? 'assistir' : 'alugar/comprar'}
        </Typography>
      </Box>
    );

    return (
      <Tooltip title={tooltipContent} arrow placement="top" enterDelay={200}>
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
              sx={{
                width: 50,
                height: 50,
                objectFit: 'contain',
              }}
            />
          )}
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
      {/* Container principal com layout horizontal */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 2, md: 4 },
        alignItems: 'flex-start'
      }}>
        {/* Seção Assinatura */}
        {unifiedSubscriptionPlatforms.length > 0 && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
              Assinatura:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 2.5
            }}>
              {unifiedSubscriptionPlatforms.map((platform) => (
                <PlatformLogoItem key={platform.id} platform={platform} showFreeTrial={true} />
              ))}
            </Box>
          </Box>
        )}

        {/* Seção Aluguel/Compra */}
        {unifiedRentalPurchasePlatforms.length > 0 && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
              Aluguel e Compra:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: 2.5
            }}>
              {unifiedRentalPurchasePlatforms.map((platform) => (
                <PlatformLogoItem key={platform.id} platform={platform} showFreeTrial={false} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

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
