import React, { useState, useEffect } from 'react';
import { enrollmentService } from '../services/enrollmentService';
import { studentService } from '../services/studentService';
import {
    Table,
    Button,
    Select,
    Space,
    Tag,
    Tooltip,
    Card,
    DatePicker,
    Avatar
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    UndoOutlined,
    BookOutlined,
    UserOutlined,
    CalendarOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import moment from 'moment';
import StudentDetailModal from './StudentDetailModal';

const { Option } = Select;

const EnrollmentList = ({ onEdit }) => {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        status: 'A',
        year: moment().format('YYYY'),
        period: ''
    });

    const loadStudents = async (studentIds) => {
        try {
            setLoadingStudents(true);
            const uniqueIds = [...new Set(studentIds)];
            const studentsData = {};
            
            // Obtener los datos de cada estudiante individualmente para asegurar datos completos
            for (const id of uniqueIds) {
                try {
                    const student = await studentService.getStudentById(id);
                    if (student && student.documentNumber) {
                        studentsData[id] = {
                            ...student,
                            dni: student.documentNumber // Aseguramos que el DNI esté presente
                        };
                    } else {
                        // Si no hay documentNumber, intentamos con dni
                        studentsData[id] = student;
                    }
                } catch (error) {
                    console.error(`Error al cargar estudiante ${id}:`, error);
                }
            }
            
            setStudents(studentsData);
        } catch (error) {
            console.error('Error al cargar estudiantes:', error);
            showErrorAlert('Error al cargar los datos de los estudiantes');
        } finally {
            setLoadingStudents(false);
        }
    };

    const loadEnrollments = async () => {
        try {
            setLoading(true);
            const data = await enrollmentService.getAllEnrollments();
            
            if (data && data.length > 0) {
                setEnrollments(data);
                const studentIds = data.map(enrollment => enrollment.studentId);
                await loadStudents(studentIds);
            } else {
                setEnrollments([]);
            }
        } catch (error) {
            console.error('Error al cargar matrículas:', error);
            showErrorAlert('Error al cargar las matrículas');
            setEnrollments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEnrollments();
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await showConfirmDialog(
                '¿Estás seguro?',
                'Esta acción desactivará la matrícula'
            );
            
            if (result.isConfirmed) {
                await enrollmentService.deleteEnrollment(id);
                showSuccessAlert('Matrícula eliminada correctamente');
                loadEnrollments();
            }
        } catch (error) {
            showErrorAlert('Error al eliminar la matrícula');
        }
    };

    const handleRestore = async (id) => {
        try {
            const result = await showConfirmDialog(
                '¿Estás seguro?',
                'Esta acción reactivará la matrícula'
            );
            
            if (result.isConfirmed) {
                await enrollmentService.restoreEnrollment(id);
                showSuccessAlert('Matrícula restaurada correctamente');
                loadEnrollments();
            }
        } catch (error) {
            showErrorAlert('Error al restaurar la matrícula');
        }
    };

    const handleViewDetail = (studentId) => {
        setSelectedStudent(students[studentId]);
        setIsDetailModalVisible(true);
    };

    const columns = [
        {
            title: 'ID Aula',
            dataIndex: 'classroomId',
            key: 'classroomId',
            render: (text) => (
                <Space>
                    <BookOutlined style={{ color: '#2563eb' }} />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Estudiante',
            dataIndex: 'studentId',
            key: 'studentId',
            render: (studentId) => {
                const student = students[studentId];
                
                if (!student) {
                    return (
                        <Space>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#d9d9d9' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 500 }}>Cargando...</span>
                                <span style={{ fontSize: '12px', color: '#64748b' }}>
                                    Obteniendo datos...
                                </span>
                            </div>
                        </Space>
                    );
                }

                // Intentar obtener el DNI de diferentes propiedades posibles
                const documentNumber = student.documentNumber || student.dni || student.document;
                
                return (
                    <Space>
                        <Avatar 
                            icon={<UserOutlined />} 
                            style={{ 
                                backgroundColor: documentNumber ? '#1890ff' : '#ff4d4f'
                            }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 500 }}>
                                {student.firstName} {student.lastName}
                            </span>
                            <span style={{ 
                                fontSize: '12px', 
                                color: documentNumber ? '#1890ff' : '#ff4d4f',
                                fontWeight: '500'
                            }}>
                                {documentNumber ? `DNI: ${documentNumber}` : 'DNI no disponible'}
                            </span>
                        </div>
                    </Space>
                );
            },
            width: '30%',
        },
        {
            title: 'Fecha de Matrícula',
            dataIndex: 'enrollmentDate',
            key: 'enrollmentDate',
            render: (date) => (
                <Space>
                    <CalendarOutlined style={{ color: '#0891b2' }} />
                    <span>{moment(date).format('DD/MM/YYYY')}</span>
                </Space>
            ),
        },
        {
            title: 'Año',
            dataIndex: 'enrollmentYear',
            key: 'enrollmentYear',
            render: (year) => (
                <Tag color="#4f46e5">{year}</Tag>
            ),
        },
        {
            title: 'Periodo',
            dataIndex: 'enrollmentPeriod',
            key: 'enrollmentPeriod',
            render: (period) => (
                <Tag color="#0d9488">{period}</Tag>
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
                    <Tooltip title="Ver Detalle">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(record.studentId)}
                            style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', color: 'white' }}
                        />
                    </Tooltip>
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

    const currentYear = moment().year();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const filteredEnrollments = enrollments.filter(enrollment => {
        const matchesStatus = filters.status === '' || enrollment.status === filters.status;
        const matchesYear = filters.year === '' || enrollment.enrollmentYear === filters.year;
        const matchesPeriod = filters.period === '' || enrollment.enrollmentPeriod === filters.period;

        return matchesStatus && matchesYear && matchesPeriod;
    });

    return (
        <Card bordered={false} className="enrollment-list-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Space wrap className="filter-container">
                    <Select
                        placeholder="Estado"
                        value={filters.status}
                        onChange={(value) => handleFilterChange('status', value)}
                        style={{ width: 120 }}
                        className="filter-select"
                    >
                        <Option value="">Todos</Option>
                        <Option value="A">Activo</Option>
                        <Option value="I">Inactivo</Option>
                    </Select>
                    <Select
                        placeholder="Año"
                        value={filters.year}
                        onChange={(value) => handleFilterChange('year', value)}
                        style={{ width: 120 }}
                        className="filter-select"
                    >
                        <Option value="">Todos</Option>
                        {years.map(year => (
                            <Option key={year} value={year.toString()}>{year}</Option>
                        ))}
                    </Select>
                    <Select
                        placeholder="Periodo"
                        value={filters.period}
                        onChange={(value) => handleFilterChange('period', value)}
                        style={{ width: 120 }}
                        className="filter-select"
                    >
                        <Option value="">Todos</Option>
                        {years.map(year => (
                            <React.Fragment key={year}>
                                <Option value={`${year}-1`}>{year}-1</Option>
                                <Option value={`${year}-2`}>{year}-2</Option>
                            </React.Fragment>
                        ))}
                    </Select>
                </Space>

                <Table
                    columns={columns}
                    dataSource={filteredEnrollments}
                    loading={loading || loadingStudents}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total: ${total} matrículas`,
                        showQuickJumper: true
                    }}
                    className="enrollment-table"
                />
            </Space>
            <StudentDetailModal
                student={selectedStudent}
                visible={isDetailModalVisible}
                onClose={() => setIsDetailModalVisible(false)}
            />
        </Card>
    );
};

export default EnrollmentList; 