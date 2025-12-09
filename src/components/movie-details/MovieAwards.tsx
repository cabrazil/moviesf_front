import React, { useCallback, useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { translateOscarCategory } from './movieDetailsHelpers';

interface OscarAward {
  category: string;
  categoryName?: string;
  personName: string;
  year: number;
}

interface MovieAwardsProps {
  oscarAwards: {
    wins: OscarAward[];
    nominations: OscarAward[];
  };
  movieTitle: string;
  showFullNominations: boolean;
  onToggleFullNominations: () => void;
  isMobile?: boolean;
}

const MovieAwards: React.FC<MovieAwardsProps> = React.memo(({ 
  oscarAwards, 
  movieTitle,
  showFullNominations,
  onToggleFullNominations,
  isMobile = false 
}) => {
  const handleToggle = useCallback(() => {
    onToggleFullNominations();
  }, [onToggleFullNominations]);

  const totalAwards = useMemo(() => 
    oscarAwards.wins.length + oscarAwards.nominations.length,
    [oscarAwards.wins.length, oscarAwards.nominations.length]
  );

  const awardYear = useMemo(() => 
    oscarAwards.wins.length > 0 
      ? oscarAwards.wins[0].year 
      : oscarAwards.nominations[0]?.year,
    [oscarAwards.wins, oscarAwards.nominations]
  );

  if (!oscarAwards || (oscarAwards.wins.length === 0 && oscarAwards.nominations.length === 0)) {
    return null;
  }

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      <Typography variant="h3" component="h3" sx={{ 
        color: '#1976d2',
        textAlign: isMobile ? 'center' : 'left',
        fontSize: isMobile ? '1.1rem' : '1.3rem',
        fontWeight: 600,
        mb: 2
      }}>
        Premiações e Reconhecimento
      </Typography>
      
      {/* Texto introdutório */}
      <Typography variant="body1" sx={{ 
        mb: 2,
        lineHeight: 1.6,
        fontSize: '1rem',
        color: 'text.primary',
        fontWeight: 500
      }}>
        {movieTitle} foi indicado a {totalAwards} Oscar{totalAwards > 1 ? 's' : ''} em {awardYear}
        {oscarAwards.wins.length > 0 ? ', ' : ''}
        {oscarAwards.wins.length > 0 && <span style={{ fontStyle: 'italic' }}>conquistou</span>}:
      </Typography>

      {/* Vitórias no Oscar */}
      {oscarAwards.wins.length > 0 && (
        <Box sx={{ mb: 2 }}>
          {oscarAwards.wins.map((win, index) => (
            <Box key={index} sx={{ py: 0.5 }}>
              <Typography variant="body1" sx={{ 
                fontWeight: 500, 
                color: 'text.primary',
                fontSize: '1rem'
              }}>
                {translateOscarCategory(win.categoryName || win.category)}{' '}
                <span style={{ fontStyle: 'italic', color: '#666' }}>para</span>{' '}
                <span style={{ fontSize: '0.9rem', color: 'text.secondary' }}>{win.personName}</span>
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Indicações que não venceram */}
      {oscarAwards.nominations.length > 0 && (
        <>
          {showFullNominations && (
            <Box sx={{ mt: 2 }}>
              {/* Título "Indicações" para separar das vitórias */}
              {oscarAwards.wins.length > 0 && (
                <Typography 
                  variant="h4" 
                  component="h4" 
                  sx={{ 
                    mb: 1.5, 
                    color: '#1976d2', 
                    textAlign: isMobile ? 'center' : 'left', 
                    fontSize: isMobile ? '1rem' : '1.1rem', 
                    fontWeight: 600 
                  }}
                >
                  Indicações
                </Typography>
              )}
              {oscarAwards.nominations.map((nomination, index) => (
                <Box key={index} sx={{ py: 0.5 }}>
                  <Typography variant="body1" sx={{ 
                    fontWeight: 500, 
                    color: 'text.primary',
                    fontSize: '1rem'
                  }}>
                    {translateOscarCategory(nomination.categoryName || nomination.category)}{' '}
                    <span style={{ fontStyle: 'italic', color: '#666' }}>para</span>{' '}
                    <span style={{ fontSize: '0.9rem', color: 'text.secondary' }}>{nomination.personName}</span>
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ 
            mt: 2, 
            pt: 1, 
            borderTop: '1px solid',
            borderColor: 'divider',
            textAlign: 'center'
          }}>
            <Button
              variant="text"
              onClick={handleToggle}
              sx={{
                textTransform: 'none',
                color: '#1976d2',
                fontSize: '0.9rem',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)'
                }
              }}
            >
              {showFullNominations 
                ? 'Ver menos indicações' 
                : `Ver todas as indicações (${oscarAwards.nominations.length})`
              }
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.oscarAwards.wins.length === nextProps.oscarAwards.wins.length &&
    prevProps.oscarAwards.nominations.length === nextProps.oscarAwards.nominations.length &&
    prevProps.showFullNominations === nextProps.showFullNominations &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.movieTitle === nextProps.movieTitle
  );
});

MovieAwards.displayName = 'MovieAwards';

export default MovieAwards;

