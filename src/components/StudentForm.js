import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Row, Col, Typography, Tag } from 'antd';
import { UserOutlined, IdcardOutlined, MailOutlined, PhoneOutlined, HomeOutlined, CloseCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import moment from 'moment';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';

const { Option } = Select;
const { Title } = Typography;

// Clave para almacenar en localStorage
const FORM_CACHE_KEY = 'student_form_cache';

// Función auxiliar para manejar fechas de forma segura
const safelyParseMoment = (dateValue) => {
    if (!dateValue) return null;
    
    try {
        // Si ya es un objeto moment
        if (moment.isMoment(dateValue) && dateValue.isValid()) {
            return dateValue;
        }
        
        // Si es una fecha en formato string
        const parsedDate = moment(dateValue);
        return parsedDate.isValid() ? parsedDate : null;
    } catch (error) {
        console.error("Error al parsear fecha:", error);
        return null;
    }
};

const StudentForm = ({ initialValues, onSubmit, onCancel }) => {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({});
    const [isValid, setIsValid] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});
    const [calculatedAge, setCalculatedAge] = useState(null);

    // Cargar datos del caché cuando se inicia el componente
    useEffect(() => {
        if (!initialValues) {
            try {
                const cachedData = localStorage.getItem(FORM_CACHE_KEY);
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    
                    // Convertir la fecha a objeto moment si existe
                    if (parsedData.birthDate) {
                        const parsedDate = safelyParseMoment(parsedData.birthDate);
                        if (parsedDate) {
                            parsedData.birthDate = parsedDate;
                            calculateAge(parsedDate);
                        } else {
                            delete parsedData.birthDate;
                        }
                    }
                    
                    form.setFieldsValue(parsedData);
                    setFormValues(parsedData);
                }
            } catch (error) {
                console.error("Error al cargar datos del caché:", error);
            }
        }
    }, []);

    // Inicializar formulario cuando hay valores iniciales
    useEffect(() => {
        if (initialValues) {
            try {
                const formattedValues = {...initialValues};
                
                // Manejar la fecha de nacimiento de forma segura
                if (formattedValues.birthDate) {
                    const parsedDate = safelyParseMoment(formattedValues.birthDate);
                    if (parsedDate) {
                        formattedValues.birthDate = parsedDate;
                        calculateAge(parsedDate);
                    } else {
                        delete formattedValues.birthDate;
                    }
                }
                
                form.setFieldsValue(formattedValues);
                setFormValues(formattedValues);
                setIsValid(true);
            } catch (error) {
                console.error("Error al inicializar formulario:", error);
            }
        } else {
            form.resetFields();
            setIsValid(false);
            setTouchedFields({});
        }
    }, [initialValues, form]);

    // Efecto para verificar la validez del formulario
    useEffect(() => {
        if (Object.keys(formValues).length > 0) {
            form.validateFields({ validateOnly: true })
                .then(() => setIsValid(true))
                .catch(() => setIsValid(false));
            
            // Guardar en caché cada vez que cambian los valores
            try {
                // Preparar datos para guardar en localStorage
                const dataToCache = {...formValues};
                
                // Convertir objetos moment a string para evitar problemas de serialización
                if (dataToCache.birthDate && moment.isMoment(dataToCache.birthDate)) {
                    dataToCache.birthDate = dataToCache.birthDate.format('YYYY-MM-DD');
                }
                
                localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(dataToCache));
            } catch (error) {
                console.error("Error al guardar en caché:", error);
            }
        }
    }, [formValues, form]);

    const handleSubmit = async (values) => {
        try {
            // Asegurarnos de que birthDate sea procesada correctamente antes de enviar
            const processedValues = {...values};
            
            if (processedValues.birthDate && moment.isMoment(processedValues.birthDate)) {
                processedValues.birthDate = processedValues.birthDate.format('YYYY-MM-DD');
            }
            
            const formattedValues = {
                ...processedValues,
                nameQr: `${processedValues.firstName}_${processedValues.lastName}_${processedValues.documentNumber}`,
                status: initialValues?.status || 'A'
            };
            
            await onSubmit(formattedValues);
            form.resetFields();
            // Limpiar caché después del envío exitoso
            localStorage.removeItem(FORM_CACHE_KEY);
            showSuccessAlert('Estudiante guardado correctamente');
        } catch (error) {
            showErrorAlert('Error al guardar el estudiante');
        }
    };

    // Calcular la edad basada en la fecha de nacimiento
    const calculateAge = (birthDateValue) => {
        const birthDate = safelyParseMoment(birthDateValue);
        if (!birthDate) {
            setCalculatedAge(null);
            return;
        }
        
        const today = moment();
        const years = today.diff(birthDate, 'years');
        setCalculatedAge(years);
    };

    // Validación personalizada para nombres y apellidos (solo letras y espacios)
    const validateOnlyLetters = (_, value) => {
        if (!value) return Promise.reject('Este campo es obligatorio');
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/.test(value)) {
            return Promise.reject('Solo letras y mínimo 2 caracteres');
        }
        return Promise.resolve();
    };

    // Validación personalizada para número de documento
    const validateDocumentNumber = (_, value) => {
        const docType = form.getFieldValue('documentType');
        if (!value) return Promise.reject('Por favor ingrese el número de documento');
        if (!/^\d+$/.test(value)) return Promise.reject('Solo números');
        if (docType === 'DNI' && value.length !== 8) {
            return Promise.reject('El DNI debe tener exactamente 8 dígitos');
        }
        if (docType !== 'DNI' && (value.length < 8 || value.length > 12)) {
            return Promise.reject('Debe tener entre 8 y 12 dígitos');
        }
        return Promise.resolve();
    };

    // Validación personalizada para fecha de nacimiento
    const validateBirthDate = (_, value) => {
        if (!value) return Promise.reject('Por favor seleccione la fecha de nacimiento');
        
        const birthDate = safelyParseMoment(value);
        if (!birthDate) {
            return Promise.reject('Fecha inválida');
        }
        
        const today = moment().startOf('day');
        
        // Verificar si la fecha es futura
        if (birthDate.isAfter(today)) {
            return Promise.reject('La fecha no puede ser futura');
        }
        
        // Calcular la edad
        const age = today.diff(birthDate, 'years');
        
        // Mostrar la edad calculada
        setCalculatedAge(age);
        
        // Validación más permisiva: permitir edades desde 0 hasta 120 años
        if (age > 120) {
            return Promise.reject('La edad máxima permitida es 120 años');
        }
        
        return Promise.resolve();
    };

    // Validación personalizada para teléfono
    const validatePhone = (_, value) => {
        if (!value) return Promise.reject('Por favor ingrese el teléfono');
        if (!/^9\d{8}$/.test(value)) {
            return Promise.reject('Debe empezar con 9 y tener 9 dígitos');
        }
        return Promise.resolve();
    };

    // Manejador de cambios de valores más eficiente
    const handleValuesChange = (changedValues, allValues) => {
        // Crear una copia segura de los valores
        const safeValues = {...allValues};
        
        // Si hay cambio en la fecha, asegurarse de que sea procesada correctamente
        if (changedValues.birthDate) {
            const birthDate = safelyParseMoment(changedValues.birthDate);
            if (birthDate) {
                calculateAge(birthDate);
            } else {
                setCalculatedAge(null);
            }
        }
        
        // Actualizar valores
        setFormValues(safeValues);
        
        // Marcar los campos que se han modificado como "tocados"
        const fieldsTouched = {};
        Object.keys(changedValues).forEach(fieldName => {
            fieldsTouched[fieldName] = true;
        });
        
        setTouchedFields(prev => ({
            ...prev,
            ...fieldsTouched
        }));
    };

    // Manejar cuando un campo pierde el foco (blur)
    const handleFieldBlur = (field) => () => {
        setTouchedFields(prev => ({
            ...prev,
            [field]: true
        }));
    };

    // Funciones para determinar si mostrar errores de validación
    const shouldShowValidation = (fieldName) => {
        return touchedFields[fieldName];
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="student-form"
            onValuesChange={handleValuesChange}
            validateTrigger={['onBlur', 'onChange']}
        >
            <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>
                {initialValues ? 'Editar Estudiante' : 'Crear Nuevo Estudiante'}
            </Title>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name="institutionId"
                        label="ID de Institución"
                        rules={[{ required: true, message: 'Por favor ingrese el ID de la institución' }]}
                        hasFeedback={shouldShowValidation('institutionId')}
                        validateStatus={shouldShowValidation('institutionId') ? undefined : ''}
                        onBlur={handleFieldBlur('institutionId')}
                    >
                        <Input prefix={<IdcardOutlined />} placeholder="Ingrese el ID de la institución" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="documentType"
                        label="Tipo de Documento"
                        rules={[{ required: true, message: 'Por favor seleccione el tipo de documento' }]}
                        hasFeedback={shouldShowValidation('documentType')}
                        validateStatus={shouldShowValidation('documentType') ? undefined : ''}
                        onBlur={handleFieldBlur('documentType')}
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
                        rules={[{ validator: validateOnlyLetters }]}
                        hasFeedback={shouldShowValidation('firstName')}
                        validateStatus={shouldShowValidation('firstName') ? undefined : ''}
                        onBlur={handleFieldBlur('firstName')}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Ingrese los nombres" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="lastName"
                        label="Apellidos"
                        rules={[{ validator: validateOnlyLetters }]}
                        hasFeedback={shouldShowValidation('lastName')}
                        validateStatus={shouldShowValidation('lastName') ? undefined : ''}
                        onBlur={handleFieldBlur('lastName')}
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
                        dependencies={["documentType"]}
                        rules={[{ validator: validateDocumentNumber }]}
                        hasFeedback={shouldShowValidation('documentNumber')}
                        validateStatus={shouldShowValidation('documentNumber') ? undefined : ''}
                        onBlur={handleFieldBlur('documentNumber')}
                    >
                        <Input prefix={<IdcardOutlined />} placeholder="Ingrese el número de documento" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="gender"
                        label="Género"
                        rules={[{ required: true, message: 'Por favor seleccione el género' }]}
                        hasFeedback={shouldShowValidation('gender')}
                        validateStatus={shouldShowValidation('gender') ? undefined : ''}
                        onBlur={handleFieldBlur('gender')}
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
                        label={
                            <span>
                                Fecha de Nacimiento
                                {calculatedAge !== null && (
                                    <Tag color="blue" style={{ marginLeft: 8 }}>
                                        <CalendarOutlined /> {calculatedAge} años
                                    </Tag>
                                )}
                            </span>
                        }
                        rules={[{ validator: validateBirthDate }]}
                        hasFeedback={shouldShowValidation('birthDate')}
                        validateStatus={shouldShowValidation('birthDate') ? undefined : ''}
                        onBlur={handleFieldBlur('birthDate')}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Seleccione la fecha"
                            format="YYYY-MM-DD"
                            disabledDate={(current) => current && current > moment().endOf('day')}
                            onChange={(date) => {
                                // Actualizar manualmente el campo para asegurar que se refleje visualmente
                                if (date) {
                                    form.setFieldsValue({ birthDate: date });
                                    calculateAge(date);
                                }
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="phone"
                        label="Teléfono"
                        rules={[{ validator: validatePhone }]}
                        hasFeedback={shouldShowValidation('phone')}
                        validateStatus={shouldShowValidation('phone') ? undefined : ''}
                        onBlur={handleFieldBlur('phone')}
                    >
                        <Input prefix={<PhoneOutlined />} placeholder="Ingrese el teléfono" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="address"
                label="Dirección"
                rules={[{ required: true, message: 'Por favor ingrese la dirección' }]}
                hasFeedback={shouldShowValidation('address')}
                validateStatus={shouldShowValidation('address') ? undefined : ''}
                onBlur={handleFieldBlur('address')}
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
                hasFeedback={shouldShowValidation('email')}
                validateStatus={shouldShowValidation('email') ? undefined : ''}
                onBlur={handleFieldBlur('email')}
            >
                <Input prefix={<MailOutlined />} placeholder="Ingrese el email" />
            </Form.Item>

            <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        disabled={!isValid && Object.keys(touchedFields).length > 0}
                        style={{ 
                            minWidth: '120px', 
                            height: '44px',
                            fontSize: '16px',
                            borderRadius: '8px'
                        }}
                    >
                        {initialValues ? 'Actualizar' : 'Crear'}
                    </Button>
                    <Button 
                        onClick={() => {
                            onCancel();
                            // No eliminar el caché al cancelar para mantener los datos
                        }}
                        style={{ 
                            minWidth: '120px', 
                            height: '44px',
                            fontSize: '16px',
                            borderRadius: '8px'
                        }}
                    >
                        Cancelar
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default StudentForm;
