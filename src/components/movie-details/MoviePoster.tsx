import React from 'react';
import { Box } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface MoviePosterProps {
  thumbnail?: string;
  title: string;
  themeColor: string;
}

const MoviePoster: React.FC<MoviePosterProps> = React.memo(({ thumbnail, title, themeColor }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        width: '100%',
        maxWidth: 280
      }}
    >
      {thumbnail ? (
        <LazyLoadImage
          src={thumbnail}
          alt={title}
          effect="opacity"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
          placeholder={
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.300',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  border: `3px solid ${themeColor}`,
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }}
              />
            </Box>
          }
        />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 400,
            bgcolor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'grey.500'
          }}
        >
          Sem imagem
        </Box>
      )}
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.thumbnail === nextProps.thumbnail &&
    prevProps.title === nextProps.title &&
    prevProps.themeColor === nextProps.themeColor
  );
});

MoviePoster.displayName = 'MoviePoster';

export default MoviePoster;

