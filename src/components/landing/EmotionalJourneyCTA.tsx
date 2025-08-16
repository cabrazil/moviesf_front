import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface EmotionalJourneyCTAProps {
  movieTitle?: string;
  variant?: 'hero' | 'floating' | 'section';
}

export const EmotionalJourneyCTA: React.FC<EmotionalJourneyCTAProps> = ({ 
  movieTitle, 
  variant = 'section' 
}) => {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    navigate('/intro');
  };

  const getCTAContent = () => {
    if (variant === 'hero') {
      return {
        title: '🎭 Qual filme combina com seu humor hoje?',
        subtitle: 'Responda 3 perguntas e descubra filmes perfeitos para você',
        buttonText: 'EXPERIMENTAR AGORA',
        buttonVariant: 'contained' as const,
        buttonSize: 'large' as const,
      };
    }

    if (variant === 'floating') {
      return {
        title: 'Encontre o filme perfeito para seu momento',
        subtitle: '',
        buttonText: 'TESTAR JORNADA EMOCIONAL',
        buttonVariant: 'outlined' as const,
        buttonSize: 'medium' as const,
      };
    }

    // section variant
    return {
      title: movieTitle 
        ? `💭 Gostou de "${movieTitle}"?`
        : '💭 Descubra filmes perfeitos para você',
      subtitle: 'Nossa jornada emocional personalizada encontra filmes que combinam com seu humor atual',
      buttonText: 'DESCOBRIR FILMES',
      buttonVariant: 'contained' as const,
      buttonSize: 'large' as const,
    };
  };

  const content = getCTAContent();

  if (variant === 'floating') {
    return (
      <Paper
        elevation={8}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          p: 2,
          maxWidth: 250,
          zIndex: 1000,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          animation: 'slideInUp 0.5s ease-out',
          '@keyframes slideInUp': {
            '0%': {
              transform: 'translateY(100px)',
              opacity: 0,
            },
            '100%': {
              transform: 'translateY(0)',
              opacity: 1,
            },
          },
        }}
      >
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold', fontSize: '0.9rem' }}>
          {content.title}
        </Typography>
        <Button
          variant={content.buttonVariant}
          size={content.buttonSize}
          onClick={handleCTAClick}
          sx={{
            bgcolor: 'white',
            color: '#667eea',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          {content.buttonText}
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        background: variant === 'hero' 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'background.paper',
        color: variant === 'hero' ? 'white' : 'text.primary',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': variant === 'hero' ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        } : {},
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <PsychologyIcon sx={{ fontSize: 48, mb: 2, opacity: 0.8 }} />
        
        <Typography 
          variant={variant === 'hero' ? 'h4' : 'h5'} 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold',
            background: variant === 'hero' ? 'linear-gradient(45deg, #fff, #f0f0f0)' : 'none',
            backgroundClip: variant === 'hero' ? 'text' : 'unset',
            WebkitBackgroundClip: variant === 'hero' ? 'text' : 'unset',
            WebkitTextFillColor: variant === 'hero' ? 'transparent' : 'unset',
          }}
        >
          {content.title}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3, 
            opacity: variant === 'hero' ? 0.9 : 0.7,
            maxWidth: 600,
            mx: 'auto',
          }}
        >
          {content.subtitle}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
          <Chip 
            label="3 perguntas rápidas" 
            size="small" 
            sx={{ 
              bgcolor: variant === 'hero' ? 'rgba(255,255,255,0.2)' : 'primary.light',
              color: variant === 'hero' ? 'white' : 'white',
            }} 
          />
          <Chip 
            label="Recomendações personalizadas" 
            size="small" 
            sx={{ 
              bgcolor: variant === 'hero' ? 'rgba(255,255,255,0.2)' : 'primary.light',
              color: variant === 'hero' ? 'white' : 'white',
            }} 
          />
          <Chip 
            label="100% gratuito" 
            size="small" 
            sx={{ 
              bgcolor: variant === 'hero' ? 'rgba(255,255,255,0.2)' : 'primary.light',
              color: variant === 'hero' ? 'white' : 'white',
            }} 
          />
        </Box>

        <Button
          variant={content.buttonVariant}
          size={content.buttonSize}
          onClick={handleCTAClick}
          endIcon={<ArrowForwardIcon />}
          sx={{
            bgcolor: variant === 'hero' ? 'white' : 'primary.main',
            color: variant === 'hero' ? '#667eea' : 'white',
            px: 4,
            py: 1.5,
            borderRadius: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              bgcolor: variant === 'hero' ? 'rgba(255,255,255,0.9)' : 'primary.dark',
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
            transition: 'all 0.3s ease',
          }}
        >
          {content.buttonText}
        </Button>
      </Box>
    </Paper>
  );
};
