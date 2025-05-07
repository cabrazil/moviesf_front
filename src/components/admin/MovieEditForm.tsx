import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Space, message, Collapse, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Movie, MovieSentiment, MovieSuggestion, MovieSuggestionFlow } from '../../types';
import api from '../../services/api';

const { Panel } = Collapse;
const { Title } = Typography;

interface MovieEditFormProps {
  movie: Movie;
  onSave: (movie: Movie) => void;
  onCancel: () => void;
}

const MovieEditForm: React.FC<MovieEditFormProps> = ({ movie, onSave, onCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mainSentiments, setMainSentiments] = useState<any[]>([]);
  const [subSentiments, setSubSentiments] = useState<any[]>([]);
  const [emotionalStates, setEmotionalStates] = useState<any[]>([]);
  const [journeyOptions, setJourneyOptions] = useState<any[]>([]);
  const [journeyOptionFlows, setJourneyOptionFlows] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mainSentimentsRes, emotionalStatesRes] = await Promise.all([
          api.get('/main-sentiments'),
          api.get('/emotions/states')
        ]);
        setMainSentiments(mainSentimentsRes.data);
        setEmotionalStates(emotionalStatesRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        message.error('Erro ao carregar dados necessários');
      }
    };
    fetchData();
  }, []);

  const handleMainSentimentChange = async (value: number) => {
    try {
      const response = await api.get(`/main-sentiments/${value}/sub-sentiments`);
      setSubSentiments(response.data);
    } catch (error) {
      console.error('Erro ao carregar sub-sentimentos:', error);
      message.error('Erro ao carregar sub-sentimentos');
    }
  };

  const handleEmotionalStateChange = async (value: number) => {
    try {
      const response = await api.get(`/emotions/states/${value}/journey-options`);
      setJourneyOptions(response.data);
    } catch (error) {
      console.error('Erro ao carregar opções de jornada:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const updatedMovie: Movie = {
        ...movie,
        ...values,
        genres: values.genres || [],
        movieSentiments: values.movieSentiments || [],
        movieSuggestions: values.movieSuggestions || [],
        movieSuggestionFlows: values.movieSuggestionFlows || [],
      };
      await onSave(updatedMovie);
      message.success('Filme atualizado com sucesso!');
    } catch (error) {
      message.error('Erro ao atualizar filme. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const genreOptions = [
    { label: 'Ação', value: 'Ação' },
    { label: 'Aventura', value: 'Aventura' },
    { label: 'Animação', value: 'Animação' },
    { label: 'Biografia', value: 'Biografia' },
    { label: 'Comédia', value: 'Comédia' },
    { label: 'Crime', value: 'Crime' },
    { label: 'Documentário', value: 'Documentário' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Esporte', value: 'Esporte' },
    { label: 'Família', value: 'Família' },
    { label: 'Fantasia', value: 'Fantasia' },
    { label: 'Ficção Científica', value: 'Ficção Científica' },
    { label: 'Guerra', value: 'Guerra' },
    { label: 'História', value: 'História' },
    { label: 'Mistério', value: 'Mistério' },
    { label: 'Musical', value: 'Musical' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Suspense', value: 'Suspense' },
    { label: 'Terror', value: 'Terror' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Western', value: 'Western' }
  ];

  const streamingPlatformOptions = [
    { label: 'Netflix', value: 'Netflix' },
    { label: 'Prime Video', value: 'Prime Video' },
    { label: 'Disney+', value: 'Disney+' },
    { label: 'HBO Max', value: 'HBO Max' },
    { label: 'Apple TV+', value: 'Apple TV+' },
    { label: 'Paramount+', value: 'Paramount+' },
    { label: 'Peacock', value: 'Peacock' },
    { label: 'Hulu', value: 'Hulu' },
    { label: 'YouTube', value: 'YouTube' },
    { label: 'Google Play', value: 'Google Play' },
    { label: 'Apple iTunes', value: 'Apple iTunes' },
    { label: 'Vudu', value: 'Vudu' },
    { label: 'Microsoft Store', value: 'Microsoft Store' }
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        title: movie.title,
        year: movie.year,
        director: movie.director,
        genres: movie.genres,
        description: movie.description,
        thumbnail: movie.thumbnail,
        streamingPlatforms: movie.streamingPlatforms || [],
        movieSentiments: movie.movieSentiments || [],
        movieSuggestions: movie.movieSuggestions || [],
        movieSuggestionFlows: movie.movieSuggestionFlows || [],
      }}
      onFinish={handleSubmit}
    >
      <Title level={4}>Informações Básicas</Title>
      <Form.Item
        name="title"
        label="Título"
        rules={[{ required: true, message: 'Por favor, insira o título do filme' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="year"
        label="Ano"
        rules={[{ required: true, message: 'Por favor, insira o ano do filme' }]}
      >
        <InputNumber min={1900} max={new Date().getFullYear()} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="director"
        label="Diretor"
        rules={[{ required: true, message: 'Por favor, insira o nome do diretor' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="genres"
        label="Gêneros"
        rules={[{ required: true, message: 'Por favor, selecione pelo menos um gênero' }]}
      >
        <Select
          mode="multiple"
          placeholder="Selecione os gêneros"
          options={genreOptions}
        />
      </Form.Item>

      <Form.Item
        name="streamingPlatforms"
        label="Plataformas de Streaming"
      >
        <Select
          mode="multiple"
          placeholder="Selecione as plataformas"
          options={streamingPlatformOptions}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Descrição"
        rules={[{ required: true, message: 'Por favor, insira uma descrição' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="thumbnail"
        label="URL da Imagem"
        rules={[{ required: true, message: 'Por favor, insira a URL da imagem' }]}
      >
        <Input />
      </Form.Item>

      <Collapse>
        <Panel header="Sentimentos do Filme" key="1">
          <Form.List name="movieSentiments">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'mainSentimentId']}
                      rules={[{ required: true, message: 'Selecione o sentimento principal' }]}
                    >
                      <Select
                        placeholder="Sentimento Principal"
                        style={{ width: 200 }}
                        options={mainSentiments.map(s => ({ label: s.name, value: s.id }))}
                        onChange={handleMainSentimentChange}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'subSentimentId']}
                      rules={[{ required: true, message: 'Selecione o sub-sentimento' }]}
                    >
                      <Select
                        placeholder="Sub-sentimento"
                        style={{ width: 200 }}
                        options={subSentiments.map(s => ({ label: s.name, value: s.id }))}
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Adicionar Sentimento
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Panel>

        <Panel header="Sugestões de Filme" key="2">
          <Form.List name="movieSuggestions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'emotionalStateId']}
                      rules={[{ required: true, message: 'Selecione o estado emocional' }]}
                    >
                      <Select
                        placeholder="Estado Emocional"
                        style={{ width: 200 }}
                        options={emotionalStates.map(s => ({ label: s.name, value: s.id }))}
                        onChange={handleEmotionalStateChange}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'journeyOptionId']}
                      rules={[{ required: true, message: 'Selecione a opção de jornada' }]}
                    >
                      <Select
                        placeholder="Opção de Jornada"
                        style={{ width: 200 }}
                        options={journeyOptions.map(o => ({ label: o.text, value: o.id }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'reason']}
                      rules={[{ required: true, message: 'Insira o motivo' }]}
                    >
                      <Input placeholder="Motivo" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'relevance']}
                      rules={[{ required: true, message: 'Insira a relevância' }]}
                    >
                      <InputNumber min={1} max={10} placeholder="Relevância" style={{ width: 100 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Adicionar Sugestão
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Panel>

        <Panel header="Fluxos de Sugestão" key="3">
          <Form.List name="movieSuggestionFlows">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'journeyOptionFlowId']}
                      rules={[{ required: true, message: 'Selecione o fluxo de opção' }]}
                    >
                      <Select
                        placeholder="Fluxo de Opção"
                        style={{ width: 200 }}
                        options={journeyOptionFlows.map(f => ({ label: f.text, value: f.id }))}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'reason']}
                      rules={[{ required: true, message: 'Insira o motivo' }]}
                    >
                      <Input placeholder="Motivo" style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'relevance']}
                      rules={[{ required: true, message: 'Insira a relevância' }]}
                    >
                      <InputNumber min={1} max={10} placeholder="Relevância" style={{ width: 100 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Adicionar Fluxo de Sugestão
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Panel>
      </Collapse>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Salvar
          </Button>
          <Button onClick={onCancel}>
            Cancelar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MovieEditForm; 