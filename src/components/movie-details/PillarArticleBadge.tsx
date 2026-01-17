import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface PillarArticle {
  id: number;
  blogArticleId: string;
  title: string;
  slug: string;
}

interface PillarArticleBadgeProps {
  articles: PillarArticle[];
  themeColor?: string;
}

const PillarArticleBadge: React.FC<PillarArticleBadgeProps> = ({
  articles,
  themeColor = '#ff9800'
}) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  const handleArticleClick = (slug: string) => {
    const blogUrl = window.location.origin;
    window.open(`${blogUrl}/blog/artigo/${slug}`, '_blank');
  };

  return (
    <Box sx={{
      mb: 2,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: { xs: 'center', md: 'flex-start' }
    }}>
      {articles.map((article, index) => (
        <Box
          key={article.id}
          sx={{
            mb: index < articles.length - 1 ? 2 : 0,
            width: '100%'
          }}
        >
          {/* Título da seção */}
          <Typography
            variant="subtitle1"
            sx={{
              mb: 0.5,
              color: themeColor,
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: '1.2rem' }} />
            Nota de Curadoria
          </Typography>

          {/* Conteúdo clicável */}
          <Paper
            elevation={0}
            onClick={() => handleArticleClick(article.slug)}
            sx={{
              bgcolor: 'transparent',
              color: 'text.secondary',
              p: 1.5,
              borderRadius: 2,
              border: `1.5px solid ${themeColor}40`,
              fontStyle: 'italic',
              textAlign: { xs: 'center', md: 'left' },
              fontSize: '0.97rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: `${themeColor}60`,
                backgroundColor: `${themeColor}05`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            Este filme é destaque no artigo <strong style={{ color: themeColor }}>"{article.title}"</strong>.
            Clique para explorar a lista completa e descobrir outros títulos selecionados.
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default PillarArticleBadge;
