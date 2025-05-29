import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col, Tooltip } from 'antd';
import { BookOutlined, UserOutlined, CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { studentService } from '../services/studentService';

const { Option } = Select;

const EnrollmentForm = ({ initialValues, onSubmit, onCancel }) => {
    const [form] = Form.useForm();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                enrollmentDate: initialValues.enrollmentDate ? moment(initialValues.enrollmentDate) : null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    // Cargar estudiantes al montar el componente
    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setLoading(true);
            const data = await studentService.getAllStudents();
            setStudents(data.filter(student => student.status === 'A')); // Solo estudiantes activos
        } catch (error) {
            showErrorAlert('Error al cargar la lista de estudiantes');
        } finally {
            setLoading(false);
        }
    };

    // Función para determinar el periodo basado en la fecha
    const determineEnrollmentPeriod = (date) => {
        if (!date) return null;
        const month = date.month() + 1; // moment months son 0-based
        const year = date.year();
        return month >= 1 && month <= 6 ? `${year}-1` : `${year}-2`;
    };

    // Manejador para cuando cambia la fecha de matrícula
    const handleDateChange = (date) => {
        if (date) {
            const year = date.year().toString();
            const period = determineEnrollmentPeriod(date);
            
            // Actualizar los campos de año y periodo
            form.setFieldsValue({
                enrollmentYear: year,
                enrollmentPeriod: period
            });
        } else {
            // Si se limpia la fecha, limpiar también año y periodo
            form.setFieldsValue({
                enrollmentYear: undefined,
                enrollmentPeriod: undefined
            });
        }
    };

    const handleSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values,
                enrollmentDate: values.enrollmentDate.format('YYYY-MM-DD'),
                status: 'A'
            };
            await onSubmit(formattedValues);
            form.resetFields();
            showSuccessAlert('Matrícula guardada correctamente');
        } catch (error) {
            if (error.response && error.response.status === 409) {
                showErrorAlert('El estudiante ya tiene una matrícula activa. No se puede crear una nueva.');
            } else {
                showErrorAlert('Error al guardar la matrícula. Intenta nuevamente.');
            }
        }
    };

    const currentYear = moment().year();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // 2 años atrás hasta 2 años adelante

    const filterStudents = (input, option) => {
        const searchTerm = input.toLowerCase();
        return (
            option.children.toLowerCase().includes(searchTerm) ||
            option.value.toLowerCase().includes(searchTerm)
        );
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="enrollment-form"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="classroomId"
                        label="ID de Aula"
                        rules={[
                            { required: true, message: 'Por favor ingrese el ID del aula' },
                            { pattern: /^\d+$/, message: 'El ID del aula debe ser numérico' }
                        ]}
                    >
                        <Input prefix={<BookOutlined />} placeholder="Ingrese el ID del aula" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="studentId"
                        label="Estudiante"
                        rules={[
                            { required: true, message: 'Por favor seleccione un estudiante' }
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Buscar estudiante..."
                            optionFilterProp="children"
                            loading={loading}
                            filterOption={filterStudents}
                            style={{ width: '100%' }}
                        >
                            {students.map(student => (
                                <Option key={student.id} value={student.id}>
                                    {`${student.firstName} ${student.lastName} - ${student.id}`}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="enrollmentDate"
                        label={
                            <span>
                                Fecha de Matrícula&nbsp;
                                <Tooltip title="La fecha seleccionada determinará automáticamente el año y periodo de matrícula">
                                    <InfoCircleOutlined style={{ color: '#1890ff' }} />
                                </Tooltip>
                            </span>
                        }
                        rules={[{ required: true, message: 'Por favor seleccione la fecha de matrícula' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Seleccione la fecha"
                            prefix={<CalendarOutlined />}
                            onChange={handleDateChange}
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="enrollmentYear"
                        label="Año de Matrícula"
                        rules={[{ required: true, message: 'Por favor seleccione el año de matrícula' }]}
                    >
                        <Select 
                            placeholder="Seleccione el año"
                            allowClear
                        >
                            {years.map(year => (
                                <Option key={year} value={year.toString()}>{year}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="enrollmentPeriod"
                        label="Periodo de Matrícula"
                        rules={[{ required: true, message: 'Por favor seleccione el periodo de matrícula' }]}
                    >
                        <Select 
                            placeholder="Seleccione el periodo"
                            allowClear
                        >
                            {years.map(year => (
                                <React.Fragment key={year}>
                                    <Option value={`${year}-1`}>Periodo 1 ({year})</Option>
                                    <Option value={`${year}-2`}>Periodo 2 ({year})</Option>
                                </React.Fragment>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit">
                        {initialValues ? 'Actualizar' : 'Crear'}
                    </Button>
                    <Button onClick={onCancel}>
                        Cancelar
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

export default EnrollmentForm;
