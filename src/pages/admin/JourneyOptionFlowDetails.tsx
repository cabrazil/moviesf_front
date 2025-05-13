import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  Button,
} from '@mui/material';
import api from '../../services/api';

interface MovieSuggestion {
  id: number;
  movie: {
    title: string;
  };
  reason: string;
}

interface JourneyOptionFlow {
  id: number;
  journeyStepFlowId: number;
  optionId: string;
  text: string;
  nextStepId: string | null;
  isEndState: boolean;
  journeyStepFlow: {
    id: number;
    question: string;
    journeyFlow: {
      id: number;
      mainSentiment: {
        id: number;
        name: string;
        description: string;
      };
    };
  };
  movieSuggestions: MovieSuggestion[];
}

const JourneyOptionFlowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<JourneyOptionFlow | null>(null);
  const [searchId, setSearchId] = useState(id || '');

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  const fetchDetails = async (flowId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/journey-option-flows/${flowId}`);
      setDetails(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar detalhes do fluxo de opção');
      console.error('Erro ao carregar detalhes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId) {
      navigate(`/admin/journey-option-flows/${searchId}`);
    }
  };

  if (!id) {
    return (
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Buscar Detalhes do Fluxo de Opção
        </Typography>
        <form onSubmit={handleSearch}>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              label="ID do Fluxo de Opção"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              type="number"
              required
              helperText="Informe o ID do registro na tabela JourneyOptionFlow"
            />
            <Button type="submit" variant="contained" color="primary">
              Buscar
            </Button>
          </Box>
        </form>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/admin/journey-option-flows')}
          sx={{ mt: 2 }}
        >
          Voltar para Busca
        </Button>
      </Box>
    );
  }

  if (!details) {
    return (
      <Box p={3}>
        <Typography>Nenhum detalhe encontrado</Typography>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/admin/journey-option-flows')}
          sx={{ mt: 2 }}
        >
          Voltar para Busca
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Detalhes do Fluxo de Opção
      </Typography>

      {/* Informações do Sentimento Principal */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sentimento Principal
          </Typography>
          <Typography><strong>Nome:</strong> {details.journeyStepFlow.journeyFlow.mainSentiment.name}</Typography>
          <Typography><strong>Descrição:</strong> {details.journeyStepFlow.journeyFlow.mainSentiment.description}</Typography>
        </CardContent>
      </Card>

      {/* Informações do Passo */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Passo da Jornada
          </Typography>
          <Typography><strong>ID do Passo:</strong> {details.journeyStepFlowId}</Typography>
          <Typography><strong>Pergunta:</strong> {details.journeyStepFlow.question}</Typography>
        </CardContent>
      </Card>

      {/* Informações da Opção */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Opção
          </Typography>
          <Typography><strong>ID:</strong> {details.id}</Typography>
          <Typography><strong>ID da Opção:</strong> {details.optionId}</Typography>
          <Typography><strong>Texto:</strong> {details.text}</Typography>
          <Typography><strong>Próximo Passo:</strong> {details.nextStepId || 'N/A'}</Typography>
          <Typography><strong>Estado Final:</strong> {details.isEndState ? 'Sim' : 'Não'}</Typography>
        </CardContent>
      </Card>

      {/* Sugestões de Filmes */}
      {details.movieSuggestions.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Sugestões de Filmes
            </Typography>
            {details.movieSuggestions.map((suggestion) => (
              <Box key={suggestion.id} mb={2}>
                <Typography>
                  <strong>Filme:</strong> {suggestion.movie.title}
                </Typography>
                <Typography variant="body2" color="primary">
                  <strong>Motivo:</strong> {suggestion.reason}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      <Button 
        variant="outlined" 
        onClick={() => navigate('/admin/journey-option-flows')}
        sx={{ mt: 3 }}
      >
        Voltar para Busca
      </Button>
    </Box>
  );
};

export default JourneyOptionFlowDetails; 