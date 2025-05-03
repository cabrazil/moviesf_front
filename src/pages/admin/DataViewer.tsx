import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';

interface DatabaseData {
  movies: any[];
  mainSentiments: any[];
  journeyFlows: any[];
  journeyStepFlows: any[];
  journeyOptionFlows: any[];
  movieSuggestionFlows: any[];
}

const DataViewer: React.FC = () => {
  const [data, setData] = useState<DatabaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/admin/data');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados do banco');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Visualizador de Dados do Banco
      </Typography>
      
      {data && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Filmes</Typography>
            <pre>{JSON.stringify(data.movies, null, 2)}</pre>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Sentimentos Principais</Typography>
            <pre>{JSON.stringify(data.mainSentiments, null, 2)}</pre>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Fluxos de Jornada</Typography>
            <pre>{JSON.stringify(data.journeyFlows, null, 2)}</pre>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Passos da Jornada</Typography>
            <pre>{JSON.stringify(data.journeyStepFlows, null, 2)}</pre>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Opções da Jornada</Typography>
            <pre>{JSON.stringify(data.journeyOptionFlows, null, 2)}</pre>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Sugestões de Filmes</Typography>
            <pre>{JSON.stringify(data.movieSuggestionFlows, null, 2)}</pre>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default DataViewer; 