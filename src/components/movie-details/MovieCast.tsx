import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';

interface Actor {
  actorName: string;
  characterName?: string;
}

interface MovieCastProps {
  mainCast: Actor[];
  showFullCast: boolean;
  onToggleFullCast: () => void;
  isMobile?: boolean;
}

const MovieCast: React.FC<MovieCastProps> = React.memo(({ 
  mainCast, 
  showFullCast, 
  onToggleFullCast,
  isMobile = false 
}) => {
  const handleToggle = useCallback(() => {
    onToggleFullCast();
  }, [onToggleFullCast]);

  if (!mainCast || mainCast.length === 0) {
    return null;
  }

  const displayedCast = showFullCast ? mainCast : mainCast.slice(0, 5);
  const hasMore = mainCast.length > 5;

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      <Typography variant="h3" component="h3" sx={{ 
        color: '#1976d2',
        textAlign: isMobile ? 'center' : 'left',
        fontSize: isMobile ? '1.1rem' : '1.3rem',
        fontWeight: 600,
        mb: 2
      }}>
        Elenco Principal
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 0.5,
        width: '100%'
      }}>
        {displayedCast.map((actor, index) => (
          <Box key={index} sx={{ py: 0.5 }}>
            <Typography variant="body1" sx={{ 
              fontWeight: 500, 
              color: 'text.primary',
              fontSize: '1rem',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              {actor.actorName} {actor.characterName && (
                <span style={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                  {' '}
                  <span style={{ fontStyle: 'italic', color: '#666' }}>como</span> {actor.characterName}
                </span>
              )}
            </Typography>
          </Box>
        ))}
        
        {hasMore && (
          <Box sx={{ 
            mt: 1, 
            pt: 1, 
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#1976d2',
                fontSize: '0.9rem',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={handleToggle}
            >
              {showFullCast ? 'Ver menos...' : `Ver mais... (${mainCast.length - 5} atores)`}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.mainCast.length === nextProps.mainCast.length &&
    prevProps.showFullCast === nextProps.showFullCast &&
    prevProps.isMobile === nextProps.isMobile &&
    prevProps.mainCast.every((actor, index) => 
      actor.actorName === nextProps.mainCast[index]?.actorName &&
      actor.characterName === nextProps.mainCast[index]?.characterName
    )
  );
});

MovieCast.displayName = 'MovieCast';

export default MovieCast;

