import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Paper, Container, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

export enum EmotionalIntention {
  PROCESS = 'process',
  TRANSFORM = 'transform', 
  MAINTAIN = 'maintain',
  EXPLORE = 'explore'
}

interface EmotionalIntentionStepProps {
  sentimentName: string;
  onIntentionSelect: (intention: EmotionalIntention) => void;
  onBack: () => void;
}

interface IntentionOption {
  value: EmotionalIntention;
  title: string;
  description: string;
  icon: string;
  examples: string[];
}

const EmotionalIntentionStep: React.FC<EmotionalIntentionStepProps> = ({
  sentimentName,
  onIntentionSelect,
  onBack
}) => {
  const [selectedIntention, setSelectedIntention] = useState<EmotionalIntention | null>(null);

  // Configurações específicas para cada sentimento
  const getIntentionOptions = (sentiment: string): IntentionOption[] => {
    switch (sentiment) {
      case 'Triste / Melancólico(a)':
        return [
          {
            value: EmotionalIntention.PROCESS,
            title: '🧘‍♀️ Processar e Elaborar',
            description: 'Quero um filme que me ajude a processar e elaborar essa tristeza',
            icon: '💭',
            examples: ['Dramas profundos', 'Biografias tocantes', 'Romances dramáticos']
          },
          {
            value: EmotionalIntention.TRANSFORM,
            title: '🌈 Mudar de Estado',
            description: 'Quero um filme que me ajude a sair dessa tristeza',
            icon: '✨',
            examples: ['Comédias reconfortantes', 'Animações inspiradoras', 'Musicais alegres']
          },
          {
            value: EmotionalIntention.MAINTAIN,
            title: '🎭 Ficar em Sintonia',
            description: 'Estou bem com essa melancolia, quero algo que ressoe com ela',
            icon: '🌙',
            examples: ['Dramas indie', 'Filmes de arte', 'Documentários contemplativos']
          },
          {
            value: EmotionalIntention.EXPLORE,
            title: '🔍 Explorar Nuances',
            description: 'Quero explorar diferentes aspectos da tristeza e melancolia',
            icon: '🎨',
            examples: ['Dramas complexos', 'Filmes de época', 'Narrativas profundas']
          }
        ];

      case 'Ansioso(a) / Nervoso(a)':
        return [
          {
            value: EmotionalIntention.PROCESS,
            title: '🧘‍♀️ Entender a Ansiedade',
            description: 'Quero entender e processar essa ansiedade',
            icon: '🔍',
            examples: ['Dramas psicológicos', 'Thrillers reflexivos']
          },
          {
            value: EmotionalIntention.TRANSFORM,
            title: '😌 Acalmar e Relaxar',
            description: 'Quero algo que me acalme e relaxe',
            icon: '🌊',
            examples: ['Comédias leves', 'Romances suaves', 'Documentários de natureza']
          },
          {
            value: EmotionalIntention.MAINTAIN,
            title: '⚡ Canalizar a Energia',
            description: 'Aceito essa energia ansiosa, quero algo que a canalize',
            icon: '🎯',
            examples: ['Suspenses leves', 'Mistérios', 'Aventuras']
          },
          {
            value: EmotionalIntention.EXPLORE,
            title: '🌱 Crescer com a Ansiedade',
            description: 'Quero explorar essa ansiedade de forma construtiva',
            icon: '📈',
            examples: ['Dramas de superação', 'Biografias inspiradoras']
          }
        ];

      case 'Cansado(a) / Desmotivado(a)':
        return [
          {
            value: EmotionalIntention.PROCESS,
            title: '🤗 Aceitar o Cansaço',
            description: 'Quero reconhecer e aceitar esse cansaço',
            icon: '💤',
            examples: ['Dramas suaves', 'Slice of life']
          },
          {
            value: EmotionalIntention.TRANSFORM,
            title: '🚀 Recarregar Energias',
            description: 'Quero algo que me motive e recarregue minhas energias',
            icon: '⚡',
            examples: ['Comédias inspiradoras', 'Aventuras', 'Biografias motivacionais']
          },
          {
            value: EmotionalIntention.MAINTAIN,
            title: '🛋️ Algo Leve e Fácil',
            description: 'Quero algo leve que não exija muito esforço mental',
            icon: '☁️',
            examples: ['Comédias leves', 'Romances suaves', 'Animações simples']
          },
          {
            value: EmotionalIntention.EXPLORE,
            title: '🗺️ Encontrar Caminhos',
            description: 'Quero entender melhor esse estado e encontrar caminhos',
            icon: '🧭',
            examples: ['Dramas de autodescoberta', 'Documentários inspiradores']
          }
        ];

      default:
        return [
          {
            value: EmotionalIntention.PROCESS,
            title: '🧘‍♀️ Processar',
            description: 'Quero processar esse sentimento',
            icon: '💭',
            examples: ['Filmes reflexivos']
          },
          {
            value: EmotionalIntention.TRANSFORM,
            title: '🌈 Transformar',
            description: 'Quero mudar meu estado emocional',
            icon: '✨',
            examples: ['Filmes inspiradores']
          },
          {
            value: EmotionalIntention.MAINTAIN,
            title: '🎭 Manter',
            description: 'Quero manter esse estado',
            icon: '🌙',
            examples: ['Filmes em sintonia']
          },
          {
            value: EmotionalIntention.EXPLORE,
            title: '🔍 Explorar',
            description: 'Quero explorar esse sentimento',
            icon: '🎨',
            examples: ['Filmes complexos']
          }
        ];
    }
  };

  const intentionOptions = getIntentionOptions(sentimentName);

  const handleContinue = () => {
    if (selectedIntention) {
      onIntentionSelect(selectedIntention);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          py: 4
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
          Você está se sentindo: <strong>{sentimentName}</strong>
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mb: 4, color: 'text.secondary' }}>
          O que você gostaria de fazer com esse sentimento?
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={selectedIntention || ''}
            onChange={(e) => setSelectedIntention(e.target.value as EmotionalIntention)}
          >
            <Grid container spacing={3}>
              {intentionOptions.map((option) => (
                <Grid item xs={12} sm={6} key={option.value}>
                  <Paper
                    sx={{
                      p: 3,
                      cursor: 'pointer',
                      border: selectedIntention === option.value ? 2 : 1,
                      borderColor: selectedIntention === option.value ? 'primary.main' : 'divider',
                      '&:hover': { 
                        bgcolor: 'action.hover',
                        borderColor: 'primary.light'
                      },
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => setSelectedIntention(option.value)}
                  >
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label=""
                      sx={{ m: 0, width: '100%' }}
                    />
                    <Box sx={{ textAlign: 'left', mt: -4, ml: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        {option.icon} {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {option.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Exemplos:</strong> {option.examples.join(', ')}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>

        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            size="large"
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            onClick={handleContinue}
            disabled={!selectedIntention}
            size="large"
          >
            Continuar Jornada
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 2, maxWidth: 600 }}>
          <Typography variant="body2" color="info.dark">
            💡 <strong>Dica:</strong> Não existe escolha certa ou errada. O importante é você ser honesto(a) 
            sobre o que sente neste momento e o que gostaria de experienciar.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default EmotionalIntentionStep; 