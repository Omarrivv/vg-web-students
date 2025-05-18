import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import {
    Table,
    Button,
    Input,
    Select,
    Space,
    Tag,
    Tooltip,
    Card
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    UndoOutlined,
    SearchOutlined,
    UserOutlined,
    IdcardOutlined
} from '@ant-design/icons';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import moment from 'moment';

const { Option } = Select;

const StudentList = ({ onEdit }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: 'A',
        gender: '',
        institutionId: ''
    });
    const [searchText, setSearchText] = useState('');

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getAllStudents();
            setStudents(data);
        } catch (error) {
            showErrorAlert('Error al cargar los estudiantes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await showConfirmDialog(
                '¿Estás seguro?',
                'Esta acción desactivará el estudiante'
            );
            
            if (result.isConfirmed) {
                await studentService.deleteStudent(id);
                showSuccessAlert('Estudiante eliminado correctamente');
                loadStudents();
            }
        } catch (error) {
            showErrorAlert('Error al eliminar el estudiante');
        }
    };

    const handleRestore = async (id) => {
        try {
            const result = await showConfirmDialog(
                '¿Estás seguro?',
                'Esta acción reactivará el estudiante'
            );
            
            if (result.isConfirmed) {
                await studentService.restoreStudent(id);
                showSuccessAlert('Estudiante restaurado correctamente');
                loadStudents();
            }
        } catch (error) {
            showErrorAlert('Error al restaurar el estudiante');
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'firstName',
            key: 'firstName',
            render: (text, record) => (
                <Space>
                    <UserOutlined style={{ color: '#2563eb' }} />
                    <span style={{ fontWeight: 500 }}>{`${record.firstName} ${record.lastName}`}</span>
                </Space>
            ),
        },
        {
            title: 'Documento',
            dataIndex: 'documentNumber',
            key: 'documentNumber',
            render: (text, record) => (
                <Space>
                    <IdcardOutlined style={{ color: '#64748b' }} />
                    <Tooltip title={`${record.documentType}: ${text}`}>
                        <span>{text}</span>
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: 'Género',
            dataIndex: 'gender',
            key: 'gender',
            render: (gender) => (
                <Tag color={gender === 'M' ? '#2563eb' : '#db2777'}>
                    {gender === 'M' ? 'Masculino' : 'Femenino'}
                </Tag>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => (
                <a href={`mailto:${email}`} style={{ color: '#2563eb' }}>
                    {email}
                </a>
            ),
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'A' ? '#22c55e' : '#ef4444'}>
                    {status === 'A' ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Editar">
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => onEdit(record)}
                            type="primary"
                            ghost
                        />
                    </Tooltip>
                    {record.status === 'A' ? (
                        <Tooltip title="Eliminar">
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(record.id)}
                                danger
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Restaurar">
                            <Button
                                icon={<UndoOutlined />}
                                onClick={() => handleRestore(record.id)}
                                type="primary"
                            />
                        </Tooltip>
                    )}
                </Space>
            ),
        },
    ];

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = searchText === '' || 
            student.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
            student.documentNumber.includes(searchText);
        
        const matchesStatus = filters.status === '' || student.status === filters.status;
        const matchesGender = filters.gender === '' || student.gender === filters.gender;
        const matchesInstitution = filters.institutionId === '' || student.institutionId === filters.institutionId;

        return matchesSearch && matchesStatus && matchesGender && matchesInstitution;
    });

    return (
        <Card bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Space wrap>
                    <Input
                        placeholder="Buscar estudiante..."
                        prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Select
                        placeholder="Estado"
                        value={filters.status}
                        onChange={(value) => handleFilterChange('status', value)}
                        style={{ width: 120 }}
                    >
                        <Option value="">Todos</Option>
                        <Option value="A">Activo</Option>
                        <Option value="I">Inactivo</Option>
                    </Select>
                    <Select
                        placeholder="Género"
                        value={filters.gender}
                        onChange={(value) => handleFilterChange('gender', value)}
                        style={{ width: 120 }}
                    >
                        <Option value="">Todos</Option>
                        <Option value="M">Masculino</Option>
                        <Option value="F">Femenino</Option>
                    </Select>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredStudents}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total: ${total} estudiantes`,
                        showQuickJumper: true
                    }}
                />
            </Space>
        </Card>
    );
};

export default StudentList; 