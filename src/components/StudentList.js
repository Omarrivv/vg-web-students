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
    Card,
    Tabs,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Modal
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    UndoOutlined,
    SearchOutlined,
    FilterOutlined,
    BarChartOutlined,
    Visibility as VisibilityIcon,
    Add as AddIcon,
    EyeOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import StudentDashboard from './StudentDashboard';
import StudentDetail from './StudentDetail';

const { Option } = Select;
const { TabPane } = Tabs;

const StudentList = ({ onEdit }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
    });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);

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

    const handleViewDetail = (student) => {
        setSelectedStudent(student);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelectedStudent(null);
    };

    const filteredStudents = students.filter(student => {
        const searchLower = filters.search.toLowerCase();
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        const documentInfo = `${student.documentType}${student.documentNumber}`.toLowerCase();
        return fullName.includes(searchLower) || documentInfo.includes(searchLower);
    });

    const columns = [
        {
            title: 'Nombre Completo',
            key: 'fullName',
            sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
            render: (_, record) => `${record.firstName} ${record.lastName}`,
        },
        {
            title: 'Documento',
            key: 'document',
            render: (_, record) => `${record.documentType}: ${record.documentNumber}`,
        },
        {
            title: 'Género',
            key: 'gender',
            render: (_, record) => (
                <Tag color={record.gender === 'M' ? '#1890ff' : '#ff69b4'}>
                    {record.gender === 'M' ? 'Masculino' : 'Femenino'}
                </Tag>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Teléfono',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Estado',
            key: 'status',
            render: (_, record) => (
                <Tag color={record.status === 'A' ? '#52c41a' : '#ff4d4f'}>
                    {record.status === 'A' ? 'Activo' : 'Inactivo'}
                </Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        className="action-button edit"
                    />
                    <Button
                        type={record.status === 'A' ? 'default' : 'primary'}
                        danger={record.status === 'A'}
                        icon={record.status === 'A' ? <DeleteOutlined /> : <UndoOutlined />}
                        onClick={() => record.status === 'A' ? handleDelete(record._id) : handleRestore(record._id)}
                        className="action-button"
                    />
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                        className="action-button view"
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="student-list-container">
            <Card bordered={false}>
                <Tabs defaultActiveKey="list">
                    <TabPane 
                        tab={<span><FilterOutlined />Lista y Filtros</span>}
                        key="list"
                    >
                        <div className="table-header">
                            <div className="search-container">
                                <Input
                                    placeholder="Buscar por nombre o documento..."
                                    prefix={<SearchOutlined />}
                                    value={filters.search}
                                    onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="search-input"
                                />
                            </div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => onEdit(null)}
                                className="add-button"
                            >
                                Agregar Estudiante
                            </Button>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={filteredStudents}
                            loading={loading}
                            rowKey="_id"
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: total => `Total: ${total} estudiantes`,
                                showQuickJumper: true
                            }}
                            className="students-table"
                        />
                    </TabPane>
                    <TabPane 
                        tab={<span><BarChartOutlined />Dashboard</span>}
                        key="dashboard"
                    >
                        <StudentDashboard students={students} />
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                open={openDetail}
                onCancel={handleCloseDetail}
                width={800}
                footer={null}
                title="Detalle del Estudiante"
            >
                {selectedStudent && <StudentDetail student={selectedStudent} />}
            </Modal>

            <style jsx="true">{`
                .student-list-container {
                    padding: 24px;
                }
                .table-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .search-container {
                    flex: 1;
                    max-width: 300px;
                }
                .search-input {
                    width: 100%;
                }
                .add-button {
                    margin-left: 16px;
                }
                .students-table {
                    background: white;
                    border-radius: 8px;
                }
                .action-button {
                    border-radius: 4px;
                }
                .action-button.edit {
                    background-color: #1890ff;
                }
                .action-button.view {
                    background-color: #52c41a;
                }
                :global(.ant-table-thead > tr > th) {
                    background: #fafafa;
                    font-weight: 600;
                }
                :global(.ant-card) {
                    border-radius: 8px;
                }
                :global(.ant-table-pagination) {
                    margin: 16px 0;
                }
            `}</style>
        </div>
    );
};

export default StudentList; 