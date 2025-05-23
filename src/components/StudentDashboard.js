import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Space, Button, Select, DatePicker, Modal } from 'antd';
import {
    UserOutlined,
    CheckCircleOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const COLORS = ['#1890ff', '#f759ab', '#52c41a', '#ff4d4f', '#722ed1'];

const StudentDashboard = ({ students }) => {
    const [dateRange, setDateRange] = useState(null);
    const [exportModalVisible, setExportModalVisible] = useState(false);
    const [selectedExportType, setSelectedExportType] = useState('all');

    // Calcular estadísticas básicas
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'A').length;
    const inactiveStudents = totalStudents - activeStudents;
    const maleStudents = students.filter(s => s.gender === 'M').length;
    const femaleStudents = students.filter(s => s.gender === 'F').length;

    // Calcular estadísticas avanzadas
    const getAgeFromBirthDate = (birthDate) => {
        return moment().diff(moment(birthDate), 'years');
    };

    const studentsWithAge = students.filter(s => s.birthDate).map(s => ({
        ...s,
        age: getAgeFromBirthDate(s.birthDate)
    }));

    const averageAge = studentsWithAge.length > 0
        ? Math.round(studentsWithAge.reduce((acc, curr) => acc + curr.age, 0) / studentsWithAge.length)
        : 0;

    // Datos para gráficos
    const genderData = [
        { name: 'Masculino', value: maleStudents },
        { name: 'Femenino', value: femaleStudents }
    ];

    const statusData = [
        { name: 'Activos', value: activeStudents },
        { name: 'Inactivos', value: inactiveStudents }
    ];

    const ageRanges = {
        '< 18': studentsWithAge.filter(s => s.age < 18).length,
        '18-25': studentsWithAge.filter(s => s.age >= 18 && s.age <= 25).length,
        '26-35': studentsWithAge.filter(s => s.age >= 26 && s.age <= 35).length,
        '> 35': studentsWithAge.filter(s => s.age > 35).length
    };

    const ageData = Object.entries(ageRanges).map(([range, value]) => ({
        name: range,
        value
    }));

    // Función para exportar datos
    const handleExport = () => {
        let dataToExport = students;
        
        if (dateRange) {
            dataToExport = students.filter(student => {
                const createdAt = moment(student.createdAt);
                return createdAt.isBetween(dateRange[0], dateRange[1], 'day', '[]');
            });
        }

        if (selectedExportType !== 'all') {
            dataToExport = dataToExport.filter(student => student.status === selectedExportType);
        }

        const formattedData = dataToExport.map(student => ({
            'Nombre': `${student.firstName} ${student.lastName}`,
            'DNI': student.dni,
            'Email': student.email,
            'Género': student.gender === 'M' ? 'Masculino' : 'Femenino',
            'Estado': student.status === 'A' ? 'Activo' : 'Inactivo',
            'Fecha de Nacimiento': student.birthDate ? moment(student.birthDate).format('DD/MM/YYYY') : 'No disponible',
            'Edad': student.birthDate ? getAgeFromBirthDate(student.birthDate) : 'No disponible'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Estudiantes');
        XLSX.writeFile(wb, `estudiantes_${moment().format('YYYY-MM-DD')}.xlsx`);
    };

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Estudiantes"
                            value={totalStudents}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Estudiantes Activos"
                            value={activeStudents}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Edad Promedio"
                            value={averageAge}
                            suffix="años"
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Button 
                            type="primary" 
                            icon={<DownloadOutlined />} 
                            onClick={() => setExportModalVisible(true)}
                            style={{ width: '100%' }}
                        >
                            Exportar Datos
                        </Button>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Card title="Distribución por Género">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={genderData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#1890ff" name="Cantidad" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Estado de Estudiantes">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <Card title="Distribución por Edad">
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={ageData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#722ed1" name="Cantidad" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Exportar Datos"
                open={exportModalVisible}
                onCancel={() => setExportModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setExportModalVisible(false)}>
                        Cancelar
                    </Button>,
                    <Button
                        key="excel"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleExport}
                    >
                        Exportar a Excel
                    </Button>
                ]}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <RangePicker
                        style={{ width: '100%' }}
                        onChange={setDateRange}
                        placeholder={['Fecha inicio', 'Fecha fin']}
                    />
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Filtrar por estado"
                        value={selectedExportType}
                        onChange={setSelectedExportType}
                    >
                        <Option value="all">Todos los estudiantes</Option>
                        <Option value="A">Solo activos</Option>
                        <Option value="I">Solo inactivos</Option>
                    </Select>
                </Space>
            </Modal>
        </Space>
    );
};

export default StudentDashboard; 