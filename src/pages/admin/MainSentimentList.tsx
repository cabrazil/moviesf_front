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
  Button,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getMainSentiments } from '../../services/api';
import { MainSentiment } from '../../types/journey';

const MainSentimentList: React.FC = () => {
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('Erro ao carregar sentimentos principais');
      console.error('Erro ao carregar sentimentos principais:', err);
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
        Sentimentos Principais
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Palavras-chave</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mainSentiments.map((sentiment) => (
              <TableRow key={sentiment.id}>
                <TableCell>{sentiment.id}</TableCell>
                <TableCell>{sentiment.name}</TableCell>
                <TableCell>{sentiment.description}</TableCell>
                <TableCell>{sentiment.keywords.join(', ')}</TableCell>
                <TableCell>
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

export default MainSentimentList; 