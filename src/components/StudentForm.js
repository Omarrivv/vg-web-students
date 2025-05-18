import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col } from 'antd';
import { UserOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';

const { Option } = Select;

const StudentForm = ({ initialValues, onSubmit, onCancel }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                birthDate: initialValues.birthDate ? moment(initialValues.birthDate) : null,
            });
        } else {
            form.resetFields();
        }
    }, [initialValues, form]);

    const handleSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values,
                birthDate: values.birthDate.format('YYYY-MM-DD'),
                nameQr: `${values.firstName}_${values.lastName}_${values.documentNumber}`,
                status: 'A'
            };
            await onSubmit(formattedValues);
            form.resetFields();
            showSuccessAlert('Estudiante guardado correctamente');
        } catch (error) {
            showErrorAlert('Error al guardar el estudiante');
        }
    };

    const validateDocumentNumber = (_, value) => {
        if (!value) {
            return Promise.reject('Por favor ingrese el número de documento');
        }
        if (!/^\d{8,12}$/.test(value)) {
            return Promise.reject('El número de documento debe tener entre 8 y 12 dígitos');
        }
        return Promise.resolve();
    };

    const validatePhone = (_, value) => {
        if (!value) {
            return Promise.reject('Por favor ingrese el teléfono');
        }
        if (!/^\d{9,9}$/.test(value)) {
            return Promise.reject('El teléfono debe tener entre 9 dígitos y que empiese con 9');
        }
        return Promise.resolve();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="student-form"
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="institutionId"
                        label="ID de Institución"
                        rules={[{ required: true, message: 'Por favor ingrese el ID de la institución' }]}
                    >
                        <Input prefix={<IdcardOutlined />} placeholder="Ingrese el ID de la institución" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="documentType"
                        label="Tipo de Documento"
                        rules={[{ required: true, message: 'Por favor seleccione el tipo de documento' }]}
                    >
                        <Select placeholder="Seleccione el tipo de documento">
                            <Option value="DNI">DNI</Option>
                            <Option value="CE">CE</Option>
                            <Option value="PASAPORTE">PASAPORTE</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="firstName"
                        label="Nombres"
                        rules={[
                            { required: true, message: 'Por favor ingrese los nombres' },
                            { min: 2, message: 'Los nombres deben tener al menos 2 caracteres' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Ingrese los nombres" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="lastName"
                        label="Apellidos"
                        rules={[
                            { required: true, message: 'Por favor ingrese los apellidos' },
                            { min: 2, message: 'Los apellidos deben tener al menos 2 caracteres' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Ingrese los apellidos" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="documentNumber"
                        label="Número de Documento"
                        rules={[{ validator: validateDocumentNumber }]}
                    >
                        <Input prefix={<IdcardOutlined />} placeholder="Ingrese el número de documento" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="Género"
                        rules={[{ required: true, message: 'Por favor seleccione el género' }]}
                    >
                        <Select placeholder="Seleccione el género">
                            <Option value="M">Masculino</Option>
                            <Option value="F">Femenino</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="birthDate"
                        label="Fecha de Nacimiento"
                        rules={[{ required: true, message: 'Por favor seleccione la fecha de nacimiento' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Seleccione la fecha"
                            disabledDate={(current) => current && current > moment().endOf('day')}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="phone"
                        label="Teléfono"
                        rules={[{ validator: validatePhone }]}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Ingrese el teléfono" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="address"
                label="Dirección"
                rules={[{ required: true, message: 'Por favor ingrese la dirección' }]}
            >
                <Input prefix={<HomeOutlined />} placeholder="Ingrese la dirección" />
            </Form.Item>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: 'Por favor ingrese el email' },
                    { type: 'email', message: 'Por favor ingrese un email válido' }
                ]}
            >
                <Input prefix={<MailOutlined />} placeholder="Ingrese el email" />
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

export default StudentForm;
