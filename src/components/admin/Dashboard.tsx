import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { HeartOutlined, DatabaseOutlined, UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Total de Sentimentos"
              value={12}
              prefix={<HeartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Sub-sentimentos"
              value={45}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Usuários Ativos"
              value={156}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Atividades Recentes">
            <p>Nenhuma atividade recente</p>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Estatísticas">
            <p>Em breve...</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 