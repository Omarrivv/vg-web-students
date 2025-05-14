import React, { useState, useEffect } from 'react';

function StudentForm({ initialData, onSubmit, onCancel }) {
  // Estado inicial para un nuevo estudiante o para editar uno existente
  const defaultStudent = {
    institutionId: '1', // Puedes hacerlo dinámico si tienes múltiples instituciones
    firstName: '',
    lastName: '',
    documentType: 'DNI', // Valor por defecto
    documentNumber: '',
    gender: 'M', // Valor por defecto
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    // nameQr: '', // Generalmente se genera en el backend o al guardar
    status: 'A' // Valor por defecto
  };

  const [student, setStudent] = useState(defaultStudent);

  // Si recibimos initialData (para editar), actualizamos el estado
  useEffect(() => {
    if (initialData) {
      // Formatear fecha para input type="date"
      const formattedData = {
          ...initialData,
          birthDate: initialData.birthDate ? initialData.birthDate.split('T')[0] : '' // Asegura yyyy-MM-dd
      };
      setStudent(formattedData);
    } else {
      setStudent(defaultStudent); // Resetear a valores por defecto si no hay data inicial (ej. al abrir para crear)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]); // Se ejecuta cuando initialData cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Preparamos los datos para enviar, podríamos añadir validaciones aquí
    const studentToSend = {
        ...student,
        // El nameQr se podría generar aquí o dejárselo al backend
        nameQr: `${student.firstName}_${student.lastName}_${student.documentNumber}`
    };
    onSubmit(studentToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Campos del formulario */}
      <div className="form-group">
        <label htmlFor="firstName">Nombres</label>
        <input type="text" id="firstName" name="firstName" value={student.firstName} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Apellidos</label>
        <input type="text" id="lastName" name="lastName" value={student.lastName} onChange={handleChange} required />
      </div>

      <div style={{ display: 'flex', gap: '15px' }}> {/* Contenedor Flex para campos en línea */}
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="documentType">Tipo Documento</label>
            <select id="documentType" name="documentType" value={student.documentType} onChange={handleChange} required>
              <option value="DNI">DNI</option>
              <option value="CE">Carnet Extranjería</option>
              <option value="PAS">Pasaporte</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 2 }}>
            <label htmlFor="documentNumber">Número Documento</label>
            <input type="text" id="documentNumber" name="documentNumber" value={student.documentNumber} onChange={handleChange} required />
          </div>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="gender">Género</label>
            <select id="gender" name="gender" value={student.gender} onChange={handleChange} required>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="birthDate">Fecha Nacimiento</label>
            <input type="date" id="birthDate" name="birthDate" value={student.birthDate} onChange={handleChange} required />
          </div>
      </div>

      <div className="form-group">
        <label htmlFor="address">Dirección</label>
        <input type="text" id="address" name="address" value={student.address} onChange={handleChange} />
      </div>

       <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="phone">Teléfono</label>
                <input type="tel" id="phone" name="phone" value={student.phone} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={student.email} onChange={handleChange} required />
            </div>
       </div>

       <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select id="status" name="status" value={student.status} onChange={handleChange} required>
              <option value="A">Activo</option>
              <option value="I">Inactivo</option>
            </select>
       </div>

        {/* Institution ID (podría ser un campo oculto o un selector si hay varias) */}
        <input type="hidden" name="institutionId" value={student.institutionId} />

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel">Cancelar</button>
        <button type="submit">{initialData ? 'Actualizar' : 'Crear'} Estudiante</button>
      </div>
    </form>
  );
}

export default StudentForm;
