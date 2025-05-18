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
        try {
            if (editingItem) {
                await enrollmentService.updateEnrollment(editingItem.id, values);
                message.success('Matrícula actualizada correctamente');
            } else {
                await enrollmentService.createEnrollment(values);
                message.success('Matrícula creada correctamente');
            }
            handleCancel();
        } catch (error) {
            message.error('Error al guardar la matrícula');
        }
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
            <Sider width={200} style={{ background: 'transparent' }}>
                <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h2 style={{ color: '#ffffff', margin: 0 }}>Sistema PRS</h2>
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    style={{ height: 'calc(100% - 64px)' }}
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
                <Content style={{ padding: '24px', minHeight: '100vh' }}>
                    <div className="site-layout-background" style={{ padding: 24 }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
            <Modal
                title={modalContent === 'student' ? 'Estudiante' : 'Matrícula'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                className="dark-modal"
            >
                {renderModalContent()}
            </Modal>
        </Layout>
    );
}

export default App;
