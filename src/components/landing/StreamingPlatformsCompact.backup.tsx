import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Skeleton, CircularProgress, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  // Função para obter texto de teste grátis
  const getFreeTrialText = (platform: StreamingPlatform) => {
    if (!platform.hasFreeTrial) return null;
    
    if (platform.freeTrialDuration) {
      return `(Teste Grátis: ${platform.freeTrialDuration})`;
    }
    
    return '(Teste Grátis Disponível)';
  };

  // Função para obter texto do botão CTA
  const getCTAText = (platform: StreamingPlatform) => {
    if (platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION') {
      if (platform.hasFreeTrial) {
        return 'Comece seu teste';
      }
      return 'Assistir agora';
    }
    
    if (platform.accessType === 'RENTAL' || platform.accessType === 'PURCHASE') {
      return 'Alugue ou Compre';
    }
    
    return 'Ver mais';
  };

  // Componente de plataforma para assinatura (sem nome)
  const SubscriptionPlatformItem: React.FC<{ platform: StreamingPlatform }> = ({ platform }) => {
    const isLogoLoaded = logosLoaded.has(platform.id);
    const freeTrialText = getFreeTrialText(platform);
    const ctaText = getCTAText(platform);

    return (
      <Tooltip 
        title={`${platform.name} - Assinatura${freeTrialText ? ` (${freeTrialText})` : ''}`}
        arrow
        placement="top"
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          p: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: 2,
          }
        }}>
        {/* Logo */}
        <Box sx={{ position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
          {isLoadingLogos || !isLogoLoaded ? (
            <Skeleton variant="rectangular" width={50} height={50} />
          ) : (
            <Box
              component="img"
              src={getPlatformLogoUrlMedium(platform.logoPath)}
              alt={platform.name}
              sx={{
                width: 50,
                height: 50,
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </Box>

        {/* Informações da plataforma - SEM NOME */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Só exibir teste grátis */}
          {freeTrialText && (
            <Typography variant="body2" sx={{ 
              color: 'success.main',
              fontWeight: 500,
              mb: 0.3,
              fontSize: '0.85rem'
            }}>
              {freeTrialText}
            </Typography>
          )}
        </Box>

        {/* Botão CTA */}
        <Button
          variant={platform.baseUrl ? "contained" : "outlined"}
          size="medium"
          startIcon={<PlayArrowIcon />}
          component={platform.baseUrl ? "a" : "button"}
          href={platform.baseUrl || undefined}
          target={platform.baseUrl ? "_blank" : undefined}
          rel={platform.baseUrl ? "noopener noreferrer" : undefined}
          disabled={!platform.baseUrl}
          onClick={!platform.baseUrl ? (e: React.MouseEvent) => e.preventDefault() : undefined}
          sx={{
            bgcolor: platform.baseUrl ? '#1976d2' : 'transparent',
            color: platform.baseUrl ? 'white' : 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: '0.85rem',
            minWidth: 'fit-content',
            textDecoration: 'none',
            borderColor: platform.baseUrl ? '#1976d2' : 'text.disabled',
            '&:hover': {
              bgcolor: platform.baseUrl ? '#1565c0' : 'transparent',
              textDecoration: 'none',
              borderColor: platform.baseUrl ? '#1565c0' : 'text.disabled',
            },
            '&:disabled': {
              bgcolor: 'transparent',
              color: 'text.disabled',
              borderColor: 'text.disabled',
            }
          }}
        >
          {platform.baseUrl ? ctaText : 'Indisponível'}
        </Button>
        </Box>
      </Tooltip>
    );
  };

  // Componente de plataforma para aluguel/compra (sem nome)
  const RentalPlatformItem: React.FC<{ platform: StreamingPlatform }> = ({ platform }) => {
    const isLogoLoaded = logosLoaded.has(platform.id);
    const ctaText = getCTAText(platform);

    return (
      <Tooltip 
        title={`${platform.name} - Aluguel e Compra`}
        arrow
        placement="top"
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          p: 1.5,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: 2,
          }
        }}>
        {/* Logo */}
        <Box sx={{ position: 'relative', width: 50, height: 50, flexShrink: 0 }}>
          {isLoadingLogos || !isLogoLoaded ? (
            <Skeleton variant="rectangular" width={50} height={50} />
          ) : (
            <Box
              component="img"
              src={getPlatformLogoUrlMedium(platform.logoPath)}
              alt={platform.name}
              sx={{
                width: 50,
                height: 50,
                objectFit: 'contain',
                borderRadius: 1,
              }}
            />
          )}
        </Box>

        {/* Espaço vazio - sem informações de texto */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Sem nome nem texto adicional */}
        </Box>

        {/* Botão CTA */}
        <Button
          variant={platform.baseUrl ? "contained" : "outlined"}
          size="medium"
          startIcon={<ShoppingCartIcon />}
          component={platform.baseUrl ? "a" : "button"}
          href={platform.baseUrl || undefined}
          target={platform.baseUrl ? "_blank" : undefined}
          rel={platform.baseUrl ? "noopener noreferrer" : undefined}
          disabled={!platform.baseUrl}
          onClick={!platform.baseUrl ? (e: React.MouseEvent) => e.preventDefault() : undefined}
          sx={{
            bgcolor: platform.baseUrl ? '#1976d2' : 'transparent',
            color: platform.baseUrl ? 'white' : 'text.secondary',
            fontWeight: 600,
            textTransform: 'none',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: '0.85rem',
            minWidth: 'fit-content',
            textDecoration: 'none',
            borderColor: platform.baseUrl ? '#1976d2' : 'text.disabled',
            '&:hover': {
              bgcolor: platform.baseUrl ? '#1565c0' : 'transparent',
              textDecoration: 'none',
              borderColor: platform.baseUrl ? '#1565c0' : 'text.disabled',
            },
            '&:disabled': {
              bgcolor: 'transparent',
              color: 'text.disabled',
              borderColor: 'text.disabled',
            }
          }}
        >
          {platform.baseUrl ? ctaText : 'Indisponível'}
        </Button>
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
      {/* Seção Assinatura */}
      {unifiedSubscriptionPlatforms.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
            gap: 1.5 
          }}>
            {unifiedSubscriptionPlatforms.map((platform) => (
              <SubscriptionPlatformItem key={platform.id} platform={platform} />
            ))}
          </Box>
        </Box>
      )}

      {/* Seção Aluguel/Compra */}
      {unifiedRentalPurchasePlatforms.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
            gap: 1.5 
          }}>
            {unifiedRentalPurchasePlatforms.map((platform) => (
              <RentalPlatformItem key={platform.id} platform={platform} />
            ))}
          </Box>
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
