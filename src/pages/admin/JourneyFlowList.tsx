import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { getMainSentiments } from '../../services/api';
import { MainSentiment } from '../../services/api';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const JourneyFlowList: React.FC = () => {
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMainSentiments();
  }, []);

  const loadMainSentiments = async () => {
    try {
      setLoading(true);
      const data = await getMainSentiments();
      setMainSentiments(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar fluxos de jornada');
      console.error('Erro ao carregar fluxos de jornada:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Fluxos de Jornada
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sentimento Principal</TableCell>
              <TableCell>Número de Passos</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainSentiments.map((sentiment) => (
              <TableRow key={sentiment.id}>
                <TableCell>{sentiment.id}</TableCell>
                <TableCell>{sentiment.name}</TableCell>
                <TableCell>{sentiment.journeyFlow?.steps?.length || 0}</TableCell>
                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to="/admin/journey-option-flows"
                    color="primary"
                    size="small"
                    onClick={() => navigate('/admin/journey-option-flows')}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JourneyFlowList; 