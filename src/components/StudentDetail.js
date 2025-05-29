import React from 'react';
import { 
  Card,
  Typography,
  Row,
  Col,
  Avatar,
  Space,
  Tag,
  Divider,
  Descriptions
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const StudentDetail = ({ student }) => {
  const fullName = `${student?.firstName || ''} ${student?.lastName || ''}`;
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8} style={{ textAlign: 'center' }}>
          <Avatar
            size={150}
            style={{ backgroundColor: '#4CAF50' }}
            icon={<UserOutlined />}
          >
            {fullName.charAt(0)}
          </Avatar>
        </Col>
        
        <Col xs={24} md={16}>
          <Title level={3}>{fullName}</Title>
          
          <Space wrap style={{ marginBottom: 16 }}>
            <Tag color="blue" icon={<IdcardOutlined />}>
              {student?.documentType}: {student?.documentNumber}
            </Tag>
            <Tag color="purple" icon={<UserOutlined />}>
              {student?.gender === 'M' ? 'Masculino' : 'Femenino'}
            </Tag>
            <Tag color={student?.status === 'A' ? 'success' : 'error'}>
              {student?.status === 'A' ? 'Activo' : 'Inactivo'}
            </Tag>
          </Space>

          <Divider />

          <Descriptions column={1} size="small">
            <Descriptions.Item 
              label={<Space><CalendarOutlined /> Fecha de Nacimiento</Space>}
            >
              {formatDate(student?.birthDate)}
            </Descriptions.Item>

            <Descriptions.Item 
              label={<Space><MailOutlined /> Email</Space>}
            >
              {student?.email || 'No especificado'}
            </Descriptions.Item>

            <Descriptions.Item 
              label={<Space><PhoneOutlined /> Teléfono</Space>}
            >
              {student?.phone || 'No especificado'}
            </Descriptions.Item>

            <Descriptions.Item 
              label={<Space><HomeOutlined /> Dirección</Space>}
            >
              {student?.address || 'No especificado'}
            </Descriptions.Item>

            <Descriptions.Item 
              label={<Space><IdcardOutlined /> Código QR</Space>}
            >
              {student?.nameQr || 'No especificado'}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default StudentDetail; 