import React, { useState } from 'react';

const StudentFilters = ({ onFilter }) => {
  const [studentId, setStudentId] = useState('');
  const [institutionId, setInstitutionId] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ studentId, institutionId, status, gender });
  };

  const handleReset = () => {
    setStudentId('');
    setInstitutionId('');
    setStatus('');
    setGender('');
    onFilter({ studentId: '', institutionId: '', status: '', gender: '' });
  };

  return (
    <form className="form-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', marginBottom: 24 }} onSubmit={handleSubmit}>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>ID Estudiante</label>
        <input type="text" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="Buscar por ID..." />
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 1 }}>
        <label>ID Institución</label>
        <input type="text" value={institutionId} onChange={e => setInstitutionId(e.target.value)} placeholder="Institución..." />
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
        <label>Género</label>
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">Todos</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>
      <div className="form-group" style={{ minWidth: 120, flex: 'none', display: 'flex', gap: 8 }}>
        <button type="submit" className="add-button" style={{padding: '8px 16px'}}><i className="fas fa-search"></i>Buscar</button>
        <button type="button" className="add-button" style={{background:'#b0b8c1', color:'#fff', padding: '8px 16px'}} onClick={handleReset}><i className="fas fa-eraser"></i>Limpiar</button>
      </div>
    </form>
  );
};

export default StudentFilters; 