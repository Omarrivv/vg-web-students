import React, { useState } from 'react';
import { Layout, Menu, Button, Modal, message } from 'antd';
import {
    UserOutlined,
    BookOutlined,
    PlusOutlined
} from '@ant-design/icons';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import EnrollmentList from './components/EnrollmentList';
import EnrollmentForm from './components/EnrollmentForm';
import { studentService } from './services/studentService';
import { enrollmentService } from './services/enrollmentService';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
    const [selectedKey, setSelectedKey] = useState('1');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    const showModal = (content, item = null) => {
        setEditingItem(item);
        setModalContent(content);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingItem(null);
        setModalContent(null);
    };

    const handleStudentSubmit = async (values) => {
        try {
            if (editingItem) {
                await studentService.updateStudent(editingItem.id, values);
                message.success('Estudiante actualizado correctamente');
            } else {
                await studentService.createStudent(values);
                message.success('Estudiante creado correctamente');
            }
            handleCancel();
        } catch (error) {
            message.error('Error al guardar el estudiante');
        }
    };

    const handleEnrollmentSubmit = async (values) => {
        if (editingItem) {
            await enrollmentService.updateEnrollment(editingItem.id, values);
        } else {
            await enrollmentService.createEnrollment(values);
        }
        handleCancel();
    };

    const renderContent = () => {
        switch (selectedKey) {
            case '1':
                return (
                    <>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal('student')}
                            style={{ marginBottom: 16 }}
                        >
                            Nuevo Estudiante
                        </Button>
                        <StudentList onEdit={(student) => showModal('student', student)} />
                    </>
                );
            case '2':
                return (
                    <>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal('enrollment')}
                            style={{ marginBottom: 16 }}
                        >
                            Nueva Matrícula
                        </Button>
                        <EnrollmentList onEdit={(enrollment) => showModal('enrollment', enrollment)} />
                    </>
                );
            default:
                return null;
        }
    };

    const renderModalContent = () => {
        switch (modalContent) {
            case 'student':
                return (
                    <StudentForm
                        initialValues={editingItem}
                        onSubmit={handleStudentSubmit}
                        onCancel={handleCancel}
                    />
                );
            case 'enrollment':
                return (
                    <EnrollmentForm
                        initialValues={editingItem}
                        onSubmit={handleEnrollmentSubmit}
                        onCancel={handleCancel}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider width={220} style={{
                background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
                boxShadow: '2px 0 8px #e5e7eb'
            }}>
                <div style={{
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <img src="/comentario.png" alt="Logo" style={{ width: 40, marginBottom: 8 }} />
                    <h2 style={{ color: '#374151', margin: 0, fontWeight: 700, fontSize: 20 }}>Sistema PRS</h2>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ height: 'calc(100% - 80px)', borderRight: 0, fontSize: 16 }}
                    onSelect={({ key }) => setSelectedKey(key)}
                >
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        Estudiantes
                    </Menu.Item>
                    <Menu.Item key="2" icon={<BookOutlined />}>
                        Matrículas
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{ padding: '32px', minHeight: '100vh', background: '#f8fafc' }}>
                    <div className="site-layout-background card" style={{ padding: 32, borderRadius: 16, boxShadow: '0 4px 24px #e5e7eb' }}>
                        <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>
                            {selectedKey === '1' ? 'Listado de Estudiantes' : 'Listado de Matrículas'}
                        </h1>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
            <Modal
                title={
                    <span>
                        {modalContent === 'student' ? <UserOutlined /> : <BookOutlined />}
                        <span style={{ marginLeft: 8 }}>{modalContent === 'student' ? 'Estudiante' : 'Matrícula'}</span>
                    </span>
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                className="dark-modal"
                style={{ borderRadius: 16 }}
            >
                {renderModalContent()}
            </Modal>
        </Layout>
    );
}

export default App;
