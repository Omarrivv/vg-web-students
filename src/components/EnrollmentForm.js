import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { BookOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';

const { Option } = Select;

const EnrollmentForm = ({ initialValues, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

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
            showErrorAlert('Error al guardar la matrícula');
        }
    };

    const currentYear = moment().year();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

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
                        label="ID de Estudiante"
                        rules={[
                            { required: true, message: 'Por favor ingrese el ID del estudiante' },
                            { pattern: /^[a-zA-Z0-9-]+$/, message: 'ID de estudiante inválido' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Ingrese el ID del estudiante" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="enrollmentDate"
                        label="Fecha de Matrícula"
                        rules={[{ required: true, message: 'Por favor seleccione la fecha de matrícula' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Seleccione la fecha"
                            prefix={<CalendarOutlined />}
                            disabledDate={(current) => current && current > moment().endOf('day')}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="enrollmentYear"
                        label="Año de Matrícula"
                        rules={[{ required: true, message: 'Por favor seleccione el año de matrícula' }]}
                    >
                        <Select placeholder="Seleccione el año">
                            {years.map(year => (
                                <Option key={year} value={year.toString()}>{year}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="enrollmentPeriod"
                label="Periodo de Matrícula"
                rules={[{ required: true, message: 'Por favor seleccione el periodo de matrícula' }]}
            >
                <Select placeholder="Seleccione el periodo">
                    {years.map(year => (
                        <React.Fragment key={year}>
                            <Option value={`${year}-1`}>{year}-1</Option>
                            <Option value={`${year}-2`}>{year}-2</Option>
                        </React.Fragment>
                    ))}
                </Select>
            </Form.Item>

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
