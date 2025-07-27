
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message, 
  Popconfirm,
  Typography,
  Tag,
  Select
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { MainSentiment, SubSentiment, sentimentsService } from '../../services/sentiments.service';

const { Title } = Typography;
const { TextArea } = Input;

export function SentimentsList() {
  const [mainSentiments, setMainSentiments] = useState<MainSentiment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingRecord, setEditingRecord] = useState<{
    type: 'main' | 'sub';
    record: Partial<MainSentiment | SubSentiment>;
    mainSentimentId?: number;
  } | null>(null);

  useEffect(() => {
    fetchSentiments();
  }, []);

  const fetchSentiments = async () => {
    try {
      setLoading(true);
      const data = await sentimentsService.getAllSentiments();
      setMainSentiments(data);
    } catch (error) {
      message.error('Erro ao carregar os sentimentos');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (type: 'main' | 'sub', mainSentimentId?: number) => {
    setEditingRecord({ type, record: {}, mainSentimentId });
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (type: 'main' | 'sub', record: MainSentiment | SubSentiment, mainSentimentId?: number) => {
    setEditingRecord({ type, record, mainSentimentId });
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      keywords: record.keywords
    });
    setModalVisible(true);
  };

  const handleDelete = async (type: 'main' | 'sub', id: number) => {
    try {
      if (type === 'main') {
        await sentimentsService.deleteMainSentiment(id);
      } else {
        await sentimentsService.deleteSubSentiment(id);
      }
      message.success('Item excluído com sucesso');
      fetchSentiments();
    } catch (error) {
      message.error('Erro ao excluir o item');
    }
  };

  const handleSave = async (values: any) => {
    if (!editingRecord) return;

    try {
      const { type, record, mainSentimentId } = editingRecord;
      
      if (type === 'main') {
        if (record.id) {
          await sentimentsService.updateMainSentiment(record.id, values);
        } else {
          await sentimentsService.createMainSentiment(values);
        }
      } else {
        const data = { ...values, mainSentimentId };
        if (record.id) {
          await sentimentsService.updateSubSentiment(record.id, data);
        } else {
          await sentimentsService.createSubSentiment(data);
        }
      }

      message.success('Operação realizada com sucesso');
      setModalVisible(false);
      form.resetFields();
      fetchSentiments();
    } catch (error) {
      message.error('Erro ao salvar');
    }
  };

  const columns = [
    {
      title: 'Sentimento Principal',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string, record: MainSentiment) => (
        <div style={{ padding: '16px 0' }}>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>{text}</div>
          {record.description && (
            <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginTop: '8px' }}>{record.description}</div>
          )}
          <div style={{ marginTop: '8px' }}>
            {record.keywords.map(keyword => (
              <Tag key={keyword} color="blue" style={{ marginRight: '8px', marginBottom: '8px' }}>
                {keyword}
              </Tag>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Sub-sentimentos',
      dataIndex: 'subSentiments',
      key: 'subSentiments',
      width: '60%',
      render: (subSentiments: SubSentiment[], record: MainSentiment) => (
        <div style={{ padding: '16px 0' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px',
            marginBottom: '16px' 
          }}>
            {subSentiments.map(sub => (
              <div 
                key={sub.id} 
                style={{
                  flex: '1 1 calc(50% - 16px)',
                  minWidth: '300px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '16px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{sub.name}</div>
                    {sub.description && (
                      <div style={{ 
                        color: 'rgba(0, 0, 0, 0.45)',
                        marginTop: '4px',
                        fontSize: '12px'
                      }}>
                        {sub.description}
                      </div>
                    )}
                    <div style={{ marginTop: '8px' }}>
                      {sub.keywords.map(keyword => (
                        <Tag 
                          key={keyword} 
                          color="green" 
                          style={{ marginRight: '4px', marginBottom: '4px' }}
                        >
                          {keyword}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit('sub', sub, record.id)}
                    />
                    <Popconfirm
                      title="Tem certeza que deseja excluir?"
                      onConfirm={() => handleDelete('sub', sub.id)}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </Space>
                </div>
              </div>
            ))}
          </div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => handleAdd('sub', record.id)}
            style={{ width: '100%' }}
          >
            Adicionar Sub-sentimento
          </Button>
        </div>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: '10%',
      align: 'center' as const,
      render: (_: unknown, record: MainSentiment) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit('main', record)}
          />
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => handleDelete('main', record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      width: '100%', 
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        width: '100%'
      }}>
        <Title level={2} style={{ margin: 0 }}>Gerenciamento de Sentimentos</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleAdd('main')}
        >
          Novo Sentimento
        </Button>
      </div>

      <div style={{ flex: 1, width: '100%' }}>
        <Table
          dataSource={mainSentiments}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          style={{ width: '100%' }}
        />
      </div>

      <Modal
        title={`${editingRecord?.record.id ? 'Editar' : 'Novo'} ${
          editingRecord?.type === 'main' ? 'Sentimento' : 'Sub-sentimento'
        }`}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingRecord(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="keywords"
            label="Palavras-chave"
            rules={[{ required: true, message: 'Por favor, insira ao menos uma palavra-chave' }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Insira as palavras-chave"
              tokenSeparators={[',']}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 