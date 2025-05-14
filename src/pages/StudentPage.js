import React, { useState, useEffect } from 'react';
import { getAllStudents, getStudentById, getStudentsByInstitution, getStudentsByStatus, getStudentsByGender, createStudent, updateStudent, deleteStudent } from '../services/studentService';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import StudentFilters from '../components/StudentFilters';
import '../App.css';

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Nueva función para filtrar
  const handleFilter = async (filters) => {
    setLoading(true);
    setError(null);
    setFeedbackMessage('');
    try {
      if (filters.studentId) {
        // Buscar por ID
        const res = await getStudentById(filters.studentId);
        setStudents(res.data ? [res.data] : []);
      } else if (filters.institutionId) {
        // Filtrar por institución
        const res = await getStudentsByInstitution(filters.institutionId);
        setStudents(res.data);
      } else if (filters.status) {
        // Filtrar por estado
        const res = await getStudentsByStatus(filters.status);
        setStudents(res.data);
      } else if (filters.gender) {
        // Filtrar por género
        const res = await getStudentsByGender(filters.gender);
        setStudents(res.data);
      } else {
        // Todos
        fetchStudents();
      }
    } catch (err) {
      setError('Error al filtrar estudiantes.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar estudiantes
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los estudiantes. Asegúrate de que el backend esté corriendo en http://localhost:8081.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchStudents();
  }, []);

  // Abrir modal para crear o editar
  const handleOpenModal = (student = null) => {
    setEditingStudent(student);
    setIsModalOpen(true);
    setFeedbackMessage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  // Crear estudiante
  const handleCreateStudent = async (studentData) => {
    try {
      setLoading(true);
      await createStudent(studentData);
      setFeedbackMessage('Estudiante creado con éxito!');
      handleCloseModal();
      fetchStudents();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al crear el estudiante.';
      setFeedbackMessage(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar estudiante
  const handleUpdateStudent = async (studentData) => {
    if (!editingStudent?.id) return;
    try {
      setLoading(true);
      await updateStudent(editingStudent.id, studentData);
      setFeedbackMessage('Estudiante actualizado con éxito!');
      handleCloseModal();
      fetchStudents();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar el estudiante.';
      setFeedbackMessage(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar estudiante
  const handleDeleteStudent = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        setLoading(true);
        await deleteStudent(id);
        setFeedbackMessage('Estudiante eliminado con éxito!');
        fetchStudents();
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Error al eliminar el estudiante.';
        setFeedbackMessage(errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    }
  };

  // Determina qué función de submit usar (crear o actualizar)
  const handleSubmit = (studentData) => {
    if (editingStudent) {
      handleUpdateStudent(studentData);
    } else {
      handleCreateStudent(studentData);
    }
  };

  return (
    <div>
      <h1>Gestión de Estudiantes</h1>

      {/* Filtros avanzados */}
      <StudentFilters onFilter={handleFilter} />

      <button onClick={() => handleOpenModal()} className="add-button"><i className="fas fa-plus"></i> Añadir Estudiante</button>

      {feedbackMessage && (
        <p className={`feedback-message ${feedbackMessage.includes('Error') ? 'error' : 'success'}`}>{feedbackMessage}</p>
      )}
      {loading && <p>Cargando...</p>}
      {error && !loading && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Documento</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td data-label="Nombre">{student.firstName}</td>
                  <td data-label="Apellido">{student.lastName}</td>
                  <td data-label="Documento">{`${student.documentType}: ${student.documentNumber}`}</td>
                  <td data-label="Email">{student.email}</td>
                  <td data-label="Teléfono">{student.phone}</td>
                  <td data-label="Estado">{student.status === 'A' ? 'Activo' : 'Inactivo'}</td>
                  <td data-label="Acciones">
                    <button onClick={() => handleOpenModal(student)} className="edit"><i className="fas fa-edit"></i> Editar</button>
                    <button onClick={() => handleDeleteStudent(student.id)} className="delete"><i className="fas fa-trash"></i> Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay estudiantes para mostrar.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStudent ? "Editar Estudiante" : "Crear Nuevo Estudiante"}>
        <StudentForm 
          initialData={editingStudent}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default StudentPage;
