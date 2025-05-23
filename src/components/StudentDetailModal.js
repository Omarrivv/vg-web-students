import React from 'react';
import { Modal, Descriptions, Tag, Avatar } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, IdcardOutlined } from '@ant-design/icons';
import moment from 'moment';

const StudentDetailModal = ({ student, visible, onClose }) => {
    if (!student) return null;

    const getAge = (birthDate) => {
        if (!birthDate) return 'No disponible';
        return moment().diff(moment(birthDate), 'years');
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <span>Detalles del Estudiante</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Descriptions
                bordered
                column={2}
                layout="vertical"
                style={{ marginTop: '20px' }}
            >
                <Descriptions.Item label="Nombre Completo" span={2}>
                    <strong>{`${student.firstName || ''} ${student.lastName || ''}`}</strong>
                </Descriptions.Item>

                <Descriptions.Item label={<><IdcardOutlined /> DNI</>}>
                    {student.dni || 'No disponible'}
                </Descriptions.Item>

                <Descriptions.Item label="ID del Sistema">
                    <Tag color="blue">{student.id}</Tag>
                </Descriptions.Item>

                <Descriptions.Item label={<><MailOutlined /> Correo Electrónico</>}>
                    {student.email || 'No disponible'}
                </Descriptions.Item>

                <Descriptions.Item label={<><PhoneOutlined /> Teléfono</>}>
                    {student.phone || 'No disponible'}
                </Descriptions.Item>

                <Descriptions.Item label={<><CalendarOutlined /> Fecha de Nacimiento</>}>
                    {student.birthDate ? (
                        <>
                            {moment(student.birthDate).format('DD/MM/YYYY')}
                            <Tag color="green" style={{ marginLeft: '8px' }}>
                                {getAge(student.birthDate)} años
                            </Tag>
                        </>
                    ) : (
                        'No disponible'
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Género">
                    <Tag color={student.gender === 'M' ? 'blue' : 'pink'}>
                        {student.gender === 'M' ? 'Masculino' : 'Femenino'}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Dirección" span={2}>
                    {student.address || 'No disponible'}
                </Descriptions.Item>

                <Descriptions.Item label="Estado">
                    <Tag color={student.status === 'A' ? 'success' : 'error'}>
                        {student.status === 'A' ? 'Activo' : 'Inactivo'}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Fecha de Registro">
                    {student.createdAt ? moment(student.createdAt).format('DD/MM/YYYY HH:mm:ss') : 'No disponible'}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default StudentDetailModal; 