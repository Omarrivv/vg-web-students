import React, { useState, useEffect } from 'react';
import '../App.css';

function EnrollmentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    classroomId: '',
    studentId: '',
    enrollmentDate: '',
    enrollmentYear: '',
    enrollmentPeriod: '',
    status: 'A'
  });

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      // Formatear la fecha para el input date (YYYY-MM-DD)
      const formattedDate = initialData.enrollmentDate ? 
        new Date(initialData.enrollmentDate).toISOString().split('T')[0] : '';

      setFormData({
        classroomId: initialData.classroomId || '',
        studentId: initialData.studentId || '',
        enrollmentDate: formattedDate,
        enrollmentYear: initialData.enrollmentYear || '',
        enrollmentPeriod: initialData.enrollmentPeriod || '',
        status: initialData.status || 'A'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convertir la fecha a formato ISO
    const enrollmentData = {
      ...formData,
      enrollmentDate: formData.enrollmentDate ? new Date(formData.enrollmentDate).toISOString() : null
    };
    
    onSubmit(enrollmentData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label htmlFor="classroomId">ID del Aula:</label>
        <input
          type="text"
          id="classroomId"
          name="classroomId"
          value={formData.classroomId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="studentId">ID del Estudiante:</label>
        <input
          type="text"
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="enrollmentDate">Fecha de Matrícula:</label>
        <input
          type="date"
          id="enrollmentDate"
          name="enrollmentDate"
          value={formData.enrollmentDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="enrollmentYear">Año de Matrícula:</label>
        <input
          type="text"
          id="enrollmentYear"
          name="enrollmentYear"
          value={formData.enrollmentYear}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="enrollmentPeriod">Periodo:</label>
        <input
          type="text"
          id="enrollmentPeriod"
          name="enrollmentPeriod"
          value={formData.enrollmentPeriod}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Estado:</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-button">
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" onClick={onCancel} className="cancel-button">
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default EnrollmentForm;
