import React, { useMemo } from 'react';
import { Stack, Chip } from '@mui/material';

interface MoviePlatformsProps {
  platforms: any[];
  streamingFilters: any;
  sentimentColor: string;
  sentimentColorWithOpacity: string;
  sentimentColorBorder: string;
}

const MoviePlatforms: React.FC<MoviePlatformsProps> = React.memo(({
  platforms,
  streamingFilters,
  sentimentColor,
  sentimentColorWithOpacity,
  sentimentColorBorder
}) => {
  // Se não há plataformas disponíveis, mostrar "não disponível no momento"
  if (platforms.length === 0) {
    return (
      <Chip
        label="não disponível no momento"
        size="small"
        sx={{
          fontSize: '0.7rem',
          height: '22px',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          color: '#ff9800',
          border: '1px solid rgba(255, 152, 0, 0.3)',
          fontWeight: 500,
          '& .MuiChip-label': {
            px: 1.2
          }
        }}
      />
    );
  }

  // Memoizar plataformas filtradas e processadas
  const { platformsToShow, showMoreChip, showCountChip, countValue } = useMemo(() => {
    // Se há filtros ativos, mostrar apenas plataformas que correspondem aos filtros
    if (streamingFilters && streamingFilters.subscriptionPlatforms.length > 0) {
      const filteredPlatforms = platforms.filter((platform: any) => {
        const platformName = platform.streamingPlatform?.name || '';
        const accessType = platform.accessType || '';
        
        // Verificar se a plataforma corresponde aos filtros selecionados
        const matchesSubscription = streamingFilters.subscriptionPlatforms.length === 0 || 
          streamingFilters.subscriptionPlatforms.some((selectedPlatform: string) => {
            if (selectedPlatform === '__OTHER_PLATFORMS__') {
              const mainPlatforms = [
                'prime video', 'netflix', 'disney+', 'hbo max', 'globoplay', 
                'apple tv+', 'claro video'
              ];
              const isMainPlatform = mainPlatforms.some(main => 
                platformName.toLowerCase().includes(main)
              );
              return !isMainPlatform;
            }
            
            const cleanSelectedPlatform = selectedPlatform.toLowerCase().trim();
            const cleanPlatformName = platformName.toLowerCase().trim();
            return cleanPlatformName === cleanSelectedPlatform || cleanPlatformName.includes(cleanSelectedPlatform);
          });
        
        // Lógica simplificada: só permitir assinaturas que correspondem aos filtros
        if (accessType === 'INCLUDED_WITH_SUBSCRIPTION') {
          return matchesSubscription;
        }
        
        return false;
      });
      
      const sortedPlatforms = filteredPlatforms
        .sort((a: any, b: any) => {
          const aIsSubscription = a.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
          const bIsSubscription = b.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
          if (aIsSubscription && !bIsSubscription) return -1;
          if (!aIsSubscription && bIsSubscription) return 1;
          return 0;
        });
      
      const platformsToShow = sortedPlatforms.slice(0, 3);
      const totalFilteredPlatforms = filteredPlatforms.length;
      const totalAllPlatforms = platforms.length;
      
      const showMoreChip = totalAllPlatforms > totalFilteredPlatforms;
      const showCountChip = totalFilteredPlatforms > 3;
      const countValue = totalFilteredPlatforms - 3;
      
      return { platformsToShow, showMoreChip, showCountChip, countValue };
    } else {
      // Sem filtros ativos, mostrar até 3 plataformas de assinatura + "ver mais" se há aluguel/compra
      const subscriptionPlatforms = platforms.filter((platform: any) => 
        platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION'
      );
      
      const platformsToShow = subscriptionPlatforms.slice(0, 3);
      const rentalPurchasePlatforms = platforms.filter((platform: any) => 
        platform.accessType === 'PURCHASE' || platform.accessType === 'RENTAL'
      );
      
      const hasRentalPurchase = rentalPurchasePlatforms.length > 0;
      const hasManySubscriptions = subscriptionPlatforms.length > 3;
      
      return {
        platformsToShow,
        showMoreChip: hasRentalPurchase || hasManySubscriptions,
        showCountChip: false,
        countValue: 0
      };
    }
  }, [platforms, streamingFilters]);

  return (
    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
      {platformsToShow.map((platform: any, index: number) => {
        const isSubscription = platform.accessType === 'INCLUDED_WITH_SUBSCRIPTION';
        return (
          <Chip
            key={index}
            label={platform.streamingPlatform?.name || platform.name || 'Plataforma'}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: '22px',
              backgroundColor: isSubscription 
                ? sentimentColorWithOpacity 
                : 'rgba(25, 118, 210, 0.1)',
              color: isSubscription ? sentimentColor : '#1976d2',
              border: isSubscription 
                ? `1px solid ${sentimentColorBorder}` 
                : '1px solid rgba(25, 118, 210, 0.3)',
              fontWeight: isSubscription ? 600 : 500,
              '& .MuiChip-label': {
                px: 1.2
              }
            }}
          />
        );
      })}
      {showMoreChip && (
        <Chip
          label="ver mais"
          size="small"
          sx={{
            fontSize: '0.7rem',
            height: '22px',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: '#4caf50',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            fontWeight: 500,
            '& .MuiChip-label': {
              px: 1.2
            }
          }}
        />
      )}
      {showCountChip && countValue > 0 && (
        <Chip
          label={`+${countValue}`}
          size="small"
          sx={{
            fontSize: '0.7rem',
            height: '22px',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: 'text.secondary',
            border: '1px solid rgba(0, 0, 0, 0.2)',
            '& .MuiChip-label': {
              px: 1.2
            }
          }}
        />
      )}
    </Stack>
  );
}, (prevProps, nextProps) => {
  // Comparação customizada
  return (
    prevProps.platforms.length === nextProps.platforms.length &&
    prevProps.sentimentColor === nextProps.sentimentColor &&
    JSON.stringify(prevProps.streamingFilters) === JSON.stringify(nextProps.streamingFilters)
  );
});

MoviePlatforms.displayName = 'MoviePlatforms';

export default MoviePlatforms;

