import React, { useState } from 'react';

const EnrollmentFilters = ({ onFilter }) => {
  const [enrollmentId, setEnrollmentId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classroomId, setClassroomId] = useState('');
  const [status, setStatus] = useState('');
  const [enrollmentYear, setEnrollmentYear] = useState('');
  const [enrollmentPeriod, setEnrollmentPeriod] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ enrollmentId, studentId, classroomId, status, enrollmentYear, enrollmentPeriod });
  };

  const handleReset = () => {
    setEnrollmentId('');
    setStudentId('');
    setClassroomId('');
    setStatus('');
    setEnrollmentYear('');
    setEnrollmentPeriod('');
    onFilter({ enrollmentId: '', studentId: '', classroomId: '', status: '', enrollmentYear: '', enrollmentPeriod: '' });
  };

  return (
    <form className="form-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', marginBottom: 24 }} onSubmit={handleSubmit}>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>ID Matrícula</label>
        <input type="text" value={enrollmentId} onChange={e => setEnrollmentId(e.target.value)} placeholder="Buscar por ID..." />
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>ID Estudiante</label>
        <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="ID Estudiante..." />
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>ID Aula</label>
        <input type="text" value={classroomId} onChange={e => setClassroomId(e.target.value)} placeholder="ID Aula..." />
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>Estado</label>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>Año</label>
        <input type="text" value={enrollmentYear} onChange={e => setEnrollmentYear(e.target.value)} placeholder="Año..." />
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>Periodo</label>
        <input type="text" value={enrollmentPeriod} onChange={e => setEnrollmentPeriod(e.target.value)} placeholder="Periodo..." />
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 'none', display: 'flex', gap: 8 }}>
        <button type="submit" className="add-button" style={{padding: '8px 16px'}}><i className="fas fa-search"></i>Buscar</button>
        <button type="button" className="add-button" style={{background:'#b0b8c1', color:'#fff', padding: '8px 16px'}} onClick={handleReset}><i className="fas fa-eraser"></i>Limpiar</button>
      </div>
    </form>
  );
};

export default EnrollmentFilters; 